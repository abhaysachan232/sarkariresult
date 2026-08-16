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

  maxContentLength: 70000,

  processFirstRun: false,
};