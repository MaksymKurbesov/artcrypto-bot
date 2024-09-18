import { getCloseButton } from "../helpers.js";

export const changeLanguage = async (ctx) => {
  const callbackData = ctx.callbackQuery.data;
  const language = callbackData.split("_")[1];
  await ctx.i18n.setLocale(language);
  await ctx.reply(`🟢 ${ctx.t("language_changed")}`, {
    reply_markup: {
      inline_keyboard: [[getCloseButton(ctx)]],
    },
  });
};
