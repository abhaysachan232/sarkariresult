import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export type SourceLink = {
  text: string;
  href: string;
};

type ProcessedJob = {
  jobId: number | string;
  slug: string;
};

type SourceState = {
  checkedAt: string;
  links: SourceLink[];
  processed: Record<string, ProcessedJob>;
};

type SnapshotData = Record<string, SourceState>;

function hashLink(link: SourceLink) {
  return crypto
    .createHash("sha256")
    .update(`${link.href}|${link.text}`)
    .digest("hex");
}

async function readSnapshot(
  file: string
): Promise<SnapshotData> {
  await fs.mkdir(path.dirname(file), {
    recursive: true,
  });

  try {
    const text = await fs.readFile(
      file,
      "utf8"
    );

    if (!text.trim()) {
      return {};
    }

    return JSON.parse(text);
  } catch {
    return {};
  }
}

async function saveSnapshot(
  file: string,
  data: SnapshotData
) {
  await fs.mkdir(path.dirname(file), {
    recursive: true,
  });

  await fs.writeFile(
    file,
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

export async function detectChanges(
  file: string,
  sourceId: string,
  currentLinks: SourceLink[]
) {
  const snapshot =
    await readSnapshot(file);

  const previous =
    snapshot[sourceId];

  /*
   * FIRST RUN
   *
   * Existing homepage links become baseline.
   * Nothing gets processed.
   */
  if (
    !previous ||
    !previous.checkedAt
  ) {
    snapshot[sourceId] = {
      checkedAt:
        new Date().toISOString(),

      links: currentLinks,

      processed:
        previous?.processed || {},
    };

    await saveSnapshot(
      file,
      snapshot
    );

    return {
      firstRun: true,
      changed: [] as SourceLink[],
    };
  }

  const previousHashes =
    new Map<string, string>();

  for (
    const link of previous.links || []
  ) {
    previousHashes.set(
      link.href,
      hashLink(link)
    );
  }

  const changed: SourceLink[] = [];

  for (
    const link of currentLinks
  ) {
    const currentHash =
      hashLink(link);

    const previousHash =
      previousHashes.get(
        link.href
      );

    /*
     * New link
     */
    if (!previousHash) {
      changed.push(link);
      continue;
    }

    /*
     * Existing URL but text changed
     */
    if (
      previousHash !==
      currentHash
    ) {
      changed.push(link);
    }
  }

  /*
   * IMPORTANT:
   *
   * We DON'T immediately overwrite
   * the previous links here.
   *
   * run.ts will update snapshot only
   * after successful processing.
   */

  return {
    firstRun: false,
    changed,
  };
}

/**
 * Successful processing ke baad
 * homepage state save karta hai.
 */
export async function markSuccessfulRun(
  file: string,
  sourceId: string,
  currentLinks: SourceLink[]
) {
  const snapshot =
    await readSnapshot(file);

  const previous =
    snapshot[sourceId];

  snapshot[sourceId] = {
    checkedAt:
      new Date().toISOString(),

    links: currentLinks,

    processed:
      previous?.processed || {},
  };

  await saveSnapshot(
    file,
    snapshot
  );
}

/**
 * Source URL → jobs.json object mapping
 */
export async function saveProcessedJob(
  file: string,
  sourceId: string,
  href: string,
  jobId: number | string,
  slug: string
) {
  const snapshot =
    await readSnapshot(file);

  if (!snapshot[sourceId]) {
    snapshot[sourceId] = {
      checkedAt: "",
      links: [],
      processed: {},
    };
  }

  snapshot[sourceId].processed[href] = {
    jobId,
    slug,
  };

  await saveSnapshot(
    file,
    snapshot
  );
}

export async function getProcessedJob(
  file: string,
  sourceId: string,
  href: string
) {
  const snapshot =
    await readSnapshot(file);

  return (
    snapshot[sourceId]
      ?.processed?.[href] ||
    null
  );
}