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
  processedAt?: string;
};

type FailedJob = {
  failedAt: string;
  error: string;
};

type SourceState = {
  checkedAt: string;
  links: SourceLink[];

  // Successfully processed links
  processed: Record<string, ProcessedJob>;

  // Permanently failed links
  failed: Record<string, FailedJob>;
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
    const text = await fs.readFile(file, "utf8");

    if (!text.trim()) {
      return {};
    }

    const data = JSON.parse(text);

    // Backward compatibility with old snapshot
    for (const sourceId of Object.keys(data)) {
      data[sourceId].processed =
        data[sourceId].processed || {};

      data[sourceId].failed =
        data[sourceId].failed || {};

      data[sourceId].links =
        data[sourceId].links || [];

      data[sourceId].checkedAt =
        data[sourceId].checkedAt || "";
    }

    return data;
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

/*
 * Homepage ke current links ko
 * previous snapshot se compare karta hai.
 */
export async function detectChanges(
  file: string,
  sourceId: string,
  currentLinks: SourceLink[]
) {
  const snapshot = await readSnapshot(file);

  const previous = snapshot[sourceId];

  /*
   * First run:
   * Baseline create karo.
   */
  if (
    !previous ||
    !previous.checkedAt
  ) {
    snapshot[sourceId] = {
      checkedAt: new Date().toISOString(),

      links: currentLinks,

      processed:
        previous?.processed || {},

      failed:
        previous?.failed || {},
    };

    await saveSnapshot(file, snapshot);

    return {
      firstRun: true,
      changed: [] as SourceLink[],
    };
  }

  const previousHashes =
    new Map<string, string>();

  for (const link of previous.links || []) {
    previousHashes.set(
      link.href,
      hashLink(link)
    );
  }

  const changed: SourceLink[] = [];

  for (const link of currentLinks) {
    const currentHash =
      hashLink(link);

    const previousHash =
      previousHashes.get(
        link.href
      );

    /*
     * New URL
     */
    if (!previousHash) {
      changed.push(link);
      continue;
    }

    /*
     * Same URL but homepage text changed
     */
    if (
      previousHash !==
      currentHash
    ) {
      changed.push(link);
    }
  }

  return {
    firstRun: false,
    changed,
  };
}

/*
 * Successful homepage state save karo.
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

    failed:
      previous?.failed || {},
  };

  await saveSnapshot(
    file,
    snapshot
  );
}

/*
 * Successfully processed link ko mark karo.
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
      failed: {},
    };
  }

  snapshot[sourceId].processed[href] = {
    jobId,
    slug,
    processedAt:
      new Date().toISOString(),
  };

  /*
   * Agar pehle failed mark hua tha,
   * successful processing ke baad
   * failed entry remove kar do.
   */
  delete snapshot[sourceId].failed[href];

  await saveSnapshot(
    file,
    snapshot
  );
}

/*
 * Failed link ko permanently skip mark karo.
 *
 * IMPORTANT:
 * Ye link future runs mein retry nahi hoga.
 */
export async function saveFailedJob(
  file: string,
  sourceId: string,
  href: string,
  error: string
) {
  const snapshot =
    await readSnapshot(file);

  if (!snapshot[sourceId]) {
    snapshot[sourceId] = {
      checkedAt: "",
      links: [],
      processed: {},
      failed: {},
    };
  }

  snapshot[sourceId].failed[href] = {
    failedAt:
      new Date().toISOString(),

    error:
      error.slice(0, 2000),
  };

  /*
   * Failed link ko processed list se bhi
   * remove kar do, agar kabhi stale entry ho.
   */
  delete snapshot[sourceId].processed[href];

  await saveSnapshot(
    file,
    snapshot
  );
}

/*
 * Check karo ki link permanently failed hai.
 */
export async function isLinkFailed(
  file: string,
  sourceId: string,
  href: string
) {
  const snapshot =
    await readSnapshot(file);

  return Boolean(
    snapshot[sourceId]
      ?.failed?.[href]
  );
}

/*
 * Check karo ki specific source link
 * successfully process hua ya nahi.
 */
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

/*
 * Existing snapshot ke SAARE pending
 * links return karta hai.
 *
 * Koi batch limit nahi.
 *
 * Failed links ko permanently skip karta hai.
 */
export async function getUnprocessedLinks(
  file: string,
  sourceId: string
) {
  const snapshot =
    await readSnapshot(file);

  const source =
    snapshot[sourceId];

  if (!source) {
    return [];
  }

  const processed =
    source.processed || {};

  const failed =
    source.failed || {};

  return (source.links || [])
    .filter((link) => {
      /*
       * Successfully processed -> skip
       */
      if (processed[link.href]) {
        return false;
      }

      /*
       * Permanently failed -> NEVER retry
       */
      if (failed[link.href]) {
        return false;
      }

      return true;
    });
}