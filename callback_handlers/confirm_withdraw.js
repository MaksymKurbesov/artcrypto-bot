import { getDoc } from "firebase/firestore";
import { getUserData } from "../helpers.js";

export const ConfirmWithdraw = async (ctx) => {
  const callbackData = ctx.callbackQuery.data;
  const username = ctx.update.callback_query.from.username;
  const userData = await getUserData(username);

  if (userData.balance < 50) {
    return await ctx.reply(ctx.t("insufficient_funds"));
  }

  const wallet = callbackData.split("_")[1];
  await ctx.reply(
    ctx.t("withdraw_request_created", {
      wallet: userData[`${wallet}_wallet`],
    }),
    {
      parse_mode: "HTML",
    },
  );
  ctx.session.isWithdraw = true;
};
