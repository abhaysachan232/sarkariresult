import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

type Link = {
  text: string;
  href: string;
};

type SourceSnapshot = {
  checkedAt: string;
  links: Link[];
};

type SnapshotData = Record<
  string,
  SourceSnapshot
>;

async function ensureSnapshotFile(
  file: string
) {
  await fs.mkdir(
    path.dirname(file),
    {
      recursive: true,
    }
  );

  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(
      file,
      "{}",
      "utf8"
    );
  }
}

async function readSnapshot(
  file: string
): Promise<SnapshotData> {
  await ensureSnapshotFile(file);

  const text =
    await fs.readFile(
      file,
      "utf8"
    );

  return JSON.parse(text);
}

function hashLink(link: Link) {
  return crypto
    .createHash("sha256")
    .update(
      `${link.href}|${link.text}`
    )
    .digest("hex");
}

export async function detectChanges(
  file: string,
  sourceId: string,
  currentLinks: Link[]
) {
  const snapshots =
    await readSnapshot(file);

  const previous =
    snapshots[sourceId];

  // First run:
  // केवल snapshot बनाओ.
  if (!previous) {
    snapshots[sourceId] = {
      checkedAt:
        new Date().toISOString(),
      links: currentLinks,
    };

    await fs.writeFile(
      file,
      JSON.stringify(
        snapshots,
        null,
        2
      ),
      "utf8"
    );

    return {
      firstRun: true,
      changed: [],
    };
  }

  const oldMap =
    new Map<string, string>();

  for (const link of previous.links) {
    oldMap.set(
      link.href,
      hashLink(link)
    );
  }

  const changed: Link[] = [];

  for (const link of currentLinks) {
    const currentHash =
      hashLink(link);

    const oldHash =
      oldMap.get(link.href);

    if (
      !oldHash ||
      oldHash !== currentHash
    ) {
      changed.push(link);
    }
  }

  snapshots[sourceId] = {
    checkedAt:
      new Date().toISOString(),
    links: currentLinks,
  };

  await fs.writeFile(
    file,
    JSON.stringify(
      snapshots,
      null,
      2
    ),
    "utf8"
  );

  return {
    firstRun: false,
    changed,
  };
}
