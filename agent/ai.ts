import {
  InferenceClient,
} from "@huggingface/inference";

import {
  validateExactStructure,
} from "./json";

const token =
  process.env.HF_TOKEN;

if (!token) {
  throw new Error(
    "HF_TOKEN is missing"
  );
}

const hf =
  new InferenceClient(token);

const MODEL =
  process.env.HF_MODEL ||
  "Qwen/Qwen3-4B-Instruct-2507";

function cleanJson(
  text: string
) {
  return text
    .replace(
      /^```json\s*/i,
      ""
    )
    .replace(
      /^```\s*/i,
      ""
    )
    .replace(
      /\s*```$/i,
      ""
    )
    .trim();
}

function countWords(
  text: string
) {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

/*
 * Object ke andar long article text
 * search karta hai.
 */
function getLongestText(
  value: any
): {
  path: string;
  text: string;
} {
  let longest = {
    path: "",
    text: "",
  };

  function walk(
    current: any,
    currentPath: string
  ) {
    if (
      typeof current ===
      "string"
    ) {
      if (
        countWords(current) >
        countWords(
          longest.text
        )
      ) {
        longest = {
          path: currentPath,
          text: current,
        };
      }

      return;
    }

    if (
      Array.isArray(current)
    ) {
      current.forEach(
        (item, index) =>
          walk(
            item,
            `${currentPath}[${index}]`
          )
      );

      return;
    }

    if (
      current &&
      typeof current ===
        "object"
    ) {
      Object.keys(
        current
      ).forEach(
        (key) =>
          walk(
            current[key],
            currentPath
              ? `${currentPath}.${key}`
              : key
          )
      );
    }
  }

  walk(value, "");

  return longest;
}

/*
 * AI extra keys add kare
 * to remove.
 *
 * Missing keys:
 * template value preserve.
 */
function normalizeToTemplate(
  template: any,
  result: any
): any {
  /*
   * Array
   */
  if (
    Array.isArray(template)
  ) {
    if (
      !Array.isArray(result)
    ) {
      return structuredClone(
        template
      );
    }

    if (
      template.length === 0
    ) {
      return result;
    }

    return result.map(
      (item) =>
        normalizeToTemplate(
          template[0],
          item
        )
    );
  }

  /*
   * Object
   */
  if (
    template !== null &&
    typeof template ===
      "object"
  ) {
    const output: any = {};

    for (
      const key of Object.keys(
        template
      )
    ) {
      const exists =
        result &&
        typeof result ===
          "object" &&
        !Array.isArray(
          result
        ) &&
        Object.prototype.hasOwnProperty.call(
          result,
          key
        );

      if (!exists) {
        output[key] =
          structuredClone(
            template[key]
          );

        continue;
      }

      output[key] =
        normalizeToTemplate(
          template[key],
          result[key]
        );
    }

    return output;
  }

  /*
   * Primitive
   */
  if (
    result === undefined ||
    result === null
  ) {
    return template;
  }

  if (
    typeof result !==
    typeof template
  ) {
    return template;
  }

  return result;
}

function parseJSON(
  output: string
) {
  const cleaned =
    cleanJson(output);

  try {
    return JSON.parse(
      cleaned
    );
  } catch {
    /*
     * Sometimes model JSON ke
     * around extra text de deta hai.
     */
    const start =
      cleaned.indexOf("{");

    const end =
      cleaned.lastIndexOf("}");

    if (
      start !== -1 &&
      end !== -1 &&
      end > start
    ) {
      try {
        return JSON.parse(
          cleaned.slice(
            start,
            end + 1
          )
        );
      } catch {}
    }

    throw new Error(
      "Hugging Face response is not valid JSON"
    );
  }
}

function createPrompt(
  webpage: string,
  sourceUrl: string,
  template: any,
  retryReason?: string
) {
  return `
You are a government recruitment
information extraction agent.

OFFICIAL SOURCE URL:
${sourceUrl}

IMPORTANT:

Use ONLY the supplied webpage.

Do NOT use:
- PDF
- other websites
- external knowledge
- guesses
- assumptions

Do NOT invent:
- dates
- vacancies
- fees
- age
- qualification
- salary
- links
- eligibility

========================
JSON STRUCTURE RULES
========================

Return exactly ONE JSON object.

The JSON structure MUST be exactly
the same as the TEMPLATE.

Rules:

1. Do not add any key.
2. Do not remove any key.
3. Do not rename any key.
4. Preserve every nested object.
5. Preserve every array.
6. Use the exact existing key names.
7. Use the same value types.
8. If information is unavailable,
   keep the template value/type.
9. Do not create a new field.
10. Do not create a new nested field.

The LAST OBJECT of jobs.json is the
template.

========================
ARTICLE RULES
========================

Write an ORIGINAL article.

Minimum article length:
1000 words.

Target:
1000-1500 words.

Use natural Hindi/Hinglish/English
according to the source and template.

Do NOT copy the source sentence-by-sentence.

Use only facts supported by the
official webpage.

Where supported, explain:

- Introduction
- Recruitment overview
- Important dates
- Application fee
- Vacancy
- Qualification
- Eligibility
- Age limit
- Age relaxation
- Salary/pay scale
- Selection process
- Exam information
- How to apply
- Documents
- Important links
- FAQs
- Conclusion

If a particular fact is not available,
do NOT invent it.

Put the article into an EXISTING
long-text field from the template.

Do NOT create an "article" key if it
does not already exist.

========================
PREVIOUS VALIDATION ERROR
========================

${
  retryReason ||
  "None"
}

If this is a retry, carefully make
the JSON structure EXACTLY match the
template.

========================
TEMPLATE
========================

${JSON.stringify(
  template,
  null,
  2
)}

========================
OFFICIAL WEBPAGE
========================

${webpage}

Return ONLY JSON.
`;
}

async function callAI(
  prompt: string
) {
  const response =
    await hf.chatCompletion({
      model: MODEL,

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      max_tokens: 12000,

      temperature: 0.15,
    });

  const output =
    response.choices?.[0]
      ?.message?.content;

  if (!output) {
    throw new Error(
      "Empty Hugging Face response"
    );
  }

  return parseJSON(
    output
  );
}

export async function extractJob(
  webpage: string,
  sourceUrl: string,
  template: any
) {
  let lastError =
    "";

  /*
   * Maximum 3 attempts.
   */
  for (
    let attempt = 1;
    attempt <= 3;
    attempt++
  ) {
    try {
      console.log(
        `AI attempt ${attempt}/3`
      );

      const prompt =
        createPrompt(
          webpage,
          sourceUrl,
          template,
          lastError
        );

      const rawResult =
        await callAI(
          prompt
        );

      /*
       * Extra keys remove,
       * missing template keys restore.
       */
      const result =
        normalizeToTemplate(
          template,
          rawResult
        );

      /*
       * Exact structure check.
       */
      const validation =
        validateExactStructure(
          template,
          result
        );

      if (
        !validation.valid
      ) {
        lastError =
          validation.reason ||
          "Unknown structure error";

        console.log(
          `Structure validation failed: ${lastError}`
        );

        continue;
      }

      /*
       * Longest text field.
       */
      const article =
        getLongestText(
          result
        );

      const words =
        countWords(
          article.text
        );

      console.log(
        `Longest text field: ${article.path}`
      );

      console.log(
        `Article word count: ${words}`
      );

      if (
        words < 1000
      ) {
        lastError =
          `Article below 1000 words. Current: ${words}.`;

        console.log(
          lastError
        );

        continue;
      }

      console.log(
        `Article accepted: ${words} words`
      );

      return result;
    } catch (
      error: any
    ) {
      lastError =
        error?.message ||
        "Unknown AI error";

      console.error(
        `AI attempt ${attempt} failed: ${lastError}`
      );
    }
  }

  throw new Error(
    `AI extraction failed after 3 attempts: ${lastError}`
  );
}