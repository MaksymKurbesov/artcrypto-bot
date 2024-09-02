const tasks = [
  "Base Telegram: Подписаться",
  "Base Instagram: Подписаться",
  "Base X: Подписаться",
  "Scroll Telegram: Подписаться",
  "Scroll Instagram: Подписаться",
  "Scroll X: Подписаться",
];

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
      inline_keyboard: [...taskButtons, navigationButtons],
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
