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
  processed: Record<string, ProcessedJob>;
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

    if (!text.trim()) return {};

    const data = JSON.parse(text);

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

export async function detectChanges(
  file: string,
  sourceId: string,
  currentLinks: SourceLink[]
) {
  const snapshot = await readSnapshot(file);
  const previous = snapshot[sourceId];

  if (!previous || !previous.checkedAt) {
    snapshot[sourceId] = {
      checkedAt: new Date().toISOString(),
      links: currentLinks,
      processed: previous?.processed || {},
      failed: previous?.failed || {},
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
    const currentHash = hashLink(link);
    const previousHash =
      previousHashes.get(link.href);

    if (!previousHash) {
      changed.push(link);
      continue;
    }

    if (previousHash !== currentHash) {
      changed.push(link);
    }
  }

  return {
    firstRun: false,
    changed,
  };
}

export async function markSuccessfulRun(
  file: string,
  sourceId: string,
  currentLinks: SourceLink[]
) {
  const snapshot = await readSnapshot(file);
  const previous = snapshot[sourceId];

  snapshot[sourceId] = {
    checkedAt: new Date().toISOString(),
    links: currentLinks,
    processed: previous?.processed || {},
    failed: previous?.failed || {},
  };

  await saveSnapshot(file, snapshot);
}

export async function saveProcessedJob(
  file: string,
  sourceId: string,
  href: string,
  jobId: number | string,
  slug: string
) {
  const snapshot = await readSnapshot(file);

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
    processedAt: new Date().toISOString(),
  };

  delete snapshot[sourceId].failed[href];

  await saveSnapshot(file, snapshot);
}

export async function saveFailedJob(
  file: string,
  sourceId: string,
  href: string,
  error: string
) {
  const snapshot = await readSnapshot(file);

  if (!snapshot[sourceId]) {
    snapshot[sourceId] = {
      checkedAt: "",
      links: [],
      processed: {},
      failed: {},
    };
  }

  snapshot[sourceId].failed[href] = {
    failedAt: new Date().toISOString(),
    error: error.slice(0, 2000),
  };

  delete snapshot[sourceId].processed[href];

  await saveSnapshot(file, snapshot);
}

export async function isLinkFailed(
  file: string,
  sourceId: string,
  href: string
) {
  const snapshot = await readSnapshot(file);

  return Boolean(
    snapshot[sourceId]?.failed?.[href]
  );
}

export async function getProcessedJob(
  file: string,
  sourceId: string,
  href: string
) {
  const snapshot = await readSnapshot(file);

  return (
    snapshot[sourceId]?.processed?.[href] ||
    null
  );
}

/*
 * ALL pending links.
 * No batch limit.
 */
export async function getUnprocessedLinks(
  file: string,
  sourceId: string
) {
  const snapshot = await readSnapshot(file);
  const source = snapshot[sourceId];

  if (!source) return [];

  const processed = source.processed || {};
  const failed = source.failed || {};

  return (source.links || []).filter(
    (link) => {
      if (processed[link.href]) return false;
      if (failed[link.href]) return false;
      return true;
    }
  );
}