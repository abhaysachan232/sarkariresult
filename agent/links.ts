import type { Page } from "playwright";

const KEYWORDS = [
  "recruitment",
  "vacancy",
  "notification",
  "online form",
  "apply online",
  "admit card",
  "result",
  "answer key",
  "exam",
  "syllabus",
  "scholarship",
  "teacher",
  "police",
  "constable",
  "clerk",
  "engineer",
  "assistant",
  "officer",
  "apprentice",
  "bharti",
  "job",
  "form",
];

const IGNORE = [
  "home",
  "contact",
  "about",
  "privacy",
  "disclaimer",
  "youtube",
  "instagram",
  "facebook",
  "telegram",
  "android app",
  "apple app",
];

type SourceLink = {
  text: string;
  href: string;
};

function normalize(
  text: string
) {
  return text
    .replace(/\s+/g, " ")
    .trim();
}

function isPdf(
  url: string
) {
  return /\.pdf(?:$|\?)/i.test(
    url
  );
}

function isRelevant(
  text: string
) {
  const value =
    text.toLowerCase();

  if (
    IGNORE.some((item) =>
      value.includes(item)
    )
  ) {
    return false;
  }

  return KEYWORDS.some(
    (keyword) =>
      value.includes(keyword)
  );
}

function isBlue(
  color: string
) {
  const values =
    color.match(/\d+/g);

  if (
    !values ||
    values.length < 3
  ) {
    return false;
  }

  const [
    r,
    g,
    b,
  ] =
    values
      .slice(0, 3)
      .map(Number);

  return (
    b > 80 &&
    b > r * 1.1 &&
    b >= g
  );
}

export async function openHomepage(
  page: Page,
  url: string
) {
  await page.goto(
    url,
    {
      waitUntil:
        "domcontentloaded",
      timeout: 30000,
    }
  );

  await page.waitForTimeout(
    1000
  );
}

export async function getContentLinks(
  page: Page,
  sourceHost: string
) {
  const raw =
    await page
      .locator("a")
      .evaluateAll(
        (anchors) =>
          anchors.map(
            (element) => {
              const a =
                element as HTMLAnchorElement;

              const style =
                window.getComputedStyle(
                  a
                );

              return {
                text:
                  a.textContent ||
                  "",
                href:
                  a.href,
                color:
                  style.color,
              };
            }
          )
      );

  const links: SourceLink[] = [];

  for (
    const item of raw
  ) {
    const text =
      normalize(
        item.text
      );

    if (
      !text ||
      !item.href
    ) {
      continue;
    }

    if (
      isPdf(item.href)
    ) {
      continue;
    }

    if (
      !isRelevant(text)
    ) {
      continue;
    }

    let url: URL;

    try {
      url =
        new URL(
          item.href
        );
    } catch {
      continue;
    }

    if (
      url.hostname !==
      sourceHost
    ) {
      continue;
    }

    if (
      !isBlue(
        item.color
      )
    ) {
      continue;
    }

    links.push({
      text,
      href: url.href,
    });
  }

  const unique =
    new Map<
      string,
      SourceLink
    >();

  for (
    const link of links
  ) {
    unique.set(
      link.href,
      link
    );
  }

  return [
    ...unique.values(),
  ];
}