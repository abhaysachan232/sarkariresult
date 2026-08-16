export const CONFIG = {
  sources: [
    {
      id: "sarkariresult-com",
      name: "sarkariresult.com",
      url: "https://sarkariresult.com/",
    },
    {
      id: "sarkariresult-com-cm",
      name: "sarkariresult.com.cm",
      url: "https://sarkariresult.com.cm/",
    },
  ],

  jobsFile: "public/jobs.json",

  snapshotFile: "data/source-snapshot.json",

  hfModel:
    process.env.HF_MODEL ||
    "Qwen/Qwen3-4B-Instruct-2507",

  maxContentLength: 60000,

  // पहली run में सिर्फ snapshot बनेगा
  // existing links process नहीं होंगे.
  processFirstRun: false,
};
