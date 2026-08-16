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
 * Exact JSON structure validation.
 *
 * Koi key add/delete/rename nahi honi chahiye.
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
     * Empty array.
     */
    if (
      template.length === 0
    ) {
      return {
        valid: true,
      };
    }

    /*
     * Array ke har object ko
     * template ke first object se
     * validate karo.
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
    candidate === null ||
    typeof candidate !== "object" ||
    Array.isArray(candidate)
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

/*
 * Next ID generate karta hai.
 */
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

/*
 * Slug generate karta hai.
 */
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

/*
 * =====================================================
 * TYPE + CATEGORY AUTO DETECTION
 * =====================================================
 *
 * Default:
 *
 * type     = latest-job
 * category = latest-jobs
 *
 * Title ke keyword ke basis par override hoga.
 */
export function setTypeAndCategory(
  job: any,
  template: any
) {
  const title =
    String(
      job?.title || ""
    )
      .toLowerCase()
      .replace(
        /[-_/]+/g,
        " "
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();

  /*
   * DEFAULT
   *
   * Agar koi special keyword nahi mila
   * to ye values rahengi.
   */
  let type =
    "latest-job";

  let category =
    "latest-jobs";

  /*
   * =================================================
   * PRIORITY 1: ANSWER KEY
   * =================================================
   *
   * "Answer Key"
   * "AnswerKey"
   * "Answer-Key"
   */
  if (
    /\banswer\s*key\b/i.test(
      title
    ) ||
    /\banswerkey\b/i.test(
      title
    )
  ) {
    type =
      "answer-key";

    category =
      "answer-key";
  }

  /*
   * =================================================
   * PRIORITY 2: ADMIT CARD
   * =================================================
   */
  else if (
    /\badmit\s*card\b/i.test(
      title
    ) ||
    /\badmitcard\b/i.test(
      title
    )
  ) {
    type =
      "admit-card";

    category =
      "admit-card";
  }

  /*
   * =================================================
   * PRIORITY 3: RESULT
   * =================================================
   */
  else if (
    /\bresult\b/i.test(
      title
    ) ||
    /\bresults\b/i.test(
      title
    )
  ) {
    type =
      "result";

    category =
      "results";
  }

  /*
   * =================================================
   * PRIORITY 4: ADMISSION
   * =================================================
   */
  else if (
    /\badmission\b/i.test(
      title
    )
  ) {
    type =
      "admission";

    category =
      "admission";
  }

  /*
   * =================================================
   * PRIORITY 5: IMPORTANT
   * =================================================
   */
  else if (
    /\bimportant\b/i.test(
      title
    )
  ) {
    type =
      "important";

    category =
      "important";
  }

  /*
   * =================================================
   * Existing keys ko hi update karo.
   *
   * New key create nahi hogi.
   * =================================================
   */
  if (
    Object.prototype.hasOwnProperty.call(
      template,
      "type"
    )
  ) {
    job.type =
      type;
  }

  if (
    Object.prototype.hasOwnProperty.call(
      template,
      "category"
    )
  ) {
    job.category =
      category;
  }

  return job;
}