/**
 * JaiMentorship Hero Image Processor
 *
 * Takes the original Unsplash download and produces:
 *   - Desktop: 1440×810 (16:9) — AVIF, WebP, JPEG
 *   - Mobile:  800×1000 (4:5)  — AVIF, WebP, JPEG
 *
 * Run: node scripts/process-hero-image.mjs
 */

import sharp from 'sharp'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const heroDir = join(__dirname, '..', 'src', 'assets', 'images', 'hero')
const src = join(heroDir, 'original.jpg')

async function main() {
  const meta = await sharp(src).metadata()
  console.log(`Original: ${meta.width}×${meta.height} (${meta.format})`)

  // ── Desktop crop: 16:9, centered, then resize to 1440×810 ──
  // From 1920×1280: target aspect 16:9 → full width, height = 1920*(9/16) = 1080
  const deskCropH = Math.round(meta.width * (9 / 16))
  const deskTop = Math.round((meta.height - deskCropH) / 2)

  console.log(`Desktop crop: ${meta.width}×${deskCropH} from top=${deskTop}`)

  const desktopPipeline = sharp(src)
    .extract({ left: 0, top: deskTop, width: meta.width, height: deskCropH })
    .resize(1440, 810, { fit: 'fill' })

  // Clone the pipeline for each format
  await desktopPipeline.clone().avif({ quality: 55, effort: 6 })
    .toFile(join(heroDir, 'home-hero-desktop.avif'))
  console.log('  ✓ home-hero-desktop.avif')

  await desktopPipeline.clone().webp({ quality: 72, effort: 6 })
    .toFile(join(heroDir, 'home-hero-desktop.webp'))
  console.log('  ✓ home-hero-desktop.webp')

  await desktopPipeline.clone().jpeg({ quality: 78, mozjpeg: true })
    .toFile(join(heroDir, 'home-hero-desktop.jpg'))
  console.log('  ✓ home-hero-desktop.jpg')

  // ── Mobile crop: 4:5, center-weighted, then resize to 800×1000 ──
  // From 1920×1280: target aspect 4:5 → height = 1280, width = 1280*(4/5) = 1024
  const mobCropW = Math.round(meta.height * (4 / 5))
  const mobLeft = Math.round((meta.width - mobCropW) / 2)

  console.log(`Mobile crop: ${mobCropW}×${meta.height} from left=${mobLeft}`)

  const mobilePipeline = sharp(src)
    .extract({ left: mobLeft, top: 0, width: mobCropW, height: meta.height })
    .resize(800, 1000, { fit: 'fill' })

  await mobilePipeline.clone().avif({ quality: 50, effort: 6 })
    .toFile(join(heroDir, 'home-hero-mobile.avif'))
  console.log('  ✓ home-hero-mobile.avif')

  await mobilePipeline.clone().webp({ quality: 68, effort: 6 })
    .toFile(join(heroDir, 'home-hero-mobile.webp'))
  console.log('  ✓ home-hero-mobile.webp')

  await mobilePipeline.clone().jpeg({ quality: 75, mozjpeg: true })
    .toFile(join(heroDir, 'home-hero-mobile.jpg'))
  console.log('  ✓ home-hero-mobile.jpg')

  // ── Report sizes ──
  console.log('\nFile sizes:')
  const files = [
    'home-hero-desktop.avif', 'home-hero-desktop.webp', 'home-hero-desktop.jpg',
    'home-hero-mobile.avif', 'home-hero-mobile.webp', 'home-hero-mobile.jpg',
  ]
  for (const f of files) {
    const { size } = await sharp(join(heroDir, f)).metadata().then(() =>
      import('fs').then(fs => fs.promises.stat(join(heroDir, f)))
    )
    console.log(`  ${f}: ${(size / 1024).toFixed(1)} KB`)
  }
}

main().catch(err => { console.error(err); process.exit(1) })

