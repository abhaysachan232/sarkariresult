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
      "jobs.json must be an array"
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

/**
 * IMPORTANT:
 * New object ka template
 * ALWAYS last object hoga.
 */
export function getLastJobTemplate(
  jobs: any[]
) {
  if (!jobs.length) {
    throw new Error(
      "jobs.json is empty"
    );
  }

  return structuredClone(
    jobs[jobs.length - 1]
  );
}

export function getKeys(
  value: any
) {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return [];
  }

  return Object.keys(value);
}

/**
 * Recursive structure validation.
 * Koi key add/delete nahi ho sakti.
 */
export function validateExactStructure(
  template: any,
  candidate: any,
  currentPath = "root"
): {
  valid: boolean;
  reason?: string;
} {
  if (
    template === null ||
    typeof template !== "object"
  ) {
    return {
      valid: true,
    };
  }

  if (
    candidate === null ||
    typeof candidate !== "object"
  ) {
    return {
      valid: false,
      reason:
        `${currentPath} must be an object/array`,
    };
  }

  if (Array.isArray(template)) {
    if (!Array.isArray(candidate)) {
      return {
        valid: false,
        reason:
          `${currentPath} must be an array`,
      };
    }

    if (
      template.length > 0 &&
      candidate.length > 0
    ) {
      return validateExactStructure(
        template[0],
        candidate[0],
        `${currentPath}[0]`
      );
    }

    return {
      valid: true,
    };
  }

  if (Array.isArray(candidate)) {
    return {
      valid: false,
      reason:
        `${currentPath} cannot be an array`,
    };
  }

  const templateKeys =
    Object.keys(template).sort();

  const candidateKeys =
    Object.keys(candidate).sort();

  if (
    JSON.stringify(templateKeys) !==
    JSON.stringify(candidateKeys)
  ) {
    return {
      valid: false,
      reason:
        `${currentPath} keys mismatch`,
    };
  }

  for (const key of templateKeys) {
    const result =
      validateExactStructure(
        template[key],
        candidate[key],
        `${currentPath}.${key}`
      );

    if (!result.valid) {
      return result;
    }
  }

  return {
    valid: true,
  };
}

/**
 * Maximum existing ID + 1
 */
export function getNextId(
  jobs: any[]
) {
  const ids =
    jobs
      .map((job) =>
        Number(job?.id)
      )
      .filter(Number.isFinite);

  if (!ids.length) {
    return 1;
  }

  return Math.max(...ids) + 1;
}

export function makeSlug(
  title: string
) {
  return title
    .toLowerCase()
    .trim()
    .replace(/<[^>]*>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}