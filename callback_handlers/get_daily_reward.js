import {
  generateReward,
  getCloseButton,
  getUserData,
  inDollar,
} from "../helpers.js";
import { addMoneyToUser, updateDailyRewardStatus } from "../FirestoreApi.js";

export const GetDailyReward = async (ctx) => {
  const reward = generateReward();
  const username = ctx.update.callback_query.from.username;
  const userData = await getUserData(username);

  if (!userData.dailyReward) {
    await ctx.reply(ctx.t("daily_reward_received"), {
      reply_markup: {
        inline_keyboard: [[getCloseButton(ctx)]],
      },
    });
    return ctx.answerCbQuery();
  }

  await ctx.reply(
    ctx.t("daily_reward_message", {
      reward: reward,
      dollarReward: inDollar(reward),
    }),
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[getCloseButton(ctx)]],
      },
    },
  );
  await addMoneyToUser(reward, username);
  await updateDailyRewardStatus(false, username);
};
