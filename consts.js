export const gameZoneKeyboard = (ctx) => {
  return [
    [
      { text: `${ctx.t("mining")} ⛏️`, callback_data: "mining_game" },
      { text: `${ctx.t("darts")} 🎯`, callback_data: "darts_game" },
      { text: `${ctx.t("basketball")} 🏀`, callback_data: "basketball_game" },
    ],
    [{ text: `${ctx.t("main_menu")} 🏠`, callback_data: "main_page" }],
  ];
};

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
        url: `https://t.me/share/url?text=🚀%20Хочешь%20попробовать%20что-то%20действительно%20крутое?%20Нашел%20бота,%20где%20можно%20зарабатывать%20BTC,%20просто%20играя%20в%20мини-игры!%20🎮🎯%20Бросай%20дротики,%20копай%20биткоины%20или%20закидывай%20мячи%20в%20корзину%20—%20и%20каждый%20раз%20за%20это%20получаешь%20настоящие%20BTC!%20💸%20&url=https://t.me/cryptoapatebot/?start=${userId}`,
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
