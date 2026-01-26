import { NextResponse } from "next/server";
import { fetchAndAppendJobs } from "@/utils/AutoFetcher";

export async function GET() {
  // try {
  //   const result = await fetchAndAppendJobs();
  //   return NextResponse.json({ success: true, added: result, debug: result }); // debug field me object bhejo
  // } catch (error: any) {
  //   return NextResponse.json({ success: false, error: error.message });
  // }
}

