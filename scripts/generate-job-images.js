import fs from "fs";
import path from "path";
import sharp from "sharp";
import { createCanvas, loadImage } from "canvas";
import jobs from "../data/jobs.json" assert { type: "json" };

const WIDTH = 1200;
const HEIGHT = 630;

const outputDir = path.join(process.cwd(), "public/og/jobs");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

for (const job of jobs) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  /* 🔵 Background gradient (same vibe) */
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, "#2563eb");
  gradient.addColorStop(1, "#6d28d9");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  /* 🔶 NEW badge */
  ctx.fillStyle = "#facc15";
  roundRect(ctx, 480, 40, 240, 70, 40);
  ctx.fill();
  ctx.fillStyle = "#000";
  ctx.font = "bold 36px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("NEW", 600, 90);

  /* 📄 Left icon (clipboard style box) */
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  roundRect(ctx, 80, 170, 260, 320, 30);
  ctx.fill();

  ctx.font = "120px serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("📋", 210, 380);

  /* 📝 JOB TITLE (dynamic) */
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 64px sans-serif";
  wrapText(
    ctx,
    job.title,          // 🔥 dynamic text
    380,
    260,
    740,
    78
  );

  /* 🌐 Footer domain */
  ctx.font = "bold 40px sans-serif";
  ctx.fillStyle = "#fde68a";
  ctx.fillText("sarkariresult.rest", 380, 520);

  /* Convert to WEBP */
  const buffer = canvas.toBuffer("image/png");
  await sharp(buffer)
    .webp({ quality: 82 })
    .toFile(path.join(outputDir, `${job.slug}.webp`));

  console.log(`✅ Generated: ${job.slug}.webp`);
}

/* ---------- helpers ---------- */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const { width } = ctx.measureText(testLine);

    if (width > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = words[i] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}
