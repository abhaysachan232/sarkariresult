// app/api/job-image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import path from "path";
import jobs from "@/public/jobs.json"; // aapke path ke hisaab se adjust

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug required" }, { status: 400 });
  }

  const job = jobs.find((j: any) =>
    j.setPath.includes(" ")
      ? j.setPath.split(" ").join("-") === slug
      : j.setPath === slug
  );
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const width = 1200;
  const height = 675;

  // Background
  const bgPath = path.join(process.cwd(), "public", "jobs-images", "image_news.png");
  if (!fs.existsSync(bgPath)) {
    return NextResponse.json({ error: "Background image not found" }, { status: 404 });
  }

  const logoPath = path.join(process.cwd(), "public", "jobs-images", "logo.png");

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Draw background image
  const bgImage = await loadImage(bgPath);
  ctx.drawImage(bgImage, 0, 0, width, height);

  // Draw logo top-left
  if (fs.existsSync(logoPath)) {
    const logo = await loadImage(logoPath);
    const logoWidth = 150;
    const logoHeight = (logo.height / logo.width) * logoWidth;
    ctx.drawImage(logo, 30, 30, logoWidth, logoHeight);
  }

  // Text settings
  const padding = 60; // left-right padding
  let fontSize = 60; // initial font size
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.shadowColor = "rgba(0,0,0,0.7)";
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 6;

  // Adjust font size to fit within width
  const maxTextWidth = width - padding * 2;
  let measuredWidth = ctx.measureText(job.title).width;
  while (measuredWidth > maxTextWidth && fontSize > 30) {
    fontSize -= 2;
    ctx.font = `bold ${fontSize}px sans-serif`;
    measuredWidth = ctx.measureText(job.title).width;
  }

  // Word wrap
  const words = job.title.split(" ");
  const lines: string[] = [];
  let line = "";
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    if (ctx.measureText(testLine).width > maxTextWidth) {
      lines.push(line.trim());
      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  // Draw text from bottom-center
  const lineHeight = fontSize + 10;
  let y = height - 50 - (lines.length - 1) * lineHeight;
  const textGradient = ctx.createLinearGradient(0, height - 200, width, height);
  textGradient.addColorStop(0, "#ffffff");
  textGradient.addColorStop(1, "#00c6ff");
  ctx.fillStyle = textGradient;

  lines.forEach((ln) => {
    ctx.fillText(ln, width / 2, y);
    y += lineHeight;
  });

  const buffer = canvas.toBuffer("image/png");
  return new NextResponse(new Uint8Array(buffer), {
    headers: { "Content-Type": "image/png" },
    
  });
}
