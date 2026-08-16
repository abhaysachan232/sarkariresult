import path from "path";
import type { Page } from "playwright";

import {
  createPage,
  closeBrowser,
} from "./browser";

import {
  openHomepage,
  getContentLinks,
  type SourceLink,
} from "./links";

import {
  detectChanges,
  getUnprocessedLinks,
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

/*
 * Homepage se actual link click karta hai.
 *
 * PDF ko intentionally ignore karta hai.
 */
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
      `Link not found on homepage: ${target}`
    );
  }

  await link.scrollIntoViewIfNeeded();

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
  } catch {
    throw new Error(
      `Unable to click link: ${target}`
    );
  }

  const popup =
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

  /*
   * PDF destination भी ignore.
   */
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

  /*
   * Agar same page tha to homepage
   * par वापस जाओ.
   */
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

    await page.waitForTimeout(
      500
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

/*
 * New object ke identity fields
 * sirf tab modify honge jab
 * wo LAST OBJECT mein already exist hon.
 *
 * Koi new key add nahi hogi.
 */
function applyGeneratedMetadata(
  candidate: any,
  template: any,
  jobs: any[]
) {
  const nextId =
    getNextId(jobs);

  const title =
    String(
      candidate?.title ||
      "government-job"
    );

  if (
    Object.prototype.hasOwnProperty.call(
      template,
      "id"
    )
  ) {
    candidate.id =
      nextId;
  }

  if (
    Object.prototype.hasOwnProperty.call(
      template,
      "slug"
    )
  ) {
    candidate.slug =
      makeSlug(title);
  }

  if (
    Object.prototype.hasOwnProperty.call(
      template,
      "updatedon"
    )
  ) {
    candidate.updatedon =
      new Date()
        .toISOString()
        .slice(0, 10);
  }

  return candidate;
}

/*
 * Main Agent
 */
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
    oldUnprocessedLinks: 0,
    processedThisRun: 0,
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

      console.log(
        ""
      );

      console.log(
        `========== ${source.name} ==========`
      );

      const page =
        await createPage();

      try {
        /*
         * ============================
         * STEP 1
         * Homepage open
         * ============================
         */
        await openHomepage(
          page,
          source.url
        );

        const host =
          new URL(
            source.url
          ).hostname;

        /*
         * ============================
         * STEP 2
         * Blue relevant links
         * ============================
         */
        const currentLinks =
          await getContentLinks(
            page,
            host
          );

        result.linksFound +=
          currentLinks.length;

        console.log(
          `Relevant blue links: ${currentLinks.length}`
        );

        /*
         * ============================
         * STEP 3
         * Detect NEW/CHANGED
         * ============================
         */
        const changes =
          await detectChanges(
            snapshotFile,
            source.id,
            currentLinks
          );

        /*
         * First ever run:
         *
         * Snapshot create.
         * Us run mein articles process
         * nahi honge.
         */
        if (
          changes.firstRun
        ) {
          console.log(
            "FIRST RUN: baseline snapshot created."
          );

          console.log(
            "Existing links will be processed from the next run."
          );

          continue;
        }

        result.changedLinks +=
          changes.changed.length;

        console.log(
          `NEW/CHANGED LINKS: ${changes.changed.length}`
        );

        /*
         * ============================
         * STEP 4
         * Existing snapshot ke
         * unprocessed links
         *
         * Tumhare 94 links yahan
         * se 10-10 karke aayenge.
         * ============================
         */
        const unprocessed =
          await getUnprocessedLinks(
            snapshotFile,
            source.id,
            CONFIG.batchSize
          );

        result.oldUnprocessedLinks +=
          unprocessed.length;

        console.log(
          `OLD UNPROCESSED LINKS: ${unprocessed.length}`
        );

        /*
         * ============================
         * STEP 5
         * NEW/CHANGED + OLD
         * UNPROCESSED
         *
         * Duplicate remove.
         * Batch limit 10.
         *
         * NEW/CHANGED links ko priority.
         * ============================
         */
        const combined =
          new Map<
            string,
            SourceLink
          >();

        /*
         * Pehle new/changed.
         */
        for (
          const link of
            changes.changed
        ) {
          combined.set(
            link.href,
            link
          );
        }

        /*
         * Phir old unprocessed.
         */
        for (
          const link of
            unprocessed
        ) {
          if (
            !combined.has(
              link.href
            )
          ) {
            combined.set(
              link.href,
              link
            );
          }
        }

        const linksToProcess =
          Array.from(
            combined.values()
          ).slice(
            0,
            CONFIG.batchSize
          );

        console.log(
          `PROCESSING THIS RUN: ${linksToProcess.length}`
        );

        /*
         * ============================
         * STEP 6
         * Process sequentially
         * ============================
         */
        for (
          const link of
            linksToProcess
        ) {
          try {
            console.log(
              ""
            );

            console.log(
              `NEW/CHANGED LINK: ${link.text}`
            );

            /*
             * PDF ignore.
             */
            if (
              /\.pdf(?:$|\?)/i.test(
                link.href
              )
            ) {
              console.log(
                "SKIPPED PDF"
              );

              result.skipped++;

              continue;
            }

            /*
             * ============================
             * CLICK LINK
             * ============================
             */
            const detail =
              await clickChangedLink(
                page,
                link.href
              );

            if (
              !detail.content ||
              detail.content.length < 100
            ) {
              throw new Error(
                "Detail page content is too short"
              );
            }

            console.log(
              `Opened: ${detail.url}`
            );

            console.log(
              `Page content length: ${detail.content.length}`
            );

            /*
             * ============================
             * READ CURRENT jobs.json
             *
             * Har article ke liye
             * fresh jobs.json read.
             * ============================
             */
            const jobs =
              await readJobs(
                jobsFile
              );

            /*
             * ============================
             * LAST OBJECT TEMPLATE
             * ============================
             */
            const template =
              getLastJobTemplate(
                jobs
              );

            /*
             * ============================
             * Check mapping
             * ============================
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
             * ============================
             * AI
             * ============================
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
             * Agar mapping se existing
             * object nahi mila to
             * title + organization se
             * search.
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
             * ============================
             * UPDATE EXISTING
             * ============================
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
              if (
                Object.prototype.hasOwnProperty.call(
                  existing,
                  "id"
                )
              ) {
                candidate.id =
                  existing.id;
              }

              if (
                Object.prototype.hasOwnProperty.call(
                  existing,
                  "slug"
                )
              ) {
                candidate.slug =
                  existing.slug;
              }

              if (
                Object.prototype.hasOwnProperty.call(
                  existing,
                  "setPath"
                )
              ) {
                candidate.setPath =
                  existing.setPath;
              }

              if (
                Object.prototype.hasOwnProperty.call(
                  existing,
                  "updatedon"
                )
              ) {
                candidate.updatedon =
                  new Date()
                    .toISOString()
                    .slice(0, 10);
              }

              /*
               * Final structure check.
               */
              const finalValidation =
                validateExactStructure(
                  existing,
                  candidate
                );

              if (
                !finalValidation.valid
              ) {
                throw new Error(
                  `FINAL UPDATE structure mismatch: ${finalValidation.reason}`
                );
              }

              jobs[
                existingIndex
              ] = candidate;

              await saveJobs(
                jobsFile,
                jobs
              );

              /*
               * Mark successful.
               */
              await saveProcessedJob(
                snapshotFile,
                source.id,
                link.href,
                existing.id,
                existing.slug || ""
              );

              result.updatedJobs++;
              result.processedThisRun++;

              console.log(
                `UPDATED: ${candidate.title}`
              );

              continue;
            }

            /*
             * ============================
             * NEW OBJECT
             * ============================
             */

            /*
             * Template ke exact structure
             * mein candidate already
             * normalize ho chuka hai.
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

            /*
             * Metadata:
             * sirf existing keys mein.
             */
            const newJob =
              applyGeneratedMetadata(
                candidate,
                template,
                jobs
              );

            /*
             * Final exact structure.
             */
            const finalValidation =
              validateExactStructure(
                template,
                newJob
              );

            if (
              !finalValidation.valid
            ) {
              throw new Error(
                `FINAL NEW structure mismatch: ${finalValidation.reason}`
              );
            }

            /*
             * ============================
             * PUSH NEW OBJECT
             * ============================
             */
            jobs.push(
              newJob
            );

            await saveJobs(
              jobsFile,
              jobs
            );

            /*
             * Successful mapping.
             */
            await saveProcessedJob(
              snapshotFile,
              source.id,
              link.href,
              newJob.id,
              newJob.slug || ""
            );

            result.newJobs++;
            result.processedThisRun++;

            console.log(
              `NEW: ${newJob.title}`
            );
          } catch (
            error: any
          ) {
            /*
             * IMPORTANT:
             *
             * Failed link ko processed
             * mark nahi karenge.
             *
             * Isliye next run mein
             * automatically retry hoga.
             */
            const message =
              error?.message ||
              "Unknown error";

            result.errors.push(
              `${source.name} | ${link.href} | ${message}`
            );

            console.error(
              `ERROR: ${message}`
            );
          }
        }

        /*
         * ============================
         * STEP 7
         *
         * Homepage snapshot update.
         *
         * Processed mappings preserve
         * rahengi.
         * ============================
         */
        await markSuccessfulRun(
          snapshotFile,
          source.id,
          currentLinks
        );

        console.log(
          "Homepage snapshot updated."
        );
      } catch (
        error: any
      ) {
        const message =
          error?.message ||
          "Unknown source error";

        result.errors.push(
          `${source.name} | ${message}`
        );

        console.error(
          message
        );
      } finally {
        await page.close();
      }
    }
  } finally {
    await closeBrowser();
  }

  console.log(
    ""
  );

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