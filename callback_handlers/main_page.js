import {
  formatUserData,
  getUserData,
  inDollar,
  updatePageWithPhoto,
} from "../helpers.js";
import { startInlineKeyboard } from "../consts.js";

export const MainPage = async (ctx) => {
  const username = ctx.update.callback_query.from.username;
  ctx.session.isMining = false;
  ctx.session.isWithdraw = false;

  const userData = await getUserData(username);
  const { balance, withdrawn, referrals } = formatUserData(userData);

  await updatePageWithPhoto(
    ctx,
    ctx.t("main_menu_caption", {
      username: username,
      balance,
      dollarBalance: inDollar(balance),
      withdrawn,
      dollarWithdrawn: inDollar(withdrawn),
      referrals,
    }),
    startInlineKeyboard(userData.username, ctx),
    "./images/main.png",
  );
};
