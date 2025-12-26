const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { createCanvas,loadImage } = require("canvas");
// 🔹 Job data (slug + title required)
const job = require("../public/jobs.json");
const articles = require("../public/articles.json");
const jobs = [...job, ...articles]

const WIDTH = 1200;
const HEIGHT = 630;

const OUTPUT_DIR = path.join(process.cwd(), "public/og/jobs");

async function generateImages() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const job of jobs) {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext("2d");

    /* ================= BACKGROUND ================= */
    const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
    gradient.addColorStop(0, "#2563eb"); // blue
    gradient.addColorStop(1, "#6d28d9"); // purple
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    /* ================= NEW BADGE ================= */
    ctx.fillStyle = "#facc15";
    drawRoundRect(ctx, 480, 40, 240, 70, 40);
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.font = "bold 36px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("NEW", 600, 90);

    /* ================= LEFT ICON CARD ================= */
// Background card
const CARD_X = 90;
const CARD_Y = 190;
const CARD_W = 230;
const CARD_H = 300;

ctx.fillStyle = "rgba(255,255,255,0.15)";
drawRoundRect(ctx, CARD_X, CARD_Y, CARD_W, CARD_H, 26);
ctx.fill();

// ✅ TO-DO / CHECKLIST ICON
const todoIcon = await loadImage(
  path.join(process.cwd(), "public/todo.png")
);


// 🔥 Icon sizing (NOT compact)
const ICON_SIZE = 180; // ideal size (150 was too small)

// Auto-center icon inside card
const ICON_X = CARD_X + (CARD_W - ICON_SIZE) / 2;
const ICON_Y = CARD_Y + (CARD_H - ICON_SIZE) / 2;

ctx.drawImage(todoIcon, ICON_X, ICON_Y, ICON_SIZE, ICON_SIZE);


    /* ================= JOB TITLE ================= */
    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";

    let fontSize = 62;
    ctx.font = `bold ${fontSize}px sans-serif`;

    // 🔥 Auto-shrink font for long titles
    while (ctx.measureText(job.title).width > 700 && fontSize > 44) {
      fontSize -= 2;
      ctx.font = `bold ${fontSize}px sans-serif`;
    }

    wrapText(
      ctx,
      job.title,
      380,        // X
      260,        // Y
      700,        // Max width
      fontSize + 12
    );

    /* ================= FOOTER ================= */
    ctx.font = "bold 36px sans-serif";
    ctx.fillStyle = "#fde68a";
    ctx.fillText("sarkariresult.rest", 380, 540);

    /* ================= SAVE WEBP ================= */
    const buffer = canvas.toBuffer("image/png");

    await sharp(buffer)
      .webp({ quality: 82 })
      .toFile(path.join(OUTPUT_DIR, `${job.slug}.webp`));

    console.log(`✅ Generated: ${job.slug}.webp`);
  }
}

/* ================= HELPERS ================= */

function drawRoundRect(ctx, x, y, w, h, r) {
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
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = words[i] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

/* ================= RUN ================= */
generateImages().catch(console.error);
//   "prebuild": "", node scripts/generate-job-images.js