import { updatePageWithPhoto } from "../helpers.js";
import { REFERRAL_REWARD } from "../consts.js";
import { BITCOIN_CURRENCY_EXCHANGE } from "../index.js";

export const Referrals = async (ctx) => {
  const username = ctx.update.callback_query.from.username;

  await updatePageWithPhoto(
    ctx,
    ctx.t("referrals_caption", {
      reward: REFERRAL_REWARD.toFixed(6),
      dollarReward: REFERRAL_REWARD * BITCOIN_CURRENCY_EXCHANGE.toFixed(2),
    }),
    [
      [
        {
          text: ctx.t("invite_friends"),
          url: `https://t.me/share/url?text=${ctx.t("referral_message")}&url=https://t.me/crypto_quest_app_bot/?start=${username}`,
        },
      ],
      [{ text: `${ctx.t("main_menu")} 🏠`, callback_data: "main_page" }],
    ],
    "./images/referrals.png",
  );
};
