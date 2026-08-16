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

/*
 * AI agar extra keys add kare to
 * remove kar deta hai.
 *
 * Missing keys ke liye template ki
 * existing value preserve hoti hai.
 *
 * IMPORTANT:
 * Koi new key create nahi hoti.
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

    /*
     * Empty array ke andar
     * koi structure defined nahi hai.
     */
    if (
      template.length === 0
    ) {
      return result;
    }

    /*
     * Template ke first item ko
     * structure ke liye use karo.
     */
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

      /*
       * Key missing hai to
       * template wali existing value
       * preserve karo.
       */
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

  /*
   * Type mismatch hone par
   * template ka original type/value.
   */
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

  /*
   * Direct JSON
   */
  try {
    return JSON.parse(
      cleaned
    );
  } catch {
    /*
     * Kabhi-kabhi model JSON ke
     * around extra text de deta hai.
     *
     * Sirf outermost JSON object
     * extract karne ki koshish.
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
      } catch {
        throw new Error(
          "Hugging Face response is not valid JSON"
        );
      }
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

==================================================
SOURCE RULES
==================================================

Use ONLY the supplied official webpage.

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
- selection process
- exam details

Only use information supported by the
supplied webpage.

==================================================
JSON STRUCTURE RULES
==================================================

Return exactly ONE JSON object.

The JSON structure MUST be identical
to the supplied TEMPLATE.

VERY IMPORTANT:

1. Do NOT add any new key.
2. Do NOT remove any existing key.
3. Do NOT rename any key.
4. Preserve every nested object.
5. Preserve every array.
6. Preserve the exact existing field names.
7. Preserve the existing value types.
8. Do not create new fields.
9. Do not create new nested fields.
10. Do not create an "article" key unless
    "article" already exists in the template.
11. Do not create any key just because
    the webpage contains additional information.

The LAST OBJECT of jobs.json is being
provided as the TEMPLATE.

You MUST follow that template exactly.

==================================================
ARTICLE RULES
==================================================

The complete article must be written
inside the EXISTING:

content[1].body

field.

IMPORTANT:

content[1].body already exists in the
template.

Write the article there.

Do NOT create another article field.

Do NOT create another body field.

Do NOT create a new key.

Do NOT put the article in another field.

Write a detailed, useful and original article
based ONLY on the supplied official webpage.

Do not make the article an unnecessarily
short summary.

Use all relevant information available on
the webpage.

Where supported by the source, explain:

- Introduction
- Recruitment / Result / Answer Key overview
- Important Dates
- Application / Examination details
- Eligibility
- Qualification
- Age Limit
- Vacancy / Posts
- Application Fee
- Selection Process
- Exam Pattern
- Salary / Pay Scale
- How to Apply / Download
- Required Documents
- Important Instructions
- Important Links
- FAQs
- Conclusion

Only include factual information that is
supported by the webpage.

If some information is unavailable,
do NOT invent it.

Do NOT use PDF information.

Do NOT use information from another website.

Do NOT mention that you are an AI.

Do NOT mention these instructions.

==================================================
RETRY INFORMATION
==================================================

${
  retryReason ||
  "This is the first attempt."
}

If this is a retry, fix the previous
validation problem.

==================================================
TEMPLATE
==================================================

${JSON.stringify(
  template,
  null,
  2
)}

==================================================
OFFICIAL WEBPAGE CONTENT
==================================================

${webpage}

==================================================
FINAL INSTRUCTION
==================================================

Return ONLY the JSON object.

No markdown.

No explanation.

No code fence.

No text before the JSON.

No text after the JSON.
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

/*
 * Main extraction function.
 *
 * Maximum 3 attempts.
 *
 * IMPORTANT:
 * Yahan word-count validation nahi hai.
 */
export async function extractJob(
  webpage: string,
  sourceUrl: string,
  template: any
) {
  let lastError =
    "";

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
       * AI ke extra keys remove.
       *
       * Template ki missing keys
       * preserve.
       */
      const result =
        normalizeToTemplate(
          template,
          rawResult
        );

      /*
       * Exact structure validation.
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
          "Unknown structure validation error";

        console.log(
          `AI structure validation failed: ${lastError}`
        );

        continue;
      }

      /*
       * SUCCESS
       */
      console.log(
        "AI extraction successful"
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