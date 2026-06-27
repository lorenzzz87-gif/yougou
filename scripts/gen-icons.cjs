const sharp = require('sharp')
const path = require('path')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#F97316"/>
  <circle cx="256" cy="256" r="206" fill="none" stroke="#ffffff" stroke-width="8" opacity="0.85"/>
  <text x="256" y="306" font-family="Georgia, 'Times New Roman', serif" font-size="140" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="-5">Yigo</text>
</svg>`

const root = path.join(__dirname, '..')
const buf = Buffer.from(svg)

async function gen(size, outPath) {
  await sharp(buf).resize(size, size).png().toFile(outPath)
  console.log('✓', outPath, size + 'x' + size)
}

;(async () => {
  await gen(180, path.join(root, 'app', 'apple-icon.png'))
  await gen(512, path.join(root, 'app', 'icon.png'))
  await gen(192, path.join(root, 'public', 'icon-192.png'))
  await gen(512, path.join(root, 'public', 'icon-512.png'))
})()
