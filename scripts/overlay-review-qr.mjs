import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const basePath = path.join(
  projectRoot,
  "public/social/katty-google-review-post-imagegen-base-v2.png",
);
const qrSourcePath = path.join(
  projectRoot,
  "public/social/katty-google-review-qr-source.jpg",
);
const outputPath = path.join(
  projectRoot,
  "public/social/katty-google-review-post-imagegen-v2.png",
);

// Crop only the supplied QR artwork, clean the JPEG edge noise, and preserve
// the encoded module pattern with nearest-neighbor scaling.
const qr = await sharp(qrSourcePath)
  .extract({ left: 98, top: 342, width: 590, height: 590 })
  .greyscale()
  .threshold(170)
  .resize(400, 400, { kernel: sharp.kernel.nearest })
  .png()
  .toBuffer();

// The poster itself is entirely ImageGen output. The QR is the only overlay.
await sharp(basePath)
  .composite([{ input: qr, left: 531, top: 820 }])
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(outputPath);

console.log(outputPath);
