import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");

const width = 1080;
const height = 1350;

const paths = {
  background: path.join(projectRoot, "public/social/katty-review-post-background-v1.png"),
  faben: path.join(projectRoot, "public/reviews/faben-henok-client-photo.webp"),
  marimar: path.join(projectRoot, "public/reviews/marimar-montero-client-photo.webp"),
  logo: path.join(projectRoot, "public/brand/katty-official-lockup.png"),
  qrSource: path.join(projectRoot, "public/social/katty-google-review-qr-source.jpg"),
  output: path.join(projectRoot, "public/social/katty-google-review-post-v1.png"),
};

const colors = {
  brass: "#c19365",
  blush: "#f4c8d0",
  cream: "#fffdfd",
  ink: "#331b26",
  inkSoft: "#6b5360",
  line: "#dbc2ca",
  oxblood: "#591333",
  paper: "#fffefd",
  rose: "#eda2ae",
  wine: "#7b1f42",
};

function roundedMask(maskWidth, maskHeight, radius) {
  return Buffer.from(`
    <svg width="${maskWidth}" height="${maskHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${maskWidth}" height="${maskHeight}" rx="${radius}" fill="#fff"/>
    </svg>
  `);
}

async function roundedPhoto(input, photoWidth, photoHeight, radius, position) {
  const resized = await sharp(input)
    .resize(photoWidth, photoHeight, { fit: "cover", position })
    .png()
    .toBuffer();

  return sharp(resized)
    .composite([{ input: roundedMask(photoWidth, photoHeight, radius), blend: "dest-in" }])
    .png()
    .toBuffer();
}

const background = await sharp(paths.background)
  .resize(width, height, { fit: "cover" })
  .modulate({ brightness: 1.015, saturation: 0.92 })
  .png()
  .toBuffer();

const [faben, marimar, logo, qr] = await Promise.all([
  roundedPhoto(paths.faben, 456, 278, 22, "center"),
  roundedPhoto(paths.marimar, 456, 278, 22, "centre"),
  sharp(paths.logo).resize({ width: 184, withoutEnlargement: true }).png().toBuffer(),
  sharp(paths.qrSource)
    .extract({ left: 98, top: 342, width: 590, height: 590 })
    .greyscale()
    .threshold(170)
    .resize(324, 324, { kernel: sharp.kernel.nearest })
    .png()
    .toBuffer(),
]);

const layout = Buffer.from(`
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="#591333" flood-opacity="0.12"/>
      </filter>
      <linearGradient id="reviewBand" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#591333"/>
        <stop offset="1" stop-color="#7b1f42"/>
      </linearGradient>
    </defs>

    <rect x="44" y="36" width="992" height="190" rx="30" fill="#fffefd" fill-opacity="0.88" stroke="#ffffff" stroke-opacity="0.82"/>
    <line x1="264" y1="72" x2="264" y2="190" stroke="${colors.brass}" stroke-opacity="0.72"/>
    <text x="304" y="78" fill="${colors.wine}" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="700" letter-spacing="3.2">LOVE YOUR LOOK?</text>
    <text x="304" y="134" fill="${colors.oxblood}" font-family="Georgia, 'Times New Roman', serif" font-size="52" font-weight="700" letter-spacing="-1.4">Share the result.</text>
    <text x="304" y="174" fill="${colors.inkSoft}" font-family="Arial, Helvetica, sans-serif" font-size="20">Your photo + honest review help Brentwood &amp; the DMV find Katty.</text>

    <rect x="58" y="242" width="464" height="286" rx="25" fill="#fff" filter="url(#shadow)"/>
    <rect x="558" y="242" width="464" height="286" rx="25" fill="#fff" filter="url(#shadow)"/>
    <rect x="62" y="246" width="456" height="278" rx="22" fill="none" stroke="#fff" stroke-width="3"/>
    <rect x="562" y="246" width="456" height="278" rx="22" fill="none" stroke="#fff" stroke-width="3"/>
    <rect x="80" y="472" width="173" height="34" rx="17" fill="#591333" fill-opacity="0.9"/>
    <text x="166.5" y="495" text-anchor="middle" fill="#fffefd" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" letter-spacing="1.5">REAL CLIENT RESULT</text>
    <rect x="580" y="472" width="173" height="34" rx="17" fill="#591333" fill-opacity="0.9"/>
    <text x="666.5" y="495" text-anchor="middle" fill="#fffefd" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" letter-spacing="1.5">REAL CLIENT RESULT</text>

    <rect x="44" y="550" width="992" height="486" rx="34" fill="#fffefd" fill-opacity="0.94" stroke="${colors.line}" stroke-width="1.5" filter="url(#shadow)"/>
    <text x="90" y="606" fill="${colors.wine}" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="700" letter-spacing="3.2">TWO QUICK STEPS</text>

    <circle cx="116" cy="671" r="29" fill="${colors.wine}"/>
    <text x="116" y="679" text-anchor="middle" fill="${colors.paper}" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="700">01</text>
    <text x="164" y="660" fill="${colors.oxblood}" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="800">TAKE A PHOTO</text>
    <text x="164" y="690" fill="${colors.inkSoft}" font-family="Arial, Helvetica, sans-serif" font-size="18">Capture your fresh finish</text>
    <text x="164" y="716" fill="${colors.inkSoft}" font-family="Arial, Helvetica, sans-serif" font-size="18">before you go.</text>

    <line x1="116" y1="712" x2="116" y2="757" stroke="${colors.brass}" stroke-width="2" stroke-dasharray="5 8"/>
    <circle cx="116" cy="801" r="29" fill="${colors.wine}"/>
    <text x="116" y="809" text-anchor="middle" fill="${colors.paper}" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="700">02</text>
    <text x="164" y="790" fill="${colors.oxblood}" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="800">SCAN &amp; SHARE</text>
    <text x="164" y="820" fill="${colors.inkSoft}" font-family="Arial, Helvetica, sans-serif" font-size="18">Tell us what we did, what you loved,</text>
    <text x="164" y="846" fill="${colors.inkSoft}" font-family="Arial, Helvetica, sans-serif" font-size="18">and why Katty stands out in Brentwood</text>
    <text x="164" y="872" fill="${colors.inkSoft}" font-family="Arial, Helvetica, sans-serif" font-size="18">and across the DMV.</text>

    <rect x="88" y="914" width="470" height="80" rx="18" fill="${colors.blush}" fill-opacity="0.45"/>
    <text x="116" y="946" fill="${colors.wine}" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-style="italic">“Your experience could help someone</text>
    <text x="116" y="975" fill="${colors.wine}" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-style="italic">find their new stylist.”</text>

    <rect x="629" y="586" width="360" height="414" rx="28" fill="#ffffff" stroke="${colors.blush}" stroke-width="3"/>
    <text x="809" y="626" text-anchor="middle" fill="${colors.wine}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" letter-spacing="2.3">SCAN TO REVIEW</text>
    <rect x="647" y="644" width="324" height="324" rx="12" fill="#fff"/>
    <text x="809" y="988" text-anchor="middle" fill="${colors.inkSoft}" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" letter-spacing="1.2">GOOGLE REVIEW</text>

    <rect x="44" y="1060" width="992" height="246" rx="32" fill="url(#reviewBand)" filter="url(#shadow)"/>
    <text x="86" y="1104" fill="${colors.brass}" font-family="Arial, Helvetica, sans-serif" font-size="24" letter-spacing="3">★★★★★</text>
    <text x="86" y="1142" fill="${colors.paper}" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-style="italic">“I always leave feeling confident,</text>
    <text x="86" y="1172" fill="${colors.paper}" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-style="italic">refreshed, and taken care of.”</text>
    <text x="86" y="1214" fill="${colors.blush}" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700">FABEN HENOK</text>
    <text x="86" y="1238" fill="#f7dde4" font-family="Arial, Helvetica, sans-serif" font-size="14">10-year client · Google review</text>

    <line x1="540" y1="1098" x2="540" y2="1266" stroke="#ffffff" stroke-opacity="0.22"/>

    <text x="584" y="1104" fill="${colors.brass}" font-family="Arial, Helvetica, sans-serif" font-size="24" letter-spacing="3">★★★★★</text>
    <text x="584" y="1142" fill="${colors.paper}" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-style="italic">“I walked out feeling confident,</text>
    <text x="584" y="1172" fill="${colors.paper}" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-style="italic">refreshed, and truly cared for.”</text>
    <text x="584" y="1214" fill="${colors.blush}" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700">MARIMAR MONTERO</text>
    <text x="584" y="1238" fill="#f7dde4" font-family="Arial, Helvetica, sans-serif" font-size="14">Cut + styling · Google review</text>

    <text x="540" y="1330" text-anchor="middle" fill="${colors.wine}" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" letter-spacing="2">KATTY HAIR STUDIO · BRENTWOOD, MARYLAND</text>
  </svg>
`);

await sharp(background)
  .composite([
    { input: layout, top: 0, left: 0 },
    { input: logo, top: 55, left: 77 },
    { input: faben, top: 246, left: 62 },
    { input: marimar, top: 246, left: 562 },
    { input: qr, top: 644, left: 647 },
  ])
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(paths.output);

console.log(paths.output);
