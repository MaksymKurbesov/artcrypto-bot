import { SLOT_VALUES } from "./SLOT_VALUES.js";

const tasks = [
  "Base Telegram: Подписаться",
  "Base Instagram: Подписаться",
  "Base X: Подписаться",
  "Scroll Telegram: Подписаться",
  "Scroll Instagram: Подписаться",
  "Scroll X: Подписаться",
];

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

export const generateTaskButtons = (page = 0) => {
  const tasksPerPage = 5;
  const start = page * tasksPerPage;
  const end = start + tasksPerPage;
  const taskButtons = tasks
    .slice(start, end)
    .map((task, index) => [
      { text: task, callback_data: `task_${start + index}` },
    ]);

  const navigationButtons = [];
  if (page > 0) {
    navigationButtons.push({
      text: "⬅️ Назад",
      callback_data: `page_${page - 1}`,
    });
  }
  if (end < tasks.length) {
    navigationButtons.push({
      text: "Вперёд ➡️",
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
            text: "Главное меню 🏠",
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

export const animateMessage = async (ctx, messageId, baseMessage) => {
  const dots = [".", "..", "..."];
  for (let i = 0; i < 3; i++) {
    const messageWithDots = baseMessage + dots[i];
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      messageId,
      null,
      messageWithDots,
    );
    await new Promise((resolve) => setTimeout(resolve, 300)); // Задержка 500 мс
  }
};
