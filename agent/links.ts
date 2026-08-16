import type { Page } from "playwright";

const CONTENT_KEYWORDS = [
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
  "recruitment 2026",
];

const IGNORE_KEYWORDS = [
  "home",
  "contact",
  "privacy",
  "about",
  "disclaimer",
  "youtube",
  "instagram",
  "facebook",
  "telegram",
  "android app",
  "apple app",
];

function normalizeText(text: string) {
  return text
    .replace(/\s+/g, " ")
    .trim();
}

function isPdf(url: string) {
  return /\.pdf(?:$|\?)/i.test(url);
}

function looksRelevant(text: string) {
  const value = text.toLowerCase();

  if (
    IGNORE_KEYWORDS.some((x) =>
      value.includes(x)
    )
  ) {
    return false;
  }

  return CONTENT_KEYWORDS.some((x) =>
    value.includes(x)
  );
}

function isBlueColor(color: string) {
  const rgb = color.match(/\d+/g);

  if (!rgb || rgb.length < 3) {
    return false;
  }

  const [r, g, b] =
    rgb.slice(0, 3).map(Number);

  // Blue-ish color detection.
  return (
    b > 80 &&
    b > r * 1.15 &&
    b > g * 1.05
  );
}

export async function getContentLinks(
  page: Page,
  sourceHost: string
) {
  const links =
    await page.locator("a").evaluateAll(
      (anchors) =>
        anchors.map((element) => {
          const a =
            element as HTMLAnchorElement;

          const style =
            window.getComputedStyle(a);

          return {
            text: a.textContent || "",
            href: a.href,
            color: style.color,
          };
        })
    );

  const result: {
    text: string;
    href: string;
  }[] = [];

  for (const link of links) {
    const text = normalizeText(link.text);
    const href = link.href;

    if (!text || !href) continue;

    if (isPdf(href)) continue;

    if (!looksRelevant(text)) continue;

    let url: URL;

    try {
      url = new URL(href);
    } catch {
      continue;
    }

    if (url.hostname !== sourceHost) {
      continue;
    }

    if (!isBlueColor(link.color)) {
      continue;
    }

    result.push({
      text,
      href,
    });
  }

  const unique =
    new Map<string, {
      text: string;
      href: string;
    }>();

  for (const link of result) {
    unique.set(link.href, link);
  }

  return Array.from(unique.values());
}

export async function openHomepage(
  page: Page,
  url: string
) {
  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page.waitForTimeout(1500);
}
