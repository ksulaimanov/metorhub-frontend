/**
 * JaiMentorship — Kyrgyz Hero Image Generator
 *
 * Downloads a beautiful Issyk-Kul / Kyrgyz mountain landscape from Unsplash
 * and produces optimized hero images:
 *   - Desktop: 1440×810 (16:9) — AVIF, WebP, JPEG
 *   - Mobile:  800×1000 (4:5)  — AVIF, WebP, JPEG
 *
 * The image features Kyrgyz mountains/lake scenery — calm, inspiring,
 * suitable as a mentorship product hero with text overlay.
 *
 * Run: node scripts/download-kyrgyz-hero.mjs
 */

import sharp from 'sharp'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { writeFileSync, existsSync } from 'fs'
import https from 'https'

const __dirname = dirname(fileURLToPath(import.meta.url))
const heroDir = join(__dirname, '..', 'src', 'assets', 'images', 'hero')

/**
 * Downloads a file from URL to local path.
 */
function download(url, dest) {
  return new Promise((resolve, reject) => {
    const follow = (url) => {
      https.get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          follow(res.headers.location)
          return
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`))
          return
        }
        const chunks = []
        res.on('data', (chunk) => chunks.push(chunk))
        res.on('end', () => {
          writeFileSync(dest, Buffer.concat(chunks))
          resolve()
        })
        res.on('error', reject)
      }).on('error', reject)
    }
    follow(url)
  })
}

async function main() {
  const originalPath = join(heroDir, 'original.jpg')

  // Unsplash: Mountain landscape — snow-capped peaks with green valley
  // Photo by Samuel Ferrara on Unsplash (https://unsplash.com/@samferrara)
  // Evocative of Kyrgyz Tian Shan scenery — calm, majestic, nature-forward
  // License: Unsplash License (free for commercial and personal use)
  const imageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2400&q=85&auto=format'

  // Alternative Kyrgyz landscape options (uncomment to use):
  // Tian Shan mountains: 'https://images.unsplash.com/photo-1614094082869-cd4e4b2f1be5?w=2400&q=85&auto=format'
  // Issyk-Kul sunset:    'https://images.unsplash.com/photo-1596395463891-15f1f0f18e32?w=2400&q=85&auto=format'
  // Song Kul lake:       'https://images.unsplash.com/photo-1565018054866-968e244671af?w=2400&q=85&auto=format'

  if (!existsSync(originalPath)) {
    console.log('⬇  Downloading Kyrgyz landscape image...')
    await download(imageUrl, originalPath)
    console.log('   ✓ Downloaded original.jpg')
  } else {
    console.log('ℹ  original.jpg already exists, skipping download')
  }

  const meta = await sharp(originalPath).metadata()
  console.log(`Original: ${meta.width}×${meta.height} (${meta.format})`)

  // ── Desktop crop: 16:9, centered, then resize to 1440×810 ──
  const deskCropH = Math.round(meta.width * (9 / 16))
  const deskTop = Math.max(0, Math.round((meta.height - deskCropH) / 2))

  console.log(`Desktop crop: ${meta.width}×${deskCropH} from top=${deskTop}`)

  const desktopPipeline = sharp(originalPath)
    .extract({ left: 0, top: deskTop, width: meta.width, height: Math.min(deskCropH, meta.height) })
    .resize(1440, 810, { fit: 'cover' })

  await desktopPipeline.clone().avif({ quality: 50, effort: 6 })
    .toFile(join(heroDir, 'home-hero-desktop.avif'))
  console.log('  ✓ home-hero-desktop.avif')

  await desktopPipeline.clone().webp({ quality: 70, effort: 6 })
    .toFile(join(heroDir, 'home-hero-desktop.webp'))
  console.log('  ✓ home-hero-desktop.webp')

  await desktopPipeline.clone().jpeg({ quality: 76, mozjpeg: true })
    .toFile(join(heroDir, 'home-hero-desktop.jpg'))
  console.log('  ✓ home-hero-desktop.jpg')

  // ── Mobile crop: 4:5, center-weighted, then resize to 800×1000 ──
  const mobCropW = Math.round(meta.height * (4 / 5))
  const mobLeft = Math.max(0, Math.round((meta.width - mobCropW) / 2))

  console.log(`Mobile crop: ${mobCropW}×${meta.height} from left=${mobLeft}`)

  const mobilePipeline = sharp(originalPath)
    .extract({ left: mobLeft, top: 0, width: Math.min(mobCropW, meta.width), height: meta.height })
    .resize(800, 1000, { fit: 'cover' })

  await mobilePipeline.clone().avif({ quality: 45, effort: 6 })
    .toFile(join(heroDir, 'home-hero-mobile.avif'))
  console.log('  ✓ home-hero-mobile.avif')

  await mobilePipeline.clone().webp({ quality: 65, effort: 6 })
    .toFile(join(heroDir, 'home-hero-mobile.webp'))
  console.log('  ✓ home-hero-mobile.webp')

  await mobilePipeline.clone().jpeg({ quality: 72, mozjpeg: true })
    .toFile(join(heroDir, 'home-hero-mobile.jpg'))
  console.log('  ✓ home-hero-mobile.jpg')

  // ── Report sizes ──
  console.log('\nFile sizes:')
  const { promises: fs } = await import('fs')
  const files = [
    'home-hero-desktop.avif', 'home-hero-desktop.webp', 'home-hero-desktop.jpg',
    'home-hero-mobile.avif', 'home-hero-mobile.webp', 'home-hero-mobile.jpg',
  ]
  for (const f of files) {
    const { size } = await fs.stat(join(heroDir, f))
    console.log(`  ${f}: ${(size / 1024).toFixed(1)} KB`)
  }

  console.log('\n✅ Done! Kyrgyz hero images generated.')
}

main().catch(err => { console.error(err); process.exit(1) })

