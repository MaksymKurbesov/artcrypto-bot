import { getCloseButton } from "../helpers.js";

export const startChangeWallet = async (ctx) => {
  const callbackData = ctx.callbackQuery.data;
  const wallet = callbackData.split("_")[3];

  await ctx.reply(`🟡 ${ctx.t("enter_new_wallet")}`, {
    reply_markup: {
      inline_keyboard: [[getCloseButton(ctx)]],
    },
  });
  ctx.session.isUserChangeWallet = true;
  ctx.session.changingWallet = wallet;
};
