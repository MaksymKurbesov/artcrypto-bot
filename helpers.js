import { SLOT_VALUES } from "./SLOT_VALUES.js";
import { CONNECT_REWARD, SUBSCRIBE_REWARD } from "./consts.js";

const getTasks = (ctx) => {
  return [
    {
      text: `Scroll Wallet: ${ctx.t("connect")}`,
      link: `https://dropscroll.io`,
      price: CONNECT_REWARD,
      callback_data: `Scroll Wallet: Connect`,
    },
    {
      text: `Scroll Telegram: ${ctx.t("subscribe")}`,
      link: `https://t.me/scroll_zk_io`,
      price: SUBSCRIBE_REWARD,
      callback_data: `Scroll Telegram: Subscribe`,
    },
    // {
    //   text: `Scroll X: ${ctx.t("subscribe")}`,
    //   link: `https://google.com`,
    //   price: SUBSCRIBE_REWARD,
    //   callback_data: "Scroll X: Subscribe",
    // },
    {
      text: `Base Wallet: ${ctx.t("connect")}`,
      link: `https://dropscroll.io`,
      price: CONNECT_REWARD,
      callback_data: "Base Wallet: Connect",
    },
    {
      text: `Base Telegram: ${ctx.t("subscribe")}`,
      link: `https://t.me/base_air_drop`,
      price: SUBSCRIBE_REWARD,
      callback_data: "Base Telegram: Subscribe",
    },
    // {
    //   text: `Base X: ${ctx.t("subscribe")}`,
    //   link: `https://x.com`,
    //   price: SUBSCRIBE_REWARD,
    //   callback_data: "Base X: Subscribe",
    // },
  ];
};

export const getSlotSymbols = (value) => {
  // Найдем объект, у которого value совпадает с выпавшим числом
  const result = SLOT_VALUES.find((slot) => slot.value === value);

  // Если найдено, возвращаем символы, иначе возвращаем сообщение об ошибке
  if (result) {
    return `Результат: ${result.first}, ${result.second}, ${result.third}`;
  } else {
    return "Неизвестное значение слота!";
  }
};

export const generateTaskButtons = (ctx, page = 0) => {
  const tasksPerPage = 5;
  const start = page * tasksPerPage;
  const end = start + tasksPerPage;
  const tasks = getTasks(ctx);

  const taskButtons = tasks.slice(start, end).map((task) => {
    return [
      {
        text: `${task.text} - ${task.price}₿`,
        callback_data: `send_task_${task.callback_data}__${task.link}`,
      },
    ];
  });

  const navigationButtons = [];
  if (page > 0) {
    navigationButtons.push({
      text: `⬅️ ${ctx.t("back")}`,
      callback_data: `page_${page - 1}`,
    });
  }
  if (end < tasks.length) {
    navigationButtons.push({
      text: `${ctx.t("next")} ➡️`,
      callback_data: `page_${page + 1}`,
    });
  }

  return {
    reply_markup: {
      inline_keyboard: [
        ...taskButtons,
        navigationButtons,
        [
          {
            text: `${ctx.t("main_menu")} 🏠`,
            callback_data: "main_page",
          },
        ],
      ],
    },
  };
};

export const generatePage = (ctx, caption, inline_keyboard) => {
  ctx.replyWithPhoto(
    { source: "./main.png" },
    {
      caption,
      reply_markup: {
        inline_keyboard,
      },
      parse_mode: "HTML",
    },
  );
};

export const updatePage = (ctx, caption, inline_keyboard) => {
  ctx.editMessageCaption(caption, {
    reply_markup: {
      inline_keyboard,
    },
    parse_mode: "HTML",
  });
};

export const animateMessage = async (ctx, messageId, baseMessage, keyboard) => {
  const dots = [".", "..", "..."];
  for (let i = 0; i < 3; i++) {
    const messageWithDots = baseMessage + dots[i];
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      messageId,
      null,
      messageWithDots,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: keyboard,
        },
      },
    );
    await new Promise((resolve) => setTimeout(resolve, 300)); // Задержка 500 мс
  }
};

export const generateReward = () => {
  const min = 0.000017;
  const max = 0.0000017;
  return (Math.random() * (max - min) + min).toFixed(6);
};

export const getCloseButton = (ctx) => {
  return {
    text: `${ctx.t("close")} ❌`,
    callback_data: "delete_message",
  };
};

export const isUserInChat = async (ctx, channelId, userId) => {
  const chatMember = await ctx.telegram.getChatMember(channelId, userId);

  return (
    chatMember.status === "member" ||
    chatMember.status === "administrator" ||
    chatMember.status === "creator"
  );
};
