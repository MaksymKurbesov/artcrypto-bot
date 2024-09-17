import { addMoneyToUser } from "../FirestoreApi.js";
import { generateReward } from "../helpers.js";

export const startDartsGame = async (ctx) => {
  const username = ctx.update.callback_query.from.username;
  const diceMessage = await ctx.sendDice({ emoji: "🎯" });
  const diceValue = diceMessage.dice.value;
  const reward = generateReward();

  setTimeout(() => {
    if (diceValue === 6) {
      addMoneyToUser(reward, username);
      ctx.reply(ctx.t("darts_win", { reward: reward }));
    } else {
      ctx.reply(ctx.t("darts_lose"));
    }
  }, 4000);
};
