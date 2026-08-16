import {
  InferenceClient,
} from "@huggingface/inference";

import {
  validateExactKeys,
} from "./json";

const token =
  process.env.HF_TOKEN;

if (!token) {
  throw new Error(
    "HF_TOKEN is missing"
  );
}

const client =
  new InferenceClient(token);

function cleanJson(
  text: string
) {
  let output = text.trim();

  output =
    output.replace(
      /^```json\s*/i,
      ""
    );

  output =
    output.replace(
      /^```\s*/i,
      ""
    );

  output =
    output.replace(
      /\s*```$/i,
      ""
    );

  return output.trim();
}

export async function extractJob(
  content: string,
  sourceUrl: string,
  template: any
) {
  const keys =
    Object.keys(template);

  const prompt = `
You are an automated government recruitment data extraction agent.

OFFICIAL SOURCE:
${sourceUrl}

STRICT REQUIREMENTS:

- Return ONLY one JSON object.
- Use EXACTLY the same keys as the supplied template.
- Never add a key.
- Never remove a key.
- Never rename a key.
- Preserve the exact nested structure.
- Do not invent information.
- Do not guess missing information.
- Use only information present in the webpage.
- Ignore PDF links and PDF content.
- Do not use information from any other website.
- This data will be automatically published.
- Accuracy is more important than filling every field.

TEMPLATE:
${JSON.stringify(
  template,
  null,
  2
)}

ALLOWED TOP LEVEL KEYS:
${JSON.stringify(keys)}

WEBPAGE:
${content}
`;

  const response =
    await client.chatCompletion({
      model:
        process.env.HF_MODEL ||
        "Qwen/Qwen3-4B-Instruct-2507",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      max_tokens: 6000,

      temperature: 0.1,
    });

  const output =
    response.choices?.[0]
      ?.message?.content;

  if (!output) {
    throw new Error(
      "Hugging Face returned empty response"
    );
  }

  const cleaned =
    cleanJson(output);

  let parsed: any;

  try {
    parsed =
      JSON.parse(cleaned);
  } catch {
    throw new Error(
      "Hugging Face did not return valid JSON"
    );
  }

  const validation =
    validateExactKeys(
      template,
      parsed
    );

  if (!validation.valid) {
    throw new Error(
      validation.reason
    );
  }

  return parsed;
}
