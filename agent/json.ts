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

/*
 * IMPORTANT:
 *
 * New object ka template
 * hamesha jobs.json ke LAST OBJECT
 * se banega.
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

/*
 * Exact structure validation.
 */
export function validateExactStructure(
  template: any,
  candidate: any,
  currentPath = "root"
): {
  valid: boolean;
  reason?: string;
} {
  /*
   * Primitive
   */
  if (
    template === null ||
    typeof template !== "object"
  ) {
    if (
      candidate === null ||
      candidate === undefined
    ) {
      return {
        valid: true,
      };
    }

    if (
      typeof candidate !==
      typeof template
    ) {
      return {
        valid: false,
        reason:
          `${currentPath} type mismatch`,
      };
    }

    return {
      valid: true,
    };
  }

  /*
   * Array
   */
  if (
    Array.isArray(template)
  ) {
    if (
      !Array.isArray(candidate)
    ) {
      return {
        valid: false,
        reason:
          `${currentPath} must be array`,
      };
    }

    /*
     * Empty template array.
     * Iske andar keys define nahi hain.
     */
    if (
      template.length === 0
    ) {
      return {
        valid: true,
      };
    }

    /*
     * Array objects ka structure
     * first template item se validate.
     */
    for (
      let i = 0;
      i < candidate.length;
      i++
    ) {
      const result =
        validateExactStructure(
          template[0],
          candidate[i],
          `${currentPath}[${i}]`
        );

      if (!result.valid) {
        return result;
      }
    }

    return {
      valid: true,
    };
  }

  /*
   * Object
   */
  if (
    Array.isArray(candidate) ||
    candidate === null ||
    typeof candidate !== "object"
  ) {
    return {
      valid: false,
      reason:
        `${currentPath} must be object`,
    };
  }

  const templateKeys =
    Object.keys(
      template
    ).sort();

  const candidateKeys =
    Object.keys(
      candidate
    ).sort();

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
        `${currentPath} keys mismatch`,
    };
  }

  for (
    const key of templateKeys
  ) {
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

export function getNextId(
  jobs: any[]
) {
  const ids =
    jobs
      .map((job) =>
        Number(job?.id)
      )
      .filter(
        Number.isFinite
      );

  if (!ids.length) {
    return 1;
  }

  return (
    Math.max(...ids) + 1
  );
}

export function makeSlug(
  title: string
) {
  return title
    .toLowerCase()
    .trim()
    .replace(
      /<[^>]*>/g,
      ""
    )
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      "");
}