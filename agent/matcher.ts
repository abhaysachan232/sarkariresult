function normalize(
  value: unknown
) {
  return String(
    value ?? ""
  )
    .replace(
      /<[^>]*>/g,
      ""
    )
    .toLowerCase()
    .replace(
      /\s+/g,
      " "
    )
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
  const title =
    normalize(
      candidate?.title
    );

  const organization =
    normalize(
      candidate?.organization
    );

  if (!title) {
    return -1;
  }

  return jobs.findIndex(
    (job) => {
      return (
        normalize(
          job?.title
        ) === title &&
        normalize(
          job?.organization
        ) === organization
      );
    }
  );
}