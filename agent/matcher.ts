function normalize(
  value: unknown
) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function getField(
  object: any,
  names: string[]
) {
  if (
    !object ||
    typeof object !== "object"
  ) {
    return "";
  }

  for (const key of Object.keys(object)) {
    const normalizedKey =
      key
        .toLowerCase()
        .replace(
          /[\s_-]/g,
          ""
        );

    if (
      names.includes(
        normalizedKey
      )
    ) {
      return object[key];
    }
  }

  return "";
}

export function findExistingJob(
  jobs: any[],
  candidate: any
) {
  const candidateUrl =
    normalize(
      getField(candidate, [
        "url",
        "sourceurl",
        "officialurl",
        "officialwebsite",
      ])
    );

  const candidateTitle =
    normalize(
      getField(candidate, [
        "title",
        "jobtitle",
        "postname",
        "name",
      ])
    );

  const candidateOrganization =
    normalize(
      getField(candidate, [
        "organization",
        "organisation",
        "department",
        "company",
      ])
    );

  return jobs.findIndex(
    (job) => {
      const jobUrl =
        normalize(
          getField(job, [
            "url",
            "sourceurl",
            "officialurl",
            "officialwebsite",
          ])
        );

      const jobTitle =
        normalize(
          getField(job, [
            "title",
            "jobtitle",
            "postname",
            "name",
          ])
        );

      const jobOrganization =
        normalize(
          getField(job, [
            "organization",
            "organisation",
            "department",
            "company",
          ])
        );

      // URL सबसे मजबूत match
      if (
        candidateUrl &&
        jobUrl &&
        candidateUrl === jobUrl
      ) {
        return true;
      }

      // Title + organization
      if (
        candidateTitle &&
        jobTitle &&
        candidateOrganization &&
        jobOrganization &&
        candidateTitle ===
          jobTitle &&
        candidateOrganization ===
          jobOrganization
      ) {
        return true;
      }

      return false;
    }
  );
}
