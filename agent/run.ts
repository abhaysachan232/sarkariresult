import path from "path";
import type { Page } from "playwright";

import {
  createPage,
  closeBrowser,
} from "./browser";

import {
  openHomepage,
  getContentLinks,
} from "./links";

import {
  detectChanges,
  saveProcessedJob,
  getProcessedJob,
  markSuccessfulRun,
} from "./snapshot";

import {
  readJobs,
  saveJobs,
  getLastJobTemplate,
  validateExactStructure,
  getNextId,
  makeSlug,
} from "./json";

import {
  extractJob,
} from "./ai";

import {
  findJobById,
  findExistingJob,
} from "./matcher";

import { CONFIG } from "./config";

async function clickChangedLink(
  page: Page,
  href: string
) {
  if (
    /\.pdf(?:$|\?)/i.test(
      href
    )
  ) {
    throw new Error(
      "PDF link ignored"
    );
  }

  const homepageUrl =
    page.url();

  const target =
    new URL(href).href;

  const link =
    page
      .locator(
        `a[href="${target}"]`
      )
      .first();

  if (
    await link.count() === 0
  ) {
    throw new Error(
      `Link not found: ${target}`
    );
  }

  await link.scrollIntoViewIfNeeded();

  let popup:
    | Page
    | null = null;

  const popupPromise =
    page
      .context()
      .waitForEvent(
        "page",
        {
          timeout: 3000,
        }
      )
      .catch(
        () => null
      );

  try {
    await link.click({
      timeout: 30000,
    });
  } catch (error) {
    throw new Error(
      `Unable to click link: ${target}`
    );
  }

  popup =
    await popupPromise;

  const detailPage =
    popup || page;

  await detailPage.waitForLoadState(
    "domcontentloaded",
    {
      timeout: 30000,
    }
  );

  await detailPage.waitForTimeout(
    1000
  );

  const finalUrl =
    detailPage.url();

  if (
    /\.pdf(?:$|\?)/i.test(
      finalUrl
    )
  ) {
    if (popup) {
      await popup.close();
    }

    throw new Error(
      "Destination is PDF. Ignored."
    );
  }

  const content =
    await detailPage
      .locator("body")
      .innerText();

  const title =
    await detailPage.title();

  if (popup) {
    await popup.close();
  } else {
    await page.goto(
      homepageUrl,
      {
        waitUntil:
          "domcontentloaded",
        timeout: 30000,
      }
    );
  }

  return {
    title,
    url: finalUrl,
    content:
      content
        .replace(
          /\s+/g,
          " "
        )
        .trim(),
  };
}

function applyGeneratedMetadata(
  candidate: any,
  jobs: any[]
) {
  const nextId =
    getNextId(jobs);

  const title =
    String(
      candidate?.title ||
      "government-job"
    );

  candidate.id =
    nextId;

  candidate.slug =
    makeSlug(title);

  candidate.updatedon =
    new Date()
      .toISOString()
      .slice(0, 10);

  return candidate;
}

export async function runAgent() {
  const jobsFile =
    path.resolve(
      CONFIG.jobsFile
    );

  const snapshotFile =
    path.resolve(
      CONFIG.snapshotFile
    );

  const result = {
    sourcesChecked: 0,
    linksFound: 0,
    changedLinks: 0,
    newJobs: 0,
    updatedJobs: 0,
    skipped: 0,
    errors: [] as string[],
  };

  try {
    for (
      const source of CONFIG.sources
    ) {
      result.sourcesChecked++;

      const page =
        await createPage();

      try {
        console.log(
          `========== ${source.name} ==========`
        );

        await openHomepage(
          page,
          source.url
        );

        const host =
          new URL(
            source.url
          ).hostname;

        const links =
          await getContentLinks(
            page,
            host
          );

        result.linksFound +=
          links.length;

        console.log(
          `Relevant blue links: ${links.length}`
        );

        const changes =
          await detectChanges(
            snapshotFile,
            source.id,
            links
          );

        if (
          changes.firstRun
        ) {
          console.log(
            "FIRST RUN: baseline snapshot created."
          );

          console.log(
            "No existing links will be processed."
          );

          continue;
        }

        result.changedLinks +=
          changes.changed.length;

        console.log(
          `Changed/New links: ${changes.changed.length}`
        );

        /*
         * IMPORTANT:
         *
         * Process sequentially.
         * This prevents many simultaneous
         * HF requests.
         */
        for (
          const link of changes.changed
        ) {
          try {
            console.log(
              `NEW/CHANGED LINK: ${link.text}`
            );

            if (
              /\.pdf(?:$|\?)/i.test(
                link.href
              )
            ) {
              result.skipped++;
              continue;
            }

            const detail =
              await clickChangedLink(
                page,
                link.href
              );

            if (
              !detail.content ||
              detail.content.length < 100
            ) {
              result.skipped++;
              continue;
            }

            const jobs =
              await readJobs(
                jobsFile
              );

            /*
             * NEW TEMPLATE:
             *
             * ALWAYS LAST OBJECT.
             */
            const template =
              getLastJobTemplate(
                jobs
              );

            /*
             * Existing source mapping.
             */
            const mapped =
              await getProcessedJob(
                snapshotFile,
                source.id,
                link.href
              );

            let existingIndex =
              -1;

            if (mapped) {
              existingIndex =
                findJobById(
                  jobs,
                  mapped.jobId
                );
            }

            /*
             * AI extraction + article.
             */
            const candidate =
              await extractJob(
                detail.content.slice(
                  0,
                  CONFIG.maxContentLength
                ),
                detail.url,
                template
              );

            /*
             * If URL mapping didn't find
             * existing job, title+organization
             * matching.
             */
            if (
              existingIndex === -1
            ) {
              existingIndex =
                findExistingJob(
                  jobs,
                  candidate
                );
            }

            /*
             * =========================
             * UPDATE EXISTING
             * =========================
             */
            if (
              existingIndex !== -1
            ) {
              const existing =
                jobs[
                  existingIndex
                ];

              const validation =
                validateExactStructure(
                  existing,
                  candidate
                );

              if (
                !validation.valid
              ) {
                throw new Error(
                  `UPDATE structure mismatch: ${validation.reason}`
                );
              }

              /*
               * Existing identity preserve.
               */
              candidate.id =
                existing.id;

              candidate.slug =
                existing.slug;

              candidate.setPath =
                existing.setPath;

              candidate.updatedon =
                new Date()
                  .toISOString()
                  .slice(0, 10);

              jobs[
                existingIndex
              ] = candidate;

              await saveJobs(
                jobsFile,
                jobs
              );

              await saveProcessedJob(
                snapshotFile,
                source.id,
                link.href,
                existing.id,
                existing.slug || ""
              );

              result.updatedJobs++;

              console.log(
                `UPDATED: ${candidate.title}`
              );

              /*
               * Mark this homepage state
               * as successful only after
               * processing.
               */
              await markSuccessfulRun(
                snapshotFile,
                source.id,
                links
              );

              continue;
            }

            /*
             * =========================
             * NEW OBJECT
             * =========================
             */

            const validation =
              validateExactStructure(
                template,
                candidate
              );

            if (
              !validation.valid
            ) {
              throw new Error(
                `NEW structure mismatch: ${validation.reason}`
              );
            }

            const newJob =
              applyGeneratedMetadata(
                candidate,
                jobs
              );

            const finalValidation =
              validateExactStructure(
                template,
                newJob
              );

            if (
              !finalValidation.valid
            ) {
              throw new Error(
                `Final structure mismatch: ${finalValidation.reason}`
              );
            }

            jobs.push(
              newJob
            );

            await saveJobs(
              jobsFile,
              jobs
            );

            await saveProcessedJob(
              snapshotFile,
              source.id,
              link.href,
              newJob.id,
              newJob.slug
            );

            result.newJobs++;

            console.log(
              `NEW: ${newJob.title}`
            );

            /*
             * Only after successful processing
             * update homepage snapshot.
             */
            await markSuccessfulRun(
              snapshotFile,
              source.id,
              links
            );
          } catch (error: any) {
            /*
             * IMPORTANT:
             * Do NOT mark this link successful.
             *
             * Therefore it can be retried
             * on next run.
             */
            result.errors.push(
              `${source.name} | ${link.href} | ${error.message}`
            );

            console.error(
              `ERROR: ${error.message}`
            );
          }
        }
      } catch (error: any) {
        result.errors.push(
          `${source.name} | ${error.message}`
        );

        console.error(
          error
        );
      } finally {
        await page.close();
      }
    }
  } finally {
    await closeBrowser();
  }

  console.log(
    "========== AGENT RESULT =========="
  );

  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );

  return result;
}