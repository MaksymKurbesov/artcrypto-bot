import {
  addMoneyToUser,
  addReferralToUser,
  userAlreadyHasReferral,
} from "../FirestoreApi.js";
import {
  formatUserData,
  generatePage,
  getOrCreateUser,
  inDollar,
} from "../helpers.js";
import { REFERRAL_REWARD, startInlineKeyboard } from "../consts.js";

export const InitialStartMenu = async (ctx) => {
  try {
    const username = ctx.update.message.from.username;
    const referralNickname = ctx.payload;
    const alreadyHasReferral = await userAlreadyHasReferral(
      username,
      referralNickname,
    );

    console.log(alreadyHasReferral, "alreadyHasReferral");

    if (referralNickname && !alreadyHasReferral) {
      await addReferralToUser(username, referralNickname);
      await addMoneyToUser(REFERRAL_REWARD, referralNickname);
    }

    const userData = await getOrCreateUser(username);

    const { balance, withdrawn, referrals } = formatUserData(userData);

    const message = await generatePage(
      ctx,
      ctx.t("main_menu_caption", {
        username,
        balance,
        dollarBalance: inDollar(balance),
        withdrawn,
        dollarWithdrawn: inDollar(withdrawn),
        referrals,
      }),
      startInlineKeyboard(username, ctx),
    );

    ctx.session.lastMessageID = message.message_id;
  } catch (error) {
    console.error("Ошибка в InitialStartMenu:", error);
    await ctx.reply(
      "Произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.",
    );
  }
};
