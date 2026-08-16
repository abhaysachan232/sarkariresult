import {
  InferenceClient,
} from "@huggingface/inference";

import {
  validateExactStructure,
} from "./json";

const token = process.env.HF_TOKEN;

if (!token) {
  throw new Error("HF_TOKEN is missing");
}

const hf = new InferenceClient(token);

const MODEL =
  process.env.HF_MODEL ||
  "Qwen/Qwen3-4B-Instruct-2507";

function cleanJson(text: string) {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function countWords(text: string) {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

function extractText(value: any): string {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => extractText(item))
      .join(" ");
  }

  if (
    value &&
    typeof value === "object"
  ) {
    return Object.values(value)
      .map((item) => extractText(item))
      .join(" ");
  }

  return "";
}

function parseJSON(output: string) {
  const cleaned = cleanJson(output);

  try {
    return JSON.parse(cleaned);
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
data extraction and article writing agent.

SOURCE URL:
${sourceUrl}

==================================================
SOURCE RULES
==================================================

Use ONLY the supplied webpage content.

Do NOT:
- use any other website
- use PDF content
- invent facts
- guess facts
- invent dates
- invent vacancies
- invent fees
- invent eligibility
- invent salary
- invent links

If a fact is not present in the webpage,
do not invent it.

==================================================
JSON RULES
==================================================

Return exactly ONE JSON object.

The returned object MUST have exactly
the same structure as TEMPLATE.

You MUST:

- keep every key
- never add a key
- never remove a key
- never rename a key
- preserve nested objects
- preserve arrays
- preserve data types

==================================================
ARTICLE RULES
==================================================

Create a completely ORIGINAL article.

Minimum length: 1000 words.

Target length: 1000-1500 words.

The article must NOT copy sentences
or paragraphs from the source.

Rewrite the information naturally.

The article should cover, when information
exists in the source:

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

Do NOT repeat meaningless text just
to reach 1000 words.

Do NOT fabricate information.

Do NOT mention AI.

==================================================
TEMPLATE
==================================================

${JSON.stringify(
  template,
  null,
  2
)}

==================================================
WEBPAGE
==================================================

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

  return parseJSON(output);
}

async function expandArticle(
  job: any,
  currentWords: number
) {
  const articleText =
    extractText(job.content);

  const prompt = `
You are editing a government recruitment
article.

The current article contains approximately
${currentWords} words.

Rewrite/expand it to at least 1000 words.

IMPORTANT:

1. Do not invent facts.
2. Do not add unsupported information.
3. Keep all existing factual information.
4. Do not copy source wording.
5. Use original wording.
6. Do not remove important information.
7. Return ONLY the updated article content.
8. Minimum 1000 words.
9. Do not mention AI.

CURRENT ARTICLE:

${articleText}
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

      max_tokens: 10000,

      temperature: 0.2,
    });

  const output =
    response.choices?.[0]
      ?.message?.content;

  if (!output) {
    throw new Error(
      "Article expansion returned empty response"
    );
  }

  return output.trim();
}

export async function extractJob(
  webpage: string,
  sourceUrl: string,
  template: any
) {
  let result =
    await generateJob(
      webpage,
      sourceUrl,
      template
    );

  /*
   * Exact JSON structure check
   */
  let validation =
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
   * Article word count
   */
  let article =
    extractText(result.content);

  let words =
    countWords(article);

  console.log(
    `Initial article word count: ${words}`
  );

  /*
   * If article is below 1000 words,
   * ask AI to expand it.
   */
  if (words < 1000) {
    console.log(
      "Article below 1000 words. Expanding..."
    );

    const expanded =
      await expandArticle(
        result,
        words
      );

    /*
     * IMPORTANT:
     * Existing content structure must
     * remain unchanged.
     *
     * For simple string content:
     */
    if (
      typeof result.content ===
      "string"
    ) {
      result.content =
        expanded;
    } else {
      /*
       * For array/object content,
       * we do not blindly replace it.
       */
      throw new Error(
        "content is not a string; content mapping must match the jobs.json structure"
      );
    }

    article =
      extractText(result.content);

    words =
      countWords(article);

    console.log(
      `Expanded article word count: ${words}`
    );
  }

  /*
   * Final hard check
   */
  if (words < 1000) {
    throw new Error(
      `Article is still below 1000 words: ${words}`
    );
  }

  /*
   * Final exact structure check
   */
  validation =
    validateExactStructure(
      template,
      result
    );

  if (!validation.valid) {
    throw new Error(
      `Final structure validation failed: ${validation.reason}`
    );
  }

  console.log(
    `Article accepted: ${words} words`
  );

  return result;
}