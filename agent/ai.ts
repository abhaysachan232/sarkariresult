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
 * AI ke extra keys remove karta hai.
 *
 * Template ki missing keys preserve
 * karta hai.
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
    typeof template === "object"
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

==================================================
SOURCE RULES
==================================================

Use ONLY the supplied official webpage.

Do NOT use:
- PDF
- another website
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
SOURCE WEBSITE BRANDING RULE
==================================================

The source website is ONLY being used
as a source of information.

NEVER mention the source website in the
generated content.

NEVER write:

sarkariresult.com.cm

SarkariResult.com.cm

Sarkari Result

SarkariResult

NEVER write sentences such as:

"According to SarkariResult..."

"As per SarkariResult..."

"Visit SarkariResult..."

"Source: SarkariResult..."

"Read more on SarkariResult..."

Do NOT put the source website URL into
the article.

Do NOT create links pointing to the
source website.

The destination website should contain
original content without source-site
branding.

IMPORTANT:

Actual official links found on the
webpage MAY be retained when they are
genuine official links for:

- application
- registration
- result
- admit card
- answer key
- official notification
- official website

Examples of legitimate official domains
may include government or examination
organization domains.

Do NOT replace an official link with
the source website link.

==================================================
JSON STRUCTURE RULES
==================================================

Return exactly ONE JSON object.

The JSON structure MUST be identical
to the supplied TEMPLATE.

Rules:

1. Do NOT add any new key.
2. Do NOT remove any existing key.
3. Do NOT rename any key.
4. Preserve nested objects.
5. Preserve arrays.
6. Preserve exact field names.
7. Preserve existing value types.
8. Do not create new fields.
9. Do not create new nested fields.
10. Do not create an "article" key unless
    it already exists in the template.

The LAST OBJECT of jobs.json is the
TEMPLATE.

Follow it exactly.

==================================================
IMPORTANT LINKS RULES
==================================================

The supplied webpage content may contain a section
named:

IMPORTANT LINKS FROM PAGE

Each line has this exact format:

LEFT SIDE LABEL | ACTUAL HREF

For example:

Download Tier-II Result | https://official-domain.example/result
Download Tier-II Answer Key | https://official-domain.example/answer-key

IMPORTANT:

1. Preserve EVERY supplied important-link row.
2. Preserve the LEFT SIDE LABEL exactly.
3. Preserve the ACTUAL HREF exactly.
4. Put these links into the existing links field
   or the existing nested link structure of the
   TEMPLATE, wherever those links belong.
5. Do NOT replace the actual href with the source
   webpage URL.
6. Do NOT replace the label with "Click Here".
7. The left-side label is the link title/text.
8. The supplied href is the link URL.
9. Do NOT invent an href.
10. Do NOT remove a supplied official link.
11. Links to sarkariresult.com.cm have already been
    filtered out and must never be re-created.
12. If the template has an existing links array,
    preserve its exact structure and field names.
13. Do NOT create a new key merely for these links.
14. Only use keys that already exist in the TEMPLATE.

==================================================
==================================================
ARTICLE RULES
==================================================

The complete article must be written
inside the existing:

content[1].body

field.

This field already exists in the template.

Do NOT create another article field.

Do NOT create another body field.

Do NOT put the article in another field.

Write detailed and useful original content
based ONLY on the supplied webpage.

Do not make it an unnecessarily short
summary.

Use all relevant factual information
available on the webpage.

Where supported, explain:

- Introduction
- Recruitment / Result / Answer Key overview
- Important Dates
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

Only include information supported by
the webpage.

If a detail is unavailable, do NOT invent it.

Do NOT use PDF information.

Do NOT use another website.

Do NOT mention the source website.

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

No code fence.

No explanation.

No text before JSON.

No text after JSON.
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
 * Main AI extraction.
 *
 * No word-count validation.
 *
 * Maximum 3 attempts.
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
       * Extra keys remove.
       *
       * Missing keys restore from template.
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