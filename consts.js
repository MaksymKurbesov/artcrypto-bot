export const languageKeyboard = (ctx) => {
  return [
    [
      {
        text: "RU 🇷🇺",
        callback_data: "language_ru",
      },
      {
        text: "EN 🇬🇧",
        callback_data: "language_en",
      },
      {
        text: "DE 🇩🇪",
        callback_data: "language_de",
      },
    ],
    [{ text: `${ctx.t("main_menu")} 🏠`, callback_data: "main_page" }],
  ];
};

export const startInlineKeyboard = (userId, ctx) => {
  console.log(ctx.from, "ctx.from.language_code");
  return [
    [{ text: `₿ ${ctx.t("get_bitcoin")}`, callback_data: "gamezone" }],
    [
      { text: `💳 ${ctx.t("my_wallets")}`, callback_data: "user_wallets" },
      { text: `💸 ${ctx.t("withdraw")}`, callback_data: "withdraw" },
    ],
    [
      { text: `📝 ${ctx.t("tasks")}`, callback_data: "tasks_page" },
      {
        text: `👥 ${ctx.t("invite_friends")}`,
        url: `https://t.me/share/url?text=Invite%20your%20friends&url=https://t.me/cryptoapatebot/?start=${userId}`,
      },
    ],
    [
      { text: `🌍 ${ctx.t("language")}`, callback_data: "language" },
      { text: "🆘 Support", callback_data: "6" },
    ],
  ];
};

export const walletsInlineKeyboard = (ctx) => {
  return [
    [
      {
        text: `${ctx.t("change")} Bitcoin ✏️`,
        callback_data: "start_change_wallet_bitcoin",
      },
    ],
    [
      {
        text: `${ctx.t("change")} TON ✏️`,
        callback_data: "start_change_wallet_ton",
      },
    ],
    [
      {
        text: `${ctx.t("change")} TRC20 ✏️`,
        callback_data: "start_change_wallet_trc20",
      },
    ],
    [{ text: `${ctx.t("main_menu")} 🏠`, callback_data: "main_page" }],
  ];
};

export const withdrawKeyboard = (ctx) => {
  return [
    [
      {
        text: `${ctx.t("withdrawal")} Bitcoin`,
        callback_data: "withdraw_bitcoin",
      },
    ],
    [
      {
        text: `${ctx.t("withdrawal")} TON`,
        callback_data: "withdraw_ton",
      },
    ],
    [
      {
        text: `${ctx.t("withdrawal")} TRC20`,
        callback_data: "withdraw_trc20",
      },
    ],
    [{ text: `${ctx.t("main_menu")} 🏠`, callback_data: "main_page" }],
  ];
};

export const startCaption = (balance) => {
  return `<b>CRYPTO APATE BOT -> Главное меню</b>\n\nТы: <b>#SWK58XOH</b>\nБаланс: <b>${balance}$</b>\nВыведено: <b>0$</b>\nМесто в топе: <b>Нет</b>\n\n <a href="https://t.me/+h9EN6YjY--05YjEy">💬 <b>Чат</b></a>`;
};

export const miningGameCaption = `<b>CRYPTO APATE BOT -> Получить BTC</b>\n\n<b>Краткое описание процесса майнинга:\n</b><code>Это процесс решения сложных математических задач с использованием криптографического алгоритма SHA-256. Майнеры проверяют транзакции и создают новые блоки для блокчейна, подбирая уникальный хеш.</code>\n\n<b>Почему за это можно получить биткоин:</b>\n<code>За успешное добавление блока в блокчейн майнеры получают биткоины. Это стимулирует участников сети поддерживать ее работу и безопасность.</code>`;
export const dartsGameCaption = `<b>CRYPTO APATE BOT -> Получить BTC\n\n</b><b>🎯 Добро пожаловать в Дартс!</b>
Проверь свою меткость и зарабатывай <b>BTC!</b>\nПопадай в цель и получай <b>0.0001</b> биткоина за каждый успешный бросок.\n\n<i>Игра доступна раз в сутки, так что сосредоточься и забирай свою награду!</i>
Готов метнуть дротик и выиграть? Попробуй прямо сейчас!`;

export const gameZoneCaption = `<b>CRYPTO APATE BOT -> Получить BTC</b>\n\n<b>Добро пожаловать в зону игр! 🎮</b>\n
Выбирай одну из увлекательных мини-игр и зарабатывай <b>BTC</b> прямо сейчас:
⛏️ <b>Майнинг</b> – отправляйся на виртуальные шахты и добывай биткоины!
🎯 <b>Дартс</b> – меткость решает! Попади в цель и получи награду.
🏀 <b>Баскетбол</b> – бросай мяч в кольцо и выигрывай биткоины.\n
<i>Каждая игра – это шанс приумножить свой криптокапитал!\n\n<b>В каждую из игр можно сыграть один раз в сутки!</b>\n\nВыбирай свою любимую игру и начинай зарабатывать</i> <b>BTC</b>!`;

export const withdrawCaption = `<b>CRYPTO APATE BOT -> Вывод</b>\n\n<b>💼 Вывод средств</b>\n\nЗдесь вы можете вывести заработанные BTC на указанный вами кошелек. Убедитесь, что ваш баланс достаточен для вывода, и проверьте правильность введенных данных.\n\nМинимальная сумма для вывода: <b>50$</b>.\n\n<i>Вывод средств может занять некоторое время в зависимости от загрузки сети.</i>`;

export const languageCaption = `<b>CRYPTO APATE BOT -> Выбор языка</b>\n\nВыберите язык для удобного использования бота.\n\nВаш выбор будет применен ко всем разделам и меню, чтобы вам было проще взаимодействовать с сервисом.`;

export const progressMessages = [
  "Инициализация майнингового процесса",
  "Запуск криптографического алгоритма SHA-256 для поиска подходящего хеша",
  "Установка соединения с распределенной сетью узлов",
  // "Сбор данных транзакций для формирования нового блока",
  // "Проверка целостности данных и верификация транзакций",
  // "Оптимизация вычислительных мощностей для решения блока",
  // "Поиск корректного nonce для достижения целевого хеш-значения",
  // "Подтверждение найденного решения и его трансляция в сеть",
  // "Включение блока в цепочку и обновление данных на всех узлах",
];
