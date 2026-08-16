function normalize(
  value: unknown
) {
  return String(value ?? "")
    .replace(/<[^>]*>/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function findJobById(
  jobs: any[],
  id: number | string
) {
  return jobs.findIndex(
    (job) =>
      String(job?.id) ===
      String(id)
  );
}

export function findExistingJob(
  jobs: any[],
  candidate: any
) {
  const candidateTitle =
    normalize(
      candidate?.title
    );

  const candidateOrg =
    normalize(
      candidate?.organization
    );

  if (
    !candidateTitle
  ) {
    return -1;
  }

  return jobs.findIndex(
    (job) => {
      const title =
        normalize(job?.title);

      const organization =
        normalize(
          job?.organization
        );

      if (
        title === candidateTitle &&
        candidateOrg &&
        organization === candidateOrg
      ) {
        return true;
      }

      return false;
    }
  );
}