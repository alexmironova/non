/**
 * Срезает светлый фон вокруг арта карты и делает его прозрачным.
 *
 * Своего графического пакета в проекте нет, зато есть puppeteer-core и
 * Chrome — рисуем картинку на canvas и работаем с пикселями там.
 *
 * Почему заливка от краёв, а не обрезка прямоугольником: у карты скруглённые
 * углы, и фон — это не поля сверху и снизу, а рамка в пару пикселей плюс
 * четыре уголка за скруглением. Прямоугольная обрезка уголки не достаёт.
 * Заливка идёт только от границ кадра, поэтому светлые места внутри карты —
 * надпись TINKOFF, чип, логотип МИР — её не интересуют: они с краем не
 * соприкасаются.
 *
 *   node scripts/crop-art.mjs public/image/Skoltech.jpg public/image/card-skoltech.png
 */
import { readFileSync, writeFileSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const SRC = process.argv[2]
const OUT = process.argv[3]
// Фон светлее любого края карты, но темнее самой карты он быть не может.
// 140 — середина между рамкой (≈175) и тёмным пластиком (≈20)
const BG = Number(process.argv[4] ?? 140)

const mime = SRC.endsWith('.png') ? 'image/png' : 'image/jpeg'
const dataUrl = `data:${mime};base64,` + readFileSync(SRC).toString('base64')

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
const page = await browser.newPage()
await page.goto('about:blank')

const result = await page.evaluate(async (src, BG) => {
  const img = new Image()
  img.src = src
  await img.decode()
  const c = document.createElement('canvas')
  c.width = img.naturalWidth
  c.height = img.naturalHeight
  const ctx = c.getContext('2d')
  ctx.drawImage(img, 0, 0)
  const image = ctx.getImageData(0, 0, c.width, c.height)
  const { data, width, height } = image

  const light = (i) => (data[i] + data[i + 1] + data[i + 2]) / 3 >= BG

  // Заливка от всех пикселей границы кадра
  const seen = new Uint8Array(width * height)
  const stack = []
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return
    const n = y * width + x
    if (seen[n]) return
    seen[n] = 1
    if (light(n * 4)) stack.push(n)
  }
  for (let x = 0; x < width; x++) { push(x, 0); push(x, height - 1) }
  for (let y = 0; y < height; y++) { push(0, y); push(width - 1, y) }

  let cut = 0
  while (stack.length) {
    const n = stack.pop()
    data[n * 4 + 3] = 0
    cut++
    const x = n % width
    const y = (n - x) / width
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1)
  }

  // Самый внешний пиксель кадра срезаем целиком. Рамка местами темнее
  // порога (у этого арта попадаются пиксели ≈116), заливка на таком месте
  // останавливается и оставляет светлый штрих вдоль края. Опускать порог
  // нельзя — он подойдёт вплотную к тёмному пластику, а один пиксель по
  // периметру на экране не виден
  for (let x = 0; x < width; x++) {
    data[x * 4 + 3] = 0
    data[((height - 1) * width + x) * 4 + 3] = 0
  }
  for (let y = 0; y < height; y++) {
    data[y * width * 4 + 3] = 0
    data[(y * width + width - 1) * 4 + 3] = 0
  }

  // Полностью прозрачные строки и столбцы по краям больше не нужны
  const clear = (i) => data[i * 4 + 3] === 0
  const rowClear = (y) => { for (let x = 0; x < width; x++) if (!clear(y * width + x)) return false; return true }
  const colClear = (x) => { for (let y = 0; y < height; y++) if (!clear(y * width + x)) return false; return true }
  let top = 0, bottom = height - 1, left = 0, right = width - 1
  while (top < bottom && rowClear(top)) top++
  while (bottom > top && rowClear(bottom)) bottom--
  while (left < right && colClear(left)) left++
  while (right > left && colClear(right)) right--

  ctx.putImageData(image, 0, 0)
  const w = right - left + 1
  const h = bottom - top + 1
  const out = document.createElement('canvas')
  out.width = w
  out.height = h
  out.getContext('2d').drawImage(c, left, top, w, h, 0, 0, w, h)

  return { left, top, w, h, cut, from: `${width}×${height}`, png: out.toDataURL('image/png') }
}, dataUrl, BG)

writeFileSync(OUT, Buffer.from(result.png.split(',')[1], 'base64'))
console.log('было:', result.from, '→ стало:', `${result.w}×${result.h}`)
console.log('прозрачными стали', result.cut, 'пикселей фона')
console.log('пропорции:', (result.w / result.h).toFixed(3), '(у .bank-card 1.586)')
await browser.close()
