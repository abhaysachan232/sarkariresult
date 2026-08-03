const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const jobs = [
  ...require("../public/jobs.json"),
  ...require("../public/articles.json"),
];
const favicon = fs.readFileSync(
  path.join(process.cwd(), "public/fevicons/icon1.png")
);

const faviconBase64 = favicon.toString("base64");
const WIDTH = 1200;
const HEIGHT = 630;

const OUTPUT_DIR = path.join(process.cwd(), "public/og/jobs");

const gradients = [
  ["#2563eb", "#6d28d9"],
  ["#0f766e", "#2563eb"],
  ["#7c3aed", "#db2777"],
  ["#0ea5e9", "#0284c7"],
  ["#16a34a", "#15803d"],
];

function escapeXML(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapTitle(text, maxChars = 28) {
  const words = text.split(" ");

  const lines = [];
  let line = "";

  for (const word of words) {
    if ((line + " " + word).trim().length > maxChars) {
      lines.push(line.trim());
      line = word;
    } else {
      line += " " + word;
    }
  }

  if (line.trim()) lines.push(line.trim());

  return lines.slice(0, 3);
}

function fontSize(lines) {
  if (lines.length === 1) return 64;
  if (lines.length === 2) return 58;
  return 50;
}

function svg(job, colors) {
  const lines = wrapTitle(job.title);
  const size = fontSize(lines);

  return `
<svg xmlns="http://www.w3.org/2000/svg"
width="${WIDTH}"
height="${HEIGHT}"
viewBox="0 0 ${WIDTH} ${HEIGHT}">

<defs>
<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="${colors[0]}"/>
<stop offset="100%" stop-color="${colors[1]}"/>
</linearGradient>
</defs>

<rect width="100%" height="100%" fill="url(#bg)"/>

<!-- Top Center Logo -->
<image
href="data:image/png;base64,${faviconBase64}"
x="550"
y="30"
width="100"
height="100"/>

${lines
  .map(
    (line, i) => `
<text
x="600"
y="${190 + i * (size + 20)}"
text-anchor="middle"
font-size="${size}"
font-family="Arial"
font-weight="700"
fill="#fff">
${escapeXML(line)}
</text>`
  )
  .join("")}

<!-- Last Date -->
<text
x="600"
y="500"
text-anchor="middle"
font-size="34"
font-family="Arial"
fill="#fde68a">
${escapeXML(job.lastDate || "")}
</text>

<!-- Website -->
<text
x="600"
y="585"
text-anchor="middle"
font-size="32"
font-family="Arial"
font-weight="700"
fill="#ffffff"
opacity=".9">
sarkariresult.rest
</text>

</svg>
`;
}

async function generate() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];

    const outputFile = path.join(
      OUTPUT_DIR,
      `${job.slug}.webp`
    );

    // 👇 Image already exists → Skip
    if (fs.existsSync(outputFile)) {
      console.log(`⏭️ Skipped: ${job.slug}.webp`);
      continue;
    }

    const colors = gradients[i % gradients.length];

    const image = svg(job, colors);

    await sharp(Buffer.from(image))
      .webp({
        quality: 85,
      })
      .toFile(outputFile);

    console.log(`✅ Generated: ${job.slug}.webp`);
  }
}

generate().catch(console.error);