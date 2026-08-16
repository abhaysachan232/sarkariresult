import {
  chromium,
  type Browser,
  type Page,
} from "playwright";

let browser:
  | Browser
  | null = null;

export async function getBrowser() {
  if (!browser) {
    browser =
      await chromium.launch({
        headless: true,
      });
  }

  return browser;
}

export async function createPage(): Promise<Page> {
  const currentBrowser =
    await getBrowser();

  const page =
    await currentBrowser.newPage({
      viewport: {
        width: 1366,
        height: 768,
      },

      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
    });

  page.setDefaultTimeout(
    30000
  );

  page.setDefaultNavigationTimeout(
    30000
  );

  return page;
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();

    browser = null;
  }
}