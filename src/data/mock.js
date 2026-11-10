import { ledger } from './ledger.js'
import { TODAY, categoryTotals, inMonth, monthKey } from '../lib/period.js'

/**
 * Моковые данные. Бэкенда нет — всё захардкожено здесь,
 * чтобы экраны выглядели как у реального пользователя.
 */

export const user = {
  name: 'Анастасия',
  fullName: 'Анастасия С.',
  initials: 'АС',
  phone: '+7 925 925-65-45',
  plan: 'Premium',
}

/**
 * Продукты на главном экране. `glyph` — символ в цветном кружке (у рублёвых
 * счетов это ₽), иначе берётся `icon`. `chip` — плашка справа, `card4` и
 * `cardTone` — миниатюра пластика под суммой, она есть только у карт.
 * `cover` — арт этой карты: в миниатюре он идёт размытым фоном под номером.
 */
export const accounts = [
  { id: 'black', title: 'Black', sub: 'Дебетовая · 7711', amount: 3558737.15, pic: 'blue', glyph: '₽', chip: '1 248 ₽', card4: '7711', cover: 'image/card-skoltech.png', to: '/card' },
  { id: 'savings', title: 'Накопительный счёт', sub: '19% на остаток', amount: 184000, pic: 'green', glyph: '₽', chip: '19%', to: '/savings' },
  { id: 'platinum', title: 'Platinum', sub: 'Кредитная · 7788', amount: 12300, pic: 'yellow', icon: 'card', chip: 'до 28 нояб.', card4: '7788', cardTone: 'gray', to: '/card/platinum' },
]

/** Логотипы партнёров в карточке «Кэшбэк и бонусы». Картинок нет —
 *  вместо них цветные плашки с инициалами, форма та же. */
export const brands = [
  { id: 1, label: 'ВТ', bg: '#ff2d87', fg: '#ffffff' },
  { id: 2, label: 're', bg: '#0b0b0c', fg: '#ffffff' },
  { id: 3, label: 'O!', bg: '#b6f05a', fg: '#1b4fd8' },
]

/**
 * Избранные получатели в карточке «Перевод по телефону». Поля те же, что
 * у `contacts`: с плитки можно сразу уйти в перевод, и экран подтверждения
 * получит имя, телефон и банк.
 */
export const favContacts = [
  { id: 'mom', initials: 'М', name: 'Мама', fullName: 'Мама', phone: '+7 916 200-10-05', bank: 'Сбербанк', color: 'purple' },
  { id: 'ivan-fav', initials: 'ИК', name: 'Иван', fullName: 'Иван Кузнецов', phone: '+7 912 345-67-89', bank: 'Т-Банк', color: '' },
  { id: 'sasha', initials: 'СВ', name: 'Саша', fullName: 'Саша В.', phone: '+7 925 303-44-12', bank: 'Альфа-Банк', color: 'green' },
]

/** Карты других банков, привязанные для пополнения. */
export const topupCards = [
  { id: 'sber', icon: 'card', color: 'green', title: 'Сбербанк · 4455', sub: 'Visa · Анастасия С.' },
  { id: 'alfa', icon: 'card', color: 'red', title: 'Альфа-Банк · 9012', sub: 'Mastercard · Анастасия С.' },
]

/** Счета на оплату — экран «На оплату», открывается с «Платежей». */
export const bills = [
  {
    id: 1, icon: 'car', color: 'red', title: 'Штраф ГИБДД',
    sub: 'Постановление 18810177240912004821', amount: 1500,
    due: 'Оплатить до 20 ноября', note: 'Скидка 50% действует ещё 6 дней',
  },
]

/** Уже оплаченные — история на том же экране. */
export const billsPaid = [
  { id: 2, icon: 'bolt', color: 'orange', title: 'ЖКХ · Квартира', sub: '7 ноября', amount: 7400 },
  { id: 3, icon: 'gov', color: 'blue', title: 'Налог на имущество', sub: '2 ноября', amount: 3120 },
]

/** Регулярные платежи — экран «Регулярные», открывается с «Платежей». */
export const autopayments = [
  { id: 1, icon: 'mobile', color: 'blue', title: 'МТС · 925 925-65-45', sub: 'Каждое 5 число', value: '650 ₽' },
  { id: 2, icon: 'bolt', color: 'orange', title: 'ЖКХ · Квартира', sub: 'Каждое 10 число', value: '7 400 ₽' },
  { id: 3, icon: 'wifi', color: 'purple', title: 'Интернет · Дом', sub: 'Каждое 12 число', value: '890 ₽' },
]

/** Светлый баннер на экране «Платежи». */
export const promoCard = {
  title: 'Одобрили кредитку',
  text: 'До 1 000 000 ₽ без процентов на 55 дней',
}

/** Светлый баннер под карточками продуктов. */
export const promo = {
  title: '299 000 ₽ за пару кликов',
  text: 'Кредит наличными по паспорту, решение за минуту',
}

/**
 * Сторис — квадратные плитки. `cover` — файл в public/image/.
 * В этих артах подпись и иконка уже вшиты в картинку, поэтому экран их
 * поверх не рисует. `title` остаётся как подпись для скринридера, а `g`
 * и `icon` — запасной вид на случай, если картинка не загрузится.
 */
export const stories = [
  { id: 1, g: 'g6', icon: 'pin', title: 'Найти ближайший банкомат', cover: 'image/atm.png' },
  { id: 2, g: 'g1', icon: 'moon', title: 'Для паузы до 3 000 ₽ на отель', cover: 'image/hotel.png' },
  { id: 3, g: 'g4', icon: 'mic', title: 'Умная запись в Т-Мобайле', cover: 'image/t-mobile-record.png' },
  { id: 4, g: 'g3', icon: 'gift', title: 'Успейте до финала Призограда', cover: 'image/prizograd.png' },
  { id: 5, g: 'g1', icon: 'fire', title: 'Узнать кэшбэк дня', cover: 'image/cashback-day.png' },
  { id: 6, g: 'g4', icon: 'bell', title: 'Оповещения о ваших операциях', cover: 'image/notifications.png' },
]

/** Офферы «Кэшбэк и скидки» — превью на главном, первые 4 из `cashbackOffers`.
 *  `cover` — файл в public/img/offers/. */
export const offers = [
  { id: 1, g: 'g1', cashback: '10%', title: 'Вкусно и точка', sub: 'Фастфуд · рядом', cover: 'img/offers/vkusno-i-tochka.jpg' },
  { id: 2, g: 'g3', cashback: '7%', title: 'Магнит', sub: 'Супермаркеты', cover: 'img/offers/magnit.jpg' },
  { id: 3, g: 'g2', cashback: '5%', title: 'Яндекс Go', sub: 'Такси', cover: 'img/offers/yandex-go.jpg' },
  { id: 4, g: 'g4', cashback: '15%', title: 'Кинопоиск', sub: 'Развлечения', cover: 'img/offers/kinopoisk.jpg' },
]

/** Полный список на экране «Кэшбэк» (`/cashback`) — все текущие акции. */
export const cashbackOffers = [
  ...offers,
  { id: 5, g: 'g1', cashback: '10%', title: 'Surf Coffee', sub: 'Кофейни', cover: 'img/offers/surf-coffee.jpg' },
  { id: 6, g: 'g3', cashback: '7%', title: 'ВкусВилл', sub: 'Продукты', cover: 'img/offers/vkusvill.jpg' },
  { id: 7, g: 'g2', cashback: '15%', title: 'Самокат', sub: 'Доставка', cover: 'img/offers/samokat.jpg' },
  { id: 8, g: 'g5', cashback: '20%', title: 'Lounge SPA', sub: 'Красота', cover: 'img/offers/lounge-spa.jpg' },
]

export const contacts = [
  { id: 'ivan', initials: 'ИК', name: 'Иван', fullName: 'Иван Кузнецов', phone: '+7 912 345-67-89', bank: 'Т-Банк', color: '' },
  { id: 'maria', initials: 'МС', name: 'Мария', fullName: 'Мария Соколова', phone: '+7 903 111-22-33', bank: 'Сбербанк', color: 'blue' },
  { id: 'anton', initials: 'АП', name: 'Антон', fullName: 'Антон Петров', phone: '+7 925 444-55-66', bank: 'Т-Банк', color: 'green' },
  { id: 'elena', initials: 'ЕЛ', name: 'Елена', fullName: 'Елена Лебедева', phone: '+7 916 777-88-99', bank: 'Альфа-Банк', color: 'purple' },
  { id: 'dmitry', initials: 'ДВ', name: 'Дмитрий', fullName: 'Дмитрий Волков', phone: '+7 910 222-33-44', bank: 'Т-Банк', color: 'gray' },
]

/**
 * Операции текущего месяца по счёту Black · 7711 — ноябрь 2026.
 * Берутся из выписки (`ledger.js`), а не описываются отдельно: раньше
 * текущий месяц жил здесь, а архив генерировался — и два источника
 * расходились в суммах.
 */
export const operations = ledger.filter((o) => monthKey(o.ts) === monthKey(TODAY))

/** Операции по карте Platinum — тот же формат, что и `operations`,
 *  отдельный список, чтобы экран карты показывал только свои траты. */
export const platinumOperations = [
  {
    id: 'pop1', day: 'Сегодня', date: '10 ноября, 13:15', ts: '2026-11-10T13:15', title: 'Aeroflot',
    category: 'Путешествия', amount: -18400, cashback: 920, pic: 'blue', initials: 'AF',
    card: 'Platinum · 7788', status: 'Выполнено', mcc: '4511',
  },
  {
    id: 'pop2', day: '9 ноября, понедельник', date: '9 ноября, 20:02', ts: '2026-11-09T20:02', title: 'Ресторан Twins Garden',
    category: 'Кафе и рестораны', amount: -6700, cashback: 335, pic: 'orange', initials: 'TG',
    card: 'Platinum · 7788', status: 'Выполнено', mcc: '5812',
  },
  {
    id: 'pop3', day: '6 ноября, пятница', date: '6 ноября, 17:40', ts: '2026-11-06T17:40', title: 'Четыре Лапы',
    category: 'Зоотовары', amount: -3200, cashback: 64, pic: 'green', initials: 'ЧЛ',
    card: 'Platinum · 7788', status: 'Выполнено', mcc: '5995',
  },
  {
    id: 'pop4', day: '3 ноября, вторник', date: '3 ноября, 12:00', ts: '2026-11-03T12:00', title: 'Погашение задолженности',
    category: 'Платежи', amount: 15000, pic: 'gray', icon: 'wallet',
    card: 'Platinum · 7788', status: 'Выполнено',
  },
]

/** Операции по накопительному счёту — тот же формат, что и `operations`. */
export const savingsOperations = [
  {
    id: 'sop1', day: 'Сегодня', date: '10 ноября, 09:15', ts: '2026-11-10T09:15', title: 'Проценты на остаток',
    category: 'Начисления', amount: 820, pic: 'green', icon: 'pct',
    card: 'Накопительный счёт', status: 'Выполнено',
  },
  {
    id: 'sop2', day: '11 октября, воскресенье', date: '11 октября, 16:26', ts: '2026-10-11T16:26', title: 'Пополнение со счёта Black',
    category: 'Между своими счетами', amount: 164500, pic: 'blue', icon: 'wallet',
    card: 'Накопительный счёт', status: 'Выполнено',
  },
  {
    id: 'sop3', day: '1 ноября, воскресенье', date: '1 ноября, 09:00', ts: '2026-11-01T09:00', title: 'Проценты за октябрь',
    category: 'Начисления', amount: 2940, pic: 'green', icon: 'pct',
    card: 'Накопительный счёт', status: 'Выполнено',
  },
]

/**
 * Полная история по счёту Black: описанный поштучно текущий месяц плюс
 * сгенерированный архив за одиннадцать предыдущих. На этом списке работает
 * выписка (`/statement`) — ей нужен год данных, а не одна неделя.
 */
export const accountOperations = [...ledger].sort((a, b) => (a.ts < b.ts ? 1 : -1))

/**
 * Траты текущего месяца — подпись на карточке «Все операции» на главном.
 * Считаем из операций, а не вписываем числом: раньше здесь стояло 48 230 ₽,
 * и главный экран спорил с выпиской и историей за тот же октябрь.
 */
export const monthSpent = categoryTotals(inMonth(accountOperations, monthKey(TODAY)))
  .reduce((sum, c) => sum + c.amount, 0)

/**
 * Цвет категории на диаграмме. Палитра повторяет семантику из tokens.css —
 * те же оттенки, рассчитанные на тёмный фон. Категории теперь приходят из
 * операций, и их набор зависит от месяца, поэтому цвет берётся по имени,
 * а незнакомой категории достаётся следующий цвет палитры — вместо пустой
 * дырки в кольце.
 */
const PALETTE = ['#FFDD2D', '#428BF9', '#A78BFA', '#30D475', '#FF9F2E', '#8B8B90', '#F2545B']

const CATEGORY_COLOR = {
  'Супермаркеты': '#FFDD2D',
  'Кафе и рестораны': '#428BF9',
  'Такси': '#A78BFA',
  'Маркетплейсы': '#30D475',
  'Мобильная связь': '#FF9F2E',
  'Другое': '#8B8B90',
  'Автомобиль': '#F2545B',
  'Путешествия': '#428BF9',
  'Доставка': '#30D475',
  'Переводы': '#8B8B90',
  'Дом': '#A78BFA',
  'Зарплата': '#30D475',
  'Аванс': '#30D475',
  'Премия': '#FFDD2D',
  'Бонусы': '#FF9F2E',
  'Здоровье': '#F2545B',
  'Техника': '#8B8B90',
  'Возвраты': '#30D475',
}

let spare = 0
const spares = new Map()

export function categoryColors(name) {
  if (CATEGORY_COLOR[name]) return CATEGORY_COLOR[name]
  if (!spares.has(name)) spares.set(name, PALETTE[spare++ % PALETTE.length])
  return spares.get(name)
}

/** Прежний статичный разрез — остался для карточек, которым хватает витрины. */
export const categories = [
  { color: '#FFDD2D', name: 'Супермаркеты', amount: 18400, share: 38, pic: 'green', icon: 'cat' },
  { color: '#428BF9', name: 'Кафе и рестораны', amount: 9850, share: 20, pic: 'orange', initials: 'ВТ' },
  { color: '#A78BFA', name: 'Транспорт', amount: 6210, share: 13, pic: 'blue', icon: 'car' },
  { color: '#30D475', name: 'Маркетплейсы', amount: 5470, share: 11, pic: 'purple', initials: 'OZ' },
  { color: '#FF9F2E', name: 'Связь и интернет', amount: 3100, share: 6, pic: 'blue', icon: 'mobile' },
  { color: '#8B8B90', name: 'Другое', amount: 5200, share: 12, pic: 'gray', icon: 'more' },
]

export const monthsBars = [
  { m: 'июн', h: 52 }, { m: 'июл', h: 64 }, { m: 'авг', h: 46 },
  { m: 'сен', h: 78 }, { m: 'окт', h: 58 }, { m: 'ноя', h: 88, active: true },
]


export const positions = [
  { id: 1, initials: 'SB', pic: 'green', title: 'Сбербанк', sub: '12 акций · 318,40 ₽', amount: 3820.8, delta: '+4,2%', up: true },
  { id: 2, initials: 'LK', pic: 'red', title: 'Лукойл', sub: '2 акции · 7 120 ₽', amount: 14240, delta: '+1,1%', up: true },
  { id: 3, initials: 'YD', pic: 'orange', title: 'Яндекс', sub: '5 акций · 4 180 ₽', amount: 20900, delta: '−0,8%', up: false },
  { id: 4, initials: 'T', pic: 'yellow', title: 'Т-Технологии', sub: '8 акций · 3 240 ₽', amount: 25920, delta: '+6,4%', up: true },
  { id: 5, icon: 'shield', pic: 'blue', title: 'ОФЗ 26238', sub: 'Облигации · 12 шт.', amount: 9860, delta: '+0,3%', up: true },
  { id: 6, icon: 'pct', pic: 'purple', title: 'Вечный портфель', sub: 'Пай · 240 шт.', amount: 21999, delta: '+2,0%', up: true },
]

export const chatMessages = [
  { id: 1, side: 'in', text: 'Здравствуйте, Анастасия! Меня зовут Артём, я помогу с вашим вопросом.', time: '14:28' },
  { id: 2, side: 'out', text: 'Привет! Не пришёл кэшбэк за сентябрь', time: '14:29' },
  { id: 3, side: 'in', text: 'Проверяю… Кэшбэк 1 980 ₽ начислен 5 ноября на карту Black · 7711.', time: '14:30' },
  { id: 4, side: 'card' },
  { id: 5, side: 'in', text: 'Видите эту операцию в истории? Могу выслать выписку в PDF.', time: '14:31' },
]
