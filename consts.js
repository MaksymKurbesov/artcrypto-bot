export const REFERRAL_REWARD = 0.000052;
export const SUBSCRIBE_REWARD = 0.000034;
export const CONNECT_REWARD = 0.000086;
export const WITHDRAW_MINIMUM = 0.0086;

export const TASK_REWARD_BY_TYPE_MAP = {
  Connect: CONNECT_REWARD,
  Subscribe: SUBSCRIBE_REWARD,
};

export const startInlineKeyboard = (userId, ctx) => {
  return [
    [
      { text: `🎮 ${ctx.t("gamezone")}`, callback_data: "gamezone" },
      { text: `🎁 ${ctx.t("daily_reward")}`, callback_data: "daily_reward" },
    ],
    [
      { text: `📝 ${ctx.t("tasks")}`, callback_data: "tasks_page" },
      { text: `💳 ${ctx.t("my_wallets")}`, callback_data: "user_wallets" },
    ],
    [
      { text: `💸 ${ctx.t("withdraw")}`, callback_data: "withdraw" },
      {
        text: `👥 ${ctx.t("invite_friends")}`,
        callback_data: "referrals",
        // url: `https://t.me/share/url?text=${ctx.t("referral_message")}&url=https://t.me/cryptoapatebot/?start=${userId}`,
      },
    ],
    [
      { text: `🌍 ${ctx.t("language")}`, callback_data: "language" },
      { text: "🆘 Support", url: "https://t.me/cryptoquest_bot_support" },
    ],
    [{ text: `📄  ${ctx.t("about_us")}`, callback_data: "about_us" }],
  ];
};

export const gameZoneKeyboard = (ctx) => {
  return [
    [
      { text: `${ctx.t("mining")} ⛏️`, callback_data: "mining_game" },
      { text: `${ctx.t("darts")} 🎯`, callback_data: "darts_game" },
      { text: `${ctx.t("basketball")} 🏀`, callback_data: "basketball_game" },
    ],
    [{ text: `${ctx.t("football")} ⚽`, callback_data: "football_game" }],
    [{ text: `${ctx.t("main_menu")} 🏠`, callback_data: "main_page" }],
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

export const languageKeyboard = (ctx) => {
  return [
    [
      {
        text: "EN 🇬🇧",
        callback_data: "language_en",
      },
      {
        text: "ES 🇪🇸",
        callback_data: "language_es",
      },
      {
        text: "HI 🇮🇳",
        callback_data: "language_hi",
      },
    ],
    [
      {
        text: "AR 🇸🇦",
        callback_data: "language_ar",
      },
      {
        text: "FR 🇫🇷",
        callback_data: "language_fr",
      },
      {
        text: "PT 🇵🇹",
        callback_data: "language_pt",
      },
    ],
    [
      {
        text: "RU 🇷🇺",
        callback_data: "language_ru",
      },
      {
        text: "DE 🇩🇪",
        callback_data: "language_de",
      },
      {
        text: "ID 🇮🇩",
        callback_data: "language_id",
      },
    ],
    [{ text: `${ctx.t("main_menu")} 🏠`, callback_data: "main_page" }],
  ];
};

export const getProgressMessages = (ctx) => {
  const array = [];
  for (let i = 0; i < 3; i++) {
    array[i] = ctx.t(`operation${i + 1}`);
  }

  return array;
};
