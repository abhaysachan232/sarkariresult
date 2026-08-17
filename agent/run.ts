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
  saveFailedJob,
  getProcessedJob,
  isLinkFailed,
  markSuccessfulRun,
} from "./snapshot";

import {
  readJobs,
  saveJobs,
  getLastJobTemplate,
  validateExactStructure,
  getNextId,
  makeSlug,
  setTypeAndCategory,
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
==================================================
SOURCE DOMAIN
==================================================
*/

const SOURCE_DOMAIN =
  "sarkariresult.com.cm";

/*
==================================================
REMOVE SOURCE DOMAIN FROM TEXT
==================================================
*/

function removeSourceDomainFromString(
  value: string
) {
  let result = value;

  /*
   * Full source URLs
   */
  result = result.replace(
    /https?:\/\/(?:www\.)?sarkariresult\.com\.cm[^\s"'<>)]*/gi,
    ""
  );

  /*
   * Domain only
   */
  result = result.replace(
    /\b(?:www\.)?sarkariresult\.com\.cm\b/gi,
    ""
  );

  /*
   * Brand names
   */
  result = result.replace(
    /\bSarkari\s*Result(?:\.com\.cm)?\b/gi,
    ""
  );

  result = result.replace(
    /\bSarkariResult(?:\.com\.cm)?\b/gi,
    ""
  );

  /*
   * Source attribution
   */
  result = result.replace(
    /\bSource\s*:\s*/gi,
    ""
  );

  result = result.replace(
    /\bAccording\s+to\s+Sarkari\s*Result\b/gi,
    ""
  );

  result = result.replace(
    /\bAs\s+per\s+Sarkari\s*Result\b/gi,
    ""
  );

  /*
   * Extra spaces
   */
  result = result.replace(
    /[ \t]{2,}/g,
    " "
  );

  return result.trim();
}

/*
==================================================
RECURSIVE SOURCE CLEANUP
==================================================
*/

function removeSourceReferences(
  value: any
): any {
  if (
    typeof value === "string"
  ) {
    return removeSourceDomainFromString(
      value
    );
  }

  if (
    Array.isArray(value)
  ) {
    return value.map(
      (item) =>
        removeSourceReferences(
          item
        )
    );
  }

  if (
    value &&
    typeof value === "object"
  ) {
    const output: any = {};

    for (
      const key of Object.keys(
        value
      )
    ) {
      output[key] =
        removeSourceReferences(
          value[key]
        );
    }

    return output;
  }

  return value;
}

/*
==================================================
CHECK SOURCE DOMAIN URL
==================================================
*/

function isSourceDomainUrl(
  value: string
) {
  try {
    const url =
      new URL(value);

    const hostname =
      url.hostname
        .toLowerCase()
        .replace(
          /^www\./,
          ""
        );

    return (
      hostname ===
      SOURCE_DOMAIN
    );
  } catch {
    return false;
  }
}

/*
==================================================
REMOVE SOURCE LINKS
==================================================

Only sarkariresult.com.cm links are removed.

Official government links are preserved.
==================================================
*/

function removeSourceLinks(
  value: any
): any {
  if (
    Array.isArray(value)
  ) {
    return value
      .filter((item) => {
        /*
         * String URL
         */
        if (
          typeof item === "string"
        ) {
          const trimmed =
            item.trim();

          if (
            /^https?:\/\//i.test(
              trimmed
            )
          ) {
            return !isSourceDomainUrl(
              trimmed
            );
          }

          return true;
        }

        /*
         * Link object
         */
        if (
          item &&
          typeof item === "object"
        ) {
          const linkFields = [
            "href",
            "url",
            "link",
            "applyLink",
            "officialLink",
          ];

          for (
            const field of linkFields
          ) {
            if (
              typeof item[field] ===
                "string" &&
              isSourceDomainUrl(
                item[field]
              )
            ) {
              return false;
            }
          }
        }

        return true;
      })
      .map(
        (item) =>
          removeSourceLinks(
            item
          )
      );
  }

  if (
    value &&
    typeof value === "object"
  ) {
    const output: any = {};

    for (
      const key of Object.keys(
        value
      )
    ) {
      output[key] =
        removeSourceLinks(
          value[key]
        );
    }

    return output;
  }

  return value;
}

/*
==================================================
FINAL CLEANUP
==================================================
*/

function cleanGeneratedJob(
  job: any
) {
  let cleaned =
    removeSourceReferences(
      job
    );

  cleaned =
    removeSourceLinks(
      cleaned
    );

  return cleaned;
}

/*
==================================================
CLICK CHANGED LINK
==================================================

Homepage par jo blue link mila tha,
usi URL ko open karta hai.

PDF ko intentionally skip karta hai.
==================================================
*/

async function clickChangedLink(
  page: Page,
  href: string
) {
  /*
   * PDF skip
   */
  if (
    /\.pdf(?:$|\?)/i.test(
      href
    )
  ) {
    throw new Error(
      "PDF links are not allowed"
    );
  }

  /*
   * Absolute URL
   */
  const targetUrl =
    new URL(
      href
    ).href;

  /*
   * Open detail page.
   */
  await page.goto(
    targetUrl,
    {
      waitUntil:
        "domcontentloaded",
      timeout: 60000,
    }
  );

  /*
   * Wait for dynamically rendered content.
   */
  await page.waitForTimeout(
    1500
  );

  /*
   * ==================================================
   * BODY CONTENT
   * ==================================================
   */
  const bodyContent =
    await page.locator(
      "body"
    ).innerText();

  /*
   * ==================================================
   * IMPORTANT LINKS TABLE
   * ==================================================
   *
   * Example:
   *
   * Download Tier-II Result | Click Here
   * Check Tier-II Result Notice | Click Here
   * Download Tier-II Answer Key | Click Here
   *
   * Left side ka exact text + right side
   * ke anchor ka exact href extract hoga.
   *
   * sarkariresult.com.cm ke links skip honge.
   */
  const importantLinks =
    await page.locator(
      "tr"
    ).evaluateAll(
      (rows) => {
        const normalize = (
          value: string
        ) =>
          value
            .replace(
              /\s+/g,
              " "
            )
            .trim();

        const isPdf = (
          url: string
        ) =>
          /\.pdf(?:$|\?)/i.test(
            url
          );

        const isSourceDomain = (
          url: string
        ) => {
          try {
            const parsed =
              new URL(url);

            const hostname =
              parsed.hostname
                .toLowerCase()
                .replace(
                  /^www\./,
                  ""
                );

            return (
              hostname ===
              "sarkariresult.com.cm"
            );
          } catch {
            return false;
          }
        };

        const result: Array<{
          text: string;
          href: string;
        }> = [];

        for (
          const row of rows
        ) {
          const cells =
            Array.from(
              row.querySelectorAll(
                "td, th"
              )
            );

          /*
           * Important-links rows normally
           * contain two or more cells:
           *
           * [left text] [Click Here]
           */
          if (
            cells.length < 2
          ) {
            continue;
          }

          const label =
            normalize(
              cells[0]
                .textContent || ""
            );

          if (!label) {
            continue;
          }

          /*
           * First try the right cell.
           * Then use the row as fallback.
           */
          let anchor =
            cells[1].querySelector(
              "a"
            ) as
              | HTMLAnchorElement
              | null;

          if (!anchor) {
            anchor =
              row.querySelector(
                "a"
              ) as
                | HTMLAnchorElement
                | null;
          }

          if (!anchor) {
            continue;
          }

          const linkText =
            normalize(
              anchor.textContent || ""
            );

          /*
           * Only Click Here links.
           */
          if (
            !/click\s*here/i.test(
              linkText
            )
          ) {
            continue;
          }

          const linkHref =
            anchor.href;

          if (!linkHref) {
            continue;
          }

          /*
           * Never include source-site links.
           */
          if (
            isSourceDomain(
              linkHref
            )
          ) {
            continue;
          }

          /*
           * PDF links are skipped.
           */
          if (
            isPdf(
              linkHref
            )
          ) {
            continue;
          }

          result.push({
            text: label,
            href: linkHref,
          });
        }

        /*
         * Remove duplicate URLs.
         */
        const unique =
          new Map<
            string,
            {
              text: string;
              href: string;
            }
          >();

        for (
          const item of result
        ) {
          if (
            !unique.has(
              item.href
            )
          ) {
            unique.set(
              item.href,
              item
            );
          }
        }

        return [
          ...unique.values(),
        ];
      }
    );

  /*
   * ==================================================
   * IMPORTANT LINKS FOR AI
   * ==================================================
   *
   * Exact left-side keyword + exact URL.
   */
  const importantLinksText =
    importantLinks.length > 0
      ? `

IMPORTANT LINKS FROM PAGE
=========================

${importantLinks
  .map(
    (item) =>
      `${item.text} | ${item.href}`
  )
  .join("\n")}
`
      : "";

  /*
   * Keep original body text and append
   * structured important links separately.
   *
   * Do not collapse whitespace here.
   */
  const content =
    `${bodyContent}

${importantLinksText}`.trim();

  return {
    url:
      page.url(),

    content,

    importantLinks,
  };
}


/*
==================================================
GENERATED METADATA
==================================================
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

  /*
   * ID
   */
  if (
    Object.prototype.hasOwnProperty.call(
      template,
      "id"
    )
  ) {
    candidate.id =
      nextId;
  }

  /*
   * Slug
   */
  if (
    Object.prototype.hasOwnProperty.call(
      template,
      "slug"
    )
  ) {
    candidate.slug =
      makeSlug(title);
  }

  /*
   * Date/update field
   */
  if (
    Object.prototype.hasOwnProperty.call(
      template,
      "updatedon"
    )
  ) {
    candidate.updatedon =
      new Date()
        .toISOString()
        .slice(
          0,
          10
        );
  }

  return candidate;
}

/*
==================================================
MAIN AGENT
==================================================
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
    /*
    ==================================================
    PROCESS EVERY CONFIGURED SOURCE
    ==================================================
    */

    for (
      const source of
        CONFIG.sources
    ) {
      result.sourcesChecked++;

      console.log("");

      console.log(
        `========== ${source.name} ==========`
      );

      const page =
        await createPage();

      try {
        /*
        ==============================================
        1. OPEN HOMEPAGE
        ==============================================
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
        ==============================================
        2. FIND BLUE LINKS
        ==============================================
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
        ==============================================
        3. DETECT NEW / CHANGED LINKS
        ==============================================
        */

        const changes =
          await detectChanges(
            snapshotFile,
            source.id,
            currentLinks
          );

        /*
        ==============================================
        FIRST RUN
        ==============================================
        */

        if (
          changes.firstRun
        ) {
          console.log(
            "FIRST RUN: baseline snapshot created."
          );

          console.log(
            "Existing links will be processed from next run."
          );

          continue;
        }

        result.changedLinks +=
          changes.changed.length;

        console.log(
          `NEW/CHANGED LINKS: ${changes.changed.length}`
        );

        /*
        ==============================================
        4. OLD UNPROCESSED LINKS
        ==============================================
        */

        const unprocessed =
          await getUnprocessedLinks(
            snapshotFile,
            source.id
          );

        result.oldUnprocessedLinks +=
          unprocessed.length;

        console.log(
          `OLD UNPROCESSED LINKS: ${unprocessed.length}`
        );

        /*
        ==============================================
        5. COMBINE LINKS
        ==============================================
        */

        const combined =
          new Map<
            string,
            SourceLink
          >();

        /*
         * New/changed first.
         *
         * Permanently failed links are
         * never added again.
         */
        for (
          const link of
            changes.changed
        ) {
          const failed =
            await isLinkFailed(
              snapshotFile,
              source.id,
              link.href
            );

          if (failed) {
            console.log(
              `PERMANENTLY SKIPPED: ${link.text}`
            );

            continue;
          }

          combined.set(
            link.href,
            link
          );
        }

        /*
         * ALL old pending links.
         *
         * No batch limit.
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

        /*
         * Process every eligible link.
         *
         * No CONFIG.batchSize limit.
         */
        const linksToProcess =
          Array.from(
            combined.values()
          );

        console.log(
          `PROCESSING THIS RUN: ${linksToProcess.length}`
        );

        /*
        ==============================================
        6. PROCESS EACH LINK
        ==============================================
        */

        for (
          const link of
            linksToProcess
        ) {
          try {
            console.log("");

            console.log(
              `NEW/CHANGED LINK: ${link.text}`
            );

            /*
            ==========================================
            SKIP PDF
            ==========================================
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
            ==========================================
            OPEN PAGE
            ==========================================
            */

            const detail =
              await clickChangedLink(
                page,
                link.href
              );

            console.log(
              `Opened: ${detail.url}`
            );

            console.log(
              `Page content length: ${detail.content.length}`
            );

            /*
            ==========================================
            CONTENT CHECK
            ==========================================
            */

            if (
              detail.content.length <
              100
            ) {
              throw new Error(
                "Detail page content is too short"
              );
            }

            /*
            ==========================================
            READ CURRENT JOBS.JSON
            ==========================================
            */

            const jobs =
              await readJobs(
                jobsFile
              );

            /*
            ==========================================
            LAST OBJECT = TEMPLATE
            ==========================================
            */

            const template =
              getLastJobTemplate(
                jobs
              );

            /*
            ==========================================
            CHECK SNAPSHOT MAPPING
            ==========================================
            */

            const mapped =
              await getProcessedJob(
                snapshotFile,
                source.id,
                link.href
              );

            let existingIndex =
              -1;

            if (
              mapped
            ) {
              existingIndex =
                findJobById(
                  jobs,
                  mapped.jobId
                );
            }

            /*
            ==========================================
            AI EXTRACTION
            ==========================================
            */

            let candidate =
              await extractJob(
                detail.content.slice(
                  0,
                  CONFIG.maxContentLength
                ),
                detail.url,
                template
              );

            /*
            ==========================================
            REMOVE SOURCE BRANDING
            ==========================================
            */

            candidate =
              cleanGeneratedJob(
                candidate
              );

            /*
            ==========================================
            TRY TITLE / ORGANIZATION MATCH
            ==========================================
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
            ==========================================
            UPDATE EXISTING JOB
            ==========================================
            */

            if (
              existingIndex !== -1
            ) {
              const existing =
                jobs[
                  existingIndex
                ];

              /*
              Structure check.
              */
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
              Preserve ID.
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

              /*
              Preserve slug.
              */
              if (
                Object.prototype.hasOwnProperty.call(
                  existing,
                  "slug"
                )
              ) {
                candidate.slug =
                  existing.slug;
              }

              /*
              Preserve setPath.
              */
              if (
                Object.prototype.hasOwnProperty.call(
                  existing,
                  "setPath"
                )
              ) {
                candidate.setPath =
                  existing.setPath;
              }

              /*
              Updated date.
              */
              if (
                Object.prototype.hasOwnProperty.call(
                  existing,
                  "updatedon"
                )
              ) {
                candidate.updatedon =
                  new Date()
                    .toISOString()
                    .slice(
                      0,
                      10
                    );
              }

              /*
              ======================================
              TYPE + CATEGORY
              ======================================
              */

              setTypeAndCategory(
                candidate,
                existing
              );

              /*
              ======================================
              FINAL SOURCE CLEANUP
              ======================================
              */

              candidate =
                cleanGeneratedJob(
                  candidate
                );

              /*
              ======================================
              FINAL STRUCTURE CHECK
              ======================================
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

              /*
              ======================================
              SAVE
              ======================================
              */

              jobs[
                existingIndex
              ] = candidate;

              await saveJobs(
                jobsFile,
                jobs
              );

              /*
              Mark processed only
              after successful save.
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
            ==========================================
            NEW JOB
            ==========================================
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
            Metadata.
            */
            const newJob =
              applyGeneratedMetadata(
                candidate,
                template,
                jobs
              );

            /*
            ==========================================
            TYPE + CATEGORY
            ==========================================
            */

            setTypeAndCategory(
              newJob,
              template
            );

            /*
            ==========================================
            FINAL CLEANUP
            ==========================================
            */

            const finalJob =
              cleanGeneratedJob(
                newJob
              );

            /*
            ==========================================
            FINAL STRUCTURE VALIDATION
            ==========================================
            */

            const finalValidation =
              validateExactStructure(
                template,
                finalJob
              );

            if (
              !finalValidation.valid
            ) {
              throw new Error(
                `FINAL NEW structure mismatch: ${finalValidation.reason}`
              );
            }

            /*
            ==========================================
            ADD TO JOBS.JSON
            ==========================================
            */

            jobs.push(
              finalJob
            );

            await saveJobs(
              jobsFile,
              jobs
            );

            /*
            ==========================================
            MARK PROCESSED
            ==========================================
            */

            await saveProcessedJob(
              snapshotFile,
              source.id,
              link.href,
              finalJob.id,
              finalJob.slug || ""
            );

            result.newJobs++;
            result.processedThisRun++;

            console.log(
              `NEW: ${finalJob.title}`
            );
          } catch (
            error: any
          ) {
            /*
             * IMPORTANT:
             *
             * Failed link ko permanently failed
             * mark karo.
             *
             * Next run mein is link ko dobara
             * kabhi attempt nahi kiya jayega.
             *
             * Error hone ke baad bhi next link
             * processing continue rahegi.
             */

            const message =
              error?.message ||
              "Unknown error";

            result.errors.push(
              `${source.name} | ${link.href} | ${message}`
            );

            console.error(
              `PERMANENTLY FAILED: ${message}`
            );

            try {
              await saveFailedJob(
                snapshotFile,
                source.id,
                link.href,
                message
              );

              console.log(
                `PERMANENTLY SKIPPED: ${link.href}`
              );
            } catch (
              saveError: any
            ) {
              console.error(
                `Could not save failed status: ${
                  saveError?.message ||
                  "Unknown error"
                }`
              );
            }

            /*
             * Do NOT throw.
             *
             * Next link will continue.
             */
            continue;
          }
        }

        /*
        ==============================================
        UPDATE HOMEPAGE SNAPSHOT
        ==============================================
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

  /*
  ==============================================
  FINAL RESULT
  ==============================================
  */

  console.log("");

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