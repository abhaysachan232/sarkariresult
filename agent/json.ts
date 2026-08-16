import fs from "fs/promises";

export async function readJobs(
  file: string
) {
  const text =
    await fs.readFile(
      file,
      "utf8"
    );

  const jobs =
    JSON.parse(text);

  if (!Array.isArray(jobs)) {
    throw new Error(
      "jobs.json must contain an array"
    );
  }

  return jobs;
}

export async function saveJobs(
  file: string,
  jobs: any[]
) {
  await fs.writeFile(
    file,
    JSON.stringify(
      jobs,
      null,
      2
    ),
    "utf8"
  );
}

export function getTemplate(
  jobs: any[]
) {
  if (!jobs.length) {
    throw new Error(
      "jobs.json is empty"
    );
  }

  return jobs[0];
}

function getKeys(
  object: Record<string, unknown>
) {
  return Object.keys(object).sort();
}

export function validateExactKeys(
  template: any,
  candidate: any
) {
  if (
    !template ||
    typeof template !== "object"
  ) {
    return {
      valid: false,
      reason:
        "Invalid template",
    };
  }

  if (
    !candidate ||
    typeof candidate !== "object"
  ) {
    return {
      valid: false,
      reason:
        "AI did not return an object",
    };
  }

  const templateKeys =
    getKeys(template);

  const candidateKeys =
    getKeys(candidate);

  if (
    JSON.stringify(
      templateKeys
    ) !==
    JSON.stringify(
      candidateKeys
    )
  ) {
    return {
      valid: false,
      reason:
        "JSON keys do not match template",
    };
  }

  return {
    valid: true,
    reason: "",
  };
}
