import datas from "@/public/jobs.json";
import StateJobsClient from "./StateJobsClient";

export async function generateMetadata({ params }: any) {
  const stateName = decodeURIComponent(params.slug).replace("-", " ");
  return {
    title: `${stateName} Govt Jobs 2025 | ${stateName} Sarkari Result`,
    description: `Latest ${stateName} Government jobs, recruitment, results & exam updates.`,
  };
}

export default function StateJobs({ params }: any) {
  const stateSlug = decodeURIComponent(params.slug);
  const stateName = stateSlug.replace("-", " ");

  const jobList = datas.filter(
    (job: any) =>
      job.state?.toLowerCase() === stateName.toLowerCase() ||
      (Array.isArray(job.state) &&
        job.state.some(
          (s: string) => s.toLowerCase() === stateName.toLowerCase()
        ))
  );

  return <StateJobsClient stateName={stateName} jobList={jobList} />;
}
