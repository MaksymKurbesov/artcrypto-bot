import { addMoneyToUser } from "../FirestoreApi.js";

export const startBasketballGame = async (ctx) => {
  const username = ctx.update.callback_query.from.username;
  const diceMessage = await ctx.sendDice({ emoji: "🏀" });
  const diceValue = diceMessage.dice.value;

  setTimeout(() => {
    if (diceValue === 5) {
      addMoneyToUser(0.5, username);
      ctx.reply(ctx.t("darts_win"));
    } else {
      ctx.reply(ctx.t("darts_lose"));
    }
  }, 4000);
};
