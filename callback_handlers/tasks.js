import { generateTaskButtons, updatePageWithPhoto } from "../helpers.js";

export const Tasks = async (ctx) => {
  const buttons = await generateTaskButtons(ctx);

  const inline_keyboard = buttons.reply_markup.inline_keyboard;

  await updatePageWithPhoto(
    ctx,
    `<b>CRYPTO QUEST -> ${ctx.t("tasks")}</b>`,
    inline_keyboard,
    "./images/tasks.png",
  );
};
