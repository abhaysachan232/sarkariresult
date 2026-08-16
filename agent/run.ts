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
    /\.pdf(?:$|\?)/i.test(href)
  ) {
    throw new Error(
      "PDF link ignored"
    );
  }

  const target =
    new URL(href).href;

  const link =
    page.locator(
      `a[href="${target}"]`
    ).first();

  if (
    await link.count() === 0
  ) {
    throw new Error(
      `Link not found on homepage: ${target}`
    );
  }

  await link.scrollIntoViewIfNeeded();

  const currentUrl =
    page.url();

  let newPage:
    | Page
    | null = null;

  try {
    const popupPromise =
      page
        .context()
        .waitForEvent(
          "page",
          {
            timeout: 3000,
          }
        )
        .catch(() => null);

    await link.click({
      timeout: 30000,
    });

    newPage =
      await popupPromise;
  } catch {
    // click may navigate normally
  }

  const detailPage =
    newPage || page;

  if (newPage) {
    await newPage.waitForLoadState(
      "domcontentloaded"
    );
  } else {
    await page.waitForLoadState(
      "domcontentloaded"
    );
  }

  await detailPage.waitForTimeout(
    1200
  );

  const finalUrl =
    detailPage.url();

  if (
    /\.pdf(?:$|\?)/i.test(
      finalUrl
    )
  ) {
    if (newPage) {
      await newPage.close();
    }

    throw new Error(
      "Destination is PDF. Ignored."
    );
  }

  const title =
    await detailPage.title();

  const content =
    await detailPage
      .locator("body")
      .innerText();

  // If normal same-tab navigation happened,
  // return page to homepage before next link.
  if (!newPage) {
    await page.goto(
      currentUrl,
      {
        waitUntil:
          "domcontentloaded",
        timeout: 60000,
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
        .replace(/\s+/g, " ")
        .trim(),
  };
}

function applyGeneratedMetadata(
  candidate: any,
  jobs: any[],
  sourceUrl: string
) {
  const nextId =
    getNextId(jobs);

  const title =
    String(
      candidate?.title ||
      candidate?.setPath ||
      "government-job"
    );

  candidate.id = nextId;

  candidate.slug =
    makeSlug(title);

  candidate.setPath =
    candidate.setPath ||
    title;

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
          `\n========== ${source.name} ==========`
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
            "First run: snapshot created. No links processed."
          );

          continue;
        }

        result.changedLinks +=
          changes.changed.length;

        console.log(
          `Changed/New links: ${changes.changed.length}`
        );

        for (
          const link of changes.changed
        ) {
          try {
            console.log(
              `\nNEW/CHANGED LINK: ${link.text}`
            );

            // PDF completely disabled.
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
             * NEW OBJECT:
             * ALWAYS LAST OBJECT TEMPLATE
             */
            const newTemplate =
              getLastJobTemplate(
                jobs
              );

            /*
             * Existing URL mapping.
             *
             * If this homepage link was
             * previously processed, use
             * the mapped job ID.
             */
            const mappedJob =
              await getProcessedJob(
                snapshotFile,
                source.id,
                link.href
              );

            let existingIndex =
              -1;

            if (mappedJob) {
              existingIndex =
                findJobById(
                  jobs,
                  mappedJob.jobId
                );
            }

            /*
             * If no URL mapping exists,
             * AI extracts candidate from
             * LAST OBJECT structure.
             */
            const candidate =
              await extractJob(
                detail.content.slice(
                  0,
                  CONFIG.maxContentLength
                ),
                detail.url,
                newTemplate
              );

            /*
             * Try title + organization
             * only if URL mapping didn't find it.
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
             * UPDATE
             */
            if (
              existingIndex !== -1
            ) {
              /*
               * IMPORTANT:
               * Existing object's own
               * structure is preserved.
               *
               * AI output is accepted only
               * if it has exactly the same
               * structure as the existing job.
               */
              const existingJob =
                jobs[existingIndex];

              const validation =
                validateExactStructure(
                  existingJob,
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
               * Preserve ID and slug.
               */
              candidate.id =
                existingJob.id;

              candidate.slug =
                existingJob.slug;

              candidate.setPath =
                existingJob.setPath;

              candidate.updatedon =
                new Date()
                  .toISOString()
                  .slice(0, 10);

              jobs[existingIndex] =
                candidate;

              await saveJobs(
                jobsFile,
                jobs
              );

              await saveProcessedJob(
                snapshotFile,
                source.id,
                link.href,
                existingJob.id,
                existingJob.slug || ""
              );

              result.updatedJobs++;

              console.log(
                `UPDATED: ${candidate.title}`
              );

              continue;
            }

            /*
             * NEW
             *
             * Candidate MUST match
             * LAST OBJECT structure.
             */
            const validation =
              validateExactStructure(
                newTemplate,
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
                jobs,
                detail.url
              );

            /*
             * Ensure generated object
             * still has exact last-object
             * structure.
             */
            const finalValidation =
              validateExactStructure(
                newTemplate,
                newJob
              );

            if (
              !finalValidation.valid
            ) {
              throw new Error(
                `Final NEW structure mismatch: ${finalValidation.reason}`
              );
            }

            jobs.push(newJob);

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
          } catch (error: any) {
            result.errors.push(
              `${source.name} | ${link.href} | ${error.message}`
            );

            console.error(
              error
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
    "\n========== AGENT RESULT =========="
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
