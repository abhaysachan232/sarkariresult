export const CONFIG = {
  sources: [
    {
      id: "sarkariresult-com-cm",
      name: "sarkariresult.com.cm",
      url: "https://sarkariresult.com.cm/",
    },
  ],

  jobsFile: "public/jobs.json",

  snapshotFile: "public/source-snapshot.json",

  hfModel:
    process.env.HF_MODEL ||
    "Qwen/Qwen3-4B-Instruct-2507",

  /*
   * Ek GitHub Actions run mein maximum
   * kitne articles process karne hain.
   */
  batchSize: 10,

  /*
   * Source page se maximum text.
   */
  maxContentLength: 70000,
};