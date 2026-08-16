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
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
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

function extractText(
  value: any
): string {
  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  if (
    Array.isArray(value)
  ) {
    return value
      .map(extractText)
      .join(" ");
  }

  if (
    value &&
    typeof value === "object"
  ) {
    return Object.values(value)
      .map(extractText)
      .join(" ");
  }

  return "";
}

/**
 * AI ke returned object ko
 * LAST OBJECT ke exact structure
 * mein convert karta hai.
 *
 * AI koi extra key de:
 * -> ignore
 *
 * AI key miss kare:
 * -> template value
 *
 * Nested object bhi preserve hota hai.
 */
function normalizeToTemplate(
  template: any,
  result: any
): any {
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
      (item, index) =>
        normalizeToTemplate(
          template[
            Math.min(
              index,
              template.length - 1
            )
          ],
          item
        )
    );
  }

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
      const templateValue =
        template[key];

      const resultValue =
        result &&
        typeof result === "object" &&
        !Array.isArray(result) &&
        Object.prototype.hasOwnProperty.call(
          result,
          key
        )
          ? result[key]
          : undefined;

      if (
        resultValue === undefined
      ) {
        output[key] =
          structuredClone(
            templateValue
          );
      } else {
        output[key] =
          normalizeToTemplate(
            templateValue,
            resultValue
          );
      }
    }

    return output;
  }

  if (
    result === null ||
    result === undefined
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
    throw new Error(
      "Hugging Face response is not valid JSON"
    );
  }
}

async function generateJob(
  webpage: string,
  sourceUrl: string,
  template: any
) {
  const prompt = `
You are an expert government recruitment
information extraction and original article
writing agent.

OFFICIAL SOURCE:
${sourceUrl}

RULES:

1. Use ONLY supplied webpage content.
2. Do NOT use another website.
3. Do NOT use PDF content.
4. Do NOT invent facts.
5. Do NOT guess facts.
6. Do NOT guess dates.
7. Do NOT guess vacancies.
8. Do NOT guess fees.
9. Do NOT guess eligibility.
10. Do NOT guess salary.
11. Do NOT invent links.

JSON RULES:

Return exactly ONE JSON object.

The object must follow the TEMPLATE.

Do not add keys.
Do not remove keys.
Do not rename keys.

ARTICLE RULES:

Write an ORIGINAL article.

Minimum:
1000 words.

Target:
1000-1500 words.

Do not copy sentences or paragraphs
from the source.

Use original wording.

Cover information where available:

- Introduction
- Recruitment overview
- Important dates
- Application fee
- Vacancy details
- Educational qualification
- Eligibility
- Age limit
- Age relaxation
- Salary/pay scale
- Selection process
- How to apply
- Required documents
- Important links
- FAQs
- Conclusion

Never invent information just to reach
1000 words.

TEMPLATE:

${JSON.stringify(
  template,
  null,
  2
)}

WEBPAGE CONTENT:

${webpage}
`;

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

      temperature: 0.2,
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
  const rawResult =
    await generateJob(
      webpage,
      sourceUrl,
      template
    );

  /*
   * Force AI result into
   * LAST OBJECT structure.
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

  if (!validation.valid) {
    throw new Error(
      `AI structure validation failed: ${validation.reason}`
    );
  }

  /*
   * Article validation.
   */
  const article =
    extractText(
      result.content
    );

  const words =
    countWords(article);

  console.log(
    `Article word count: ${words}`
  );

  if (words < 1000) {
    throw new Error(
      `Article is below 1000 words: ${words}`
    );
  }

  console.log(
    `Article accepted: ${words} words`
  );

  return result;
}