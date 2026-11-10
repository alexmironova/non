import { user } from './mock.js'

/**
 * Разделы вкладки «Профиль». Все девять устроены одинаково — заголовок и
 * списки строк, — поэтому описаны данными и рисуются одним экраном
 * `MoreSection`, а не девятью почти одинаковыми файлами.
 *
 * Тип строки: 'nav' — шеврон и переход, 'switch' — тумблер,
 * без типа — просто значение справа, строка не нажимается.
 */
export const moreSections = {
  profile: {
    title: 'Личные данные',
    groups: [
      {
        rows: [
          { icon: 'user', color: 'yellow', title: 'Имя', value: user.fullName },
          { icon: 'phone', color: 'blue', title: 'Телефон', value: user.phone },
          { icon: 'star', color: 'purple', title: 'Тариф', value: user.plan },
        ],
      },
      {
        label: 'Документы и контакты',
        rows: [
          { icon: 'doc', color: 'gray', title: 'Паспортные данные', sub: 'Проверены 12 марта', type: 'nav' },
          { icon: 'send', color: 'gray', title: 'Электронная почта', sub: 'nastya@example.com', type: 'nav' },
          { icon: 'pin', color: 'gray', title: 'Адрес доставки', sub: 'Москва, Тверская, 1', type: 'nav' },
        ],
      },
    ],
    note: 'Данные нужны для выпуска карт и отчётности перед регулятором.',
  },

  settings: {
    title: 'Настройки',
    groups: [
      {
        rows: [
          { icon: 'chat', color: 'blue', title: 'Язык', value: 'Русский', type: 'nav' },
          { icon: 'wallet', color: 'green', title: 'Валюта отображения', value: '₽', type: 'nav' },
          { icon: 'eye', color: 'gray', title: 'Скрывать суммы при запуске', type: 'switch' },
        ],
      },
      {
        label: 'Данные',
        rows: [
          { icon: 'repeat', color: 'gray', title: 'Синхронизация', sub: 'Последняя — сегодня, 13:40', type: 'nav' },
          { icon: 'snow', color: 'gray', title: 'Очистить кэш', sub: '42 МБ', type: 'nav' },
        ],
      },
    ],
  },

  bonuses: {
    title: 'Бонусы и кэшбэк',
    hero: { value: '1 248 ₽', caption: 'Кэшбэк за октябрь · начислим 5 ноября' },
    groups: [
      {
        label: 'Категории месяца',
        rows: [
          { icon: 'cat', color: 'green', title: 'Супермаркеты', sub: '5%', value: '612 ₽' },
          { icon: 'car', color: 'blue', title: 'Такси', sub: '5%', value: '389 ₽' },
          { icon: 'fire', color: 'orange', title: 'Кафе и рестораны', sub: '10%', value: '247 ₽' },
        ],
      },
      {
        rows: [
          { icon: 'gift', color: 'yellow', title: 'Выбрать категории на ноябрь', sub: 'До 31 октября', type: 'nav' },
          { icon: 'star', color: 'purple', title: 'История начислений', type: 'nav' },
        ],
      },
    ],
  },

  statements: {
    title: 'Справки и выписки',
    groups: [
      {
        rows: [
          { icon: 'doc', color: 'blue', title: 'Выписка по счёту', sub: 'Месяц, 3 месяца, полгода, год', type: 'nav', to: '/statement' },
          { icon: 'chart', color: 'green', title: 'Справка о доходах', sub: '2-НДФЛ за 2025 год', type: 'nav' },
          { icon: 'wallet', color: 'purple', title: 'Справка об остатке', sub: 'На сегодняшнюю дату', type: 'nav' },
          { icon: 'card', color: 'gray', title: 'Реквизиты счёта', sub: 'Для перевода из другого банка', type: 'nav' },
        ],
      },
    ],
    note: 'Документы приходят на почту в течение пары минут.',
  },

  security: {
    title: 'Код доступа и Face ID',
    groups: [
      {
        rows: [
          { icon: 'lock', color: 'green', title: 'Код доступа', type: 'switch', on: true },
          { icon: 'faceid', color: 'blue', title: 'Вход по Face ID', type: 'switch', on: true },
          { icon: 'eye', color: 'gray', title: 'Скрывать баланс на главном', type: 'switch' },
        ],
      },
      {
        rows: [
          { icon: 'backspace', color: 'gray', title: 'Сменить код доступа', type: 'nav' },
          { icon: 'mobile', color: 'gray', title: 'Активные сеансы', sub: '2 устройства', type: 'nav' },
        ],
      },
    ],
    note: 'Без кода доступа приложение будет запрашивать пароль при каждом запуске.',
  },

  limits: {
    title: 'Лимиты и ограничения',
    groups: [
      {
        label: 'В сутки',
        rows: [
          { icon: 'up', color: 'yellow', title: 'Переводы', value: '300 000 ₽' },
          { icon: 'wallet', color: 'green', title: 'Снятие наличных', value: '150 000 ₽' },
          { icon: 'wifi', color: 'blue', title: 'Оплата в интернете', value: '100 000 ₽' },
        ],
      },
      {
        rows: [
          { icon: 'shield', color: 'red', title: 'Изменить лимиты', sub: 'Подтверждение по SMS', type: 'nav' },
          { icon: 'snow', color: 'gray', title: 'Заморозить карту', sub: 'Операции отключатся сразу', type: 'nav' },
        ],
      },
    ],
  },

  notifications: {
    title: 'Уведомления',
    groups: [
      {
        label: 'Каналы',
        rows: [
          { icon: 'bell', color: 'orange', title: 'Push', type: 'switch', on: true },
          { icon: 'mobile', color: 'blue', title: 'SMS', sub: '59 ₽ в месяц', type: 'switch' },
          { icon: 'send', color: 'gray', title: 'E-mail', type: 'switch', on: true },
        ],
      },
      {
        label: 'О чём сообщать',
        rows: [
          { icon: 'card', color: 'gray', title: 'Операции по карте', type: 'switch', on: true },
          { icon: 'pct', color: 'gray', title: 'Начисление кэшбэка', type: 'switch', on: true },
          { icon: 'gift', color: 'gray', title: 'Новости и предложения', type: 'switch' },
        ],
      },
    ],
  },

  layout: {
    title: 'Главный экран',
    groups: [
      {
        label: 'Что показывать',
        rows: [
          { icon: 'star', color: 'purple', title: 'Сторис', type: 'switch', on: true },
          { icon: 'chart', color: 'green', title: 'Все операции', type: 'switch', on: true },
          { icon: 'gift', color: 'yellow', title: 'Кэшбэк и бонусы', type: 'switch', on: true },
          { icon: 'bolt', color: 'blue', title: 'Быстрые действия', type: 'switch', on: true },
        ],
      },
      {
        rows: [
          { icon: 'cat', color: 'gray', title: 'Порядок продуктов', sub: 'Перетащите, чтобы изменить', type: 'nav' },
        ],
      },
    ],
  },

  legal: {
    title: 'Правовые документы',
    groups: [
      {
        rows: [
          { icon: 'doc', color: 'gray', title: 'Условия обслуживания', type: 'mail', plural: true },
          { icon: 'shield', color: 'gray', title: 'Политика конфиденциальности', type: 'mail' },
          { icon: 'pct', color: 'gray', title: 'Тарифы', type: 'mail', plural: true },
          { icon: 'gov', color: 'gray', title: 'Лицензия Банка России', sub: '№ 2673 от 24 марта 2015', type: 'mail' },
        ],
      },
    ],
    note: 'Документы присылаем на почту — как выписку по счёту. Прототип учебный, документы не настоящие.',
  },
}
