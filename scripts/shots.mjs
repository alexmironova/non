/**
 * Скриншоты экранов в настоящей эмуляции iPhone 15.
 * Нужен, потому что headless Chrome не даёт окно уже 500px —
 * без эмуляции устройства главный брейкпоинт проверить нельзя.
 *
 *   node scripts/shots.mjs [baseUrl] [outDir]
 */
import { mkdir } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE = process.argv[2] ?? 'http://localhost:4173'
const OUT = process.argv[3] ?? 'screenshots'

// iPhone 15: 393 × 852 CSS px, DPR 3
const IPHONE_15 = {
  width: 393,
  height: 852,
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
}

const ROUTES = [
  'login', 'pin', 'home', 'card', 'card/platinum', 'savings', 'operation/op1', 'analytics',
  'statement', 'payments', 'transfer', 'transfer/confirm', 'transfer/success',
  'cashback', 'invest', 'chat', 'more',
]

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--hide-scrollbars'],
})

await mkdir(OUT, { recursive: true })
const page = await browser.newPage()
await page.setViewport(IPHONE_15)

let overflow = 0
for (const route of ROUTES) {
  const hash = route === 'login' ? '/' : `/${route}`
  await page.goto(`${BASE}/#${hash}`, { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 250))

  // Горизонтальный скролл в мобильном макете — всегда ошибка вёрстки
  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }))
  const bad = scrollWidth > innerWidth
  if (bad) overflow++

  const name = route.replace(/\//g, '-')
  await page.screenshot({ path: `${OUT}/${name}.png` })
  console.log(
    `${bad ? '✗' : '✓'} ${name.padEnd(18)} ${innerWidth}px` +
      (bad ? ` → выезжает до ${scrollWidth}px` : '')
  )
}

await browser.close()
console.log(
  overflow ? `\nЭкранов с горизонтальным выездом: ${overflow}` : '\nГоризонтального выезда нет.'
)
