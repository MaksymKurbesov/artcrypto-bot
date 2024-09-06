import { addMoneyToUser } from "../FirestoreApi.js";

export const startDartsGame = async (ctx) => {
  const username = ctx.update.callback_query.from.username;
  const diceMessage = await ctx.sendDice({ emoji: "🎯" });
  const diceValue = diceMessage.dice.value;

  setTimeout(() => {
    if (diceValue === 6) {
      addMoneyToUser(0.5, username);
      ctx.reply(
        `🎉 Поздравляем! Ты метко попал в цель и заработал 0.0001 BTC! Отличная работа! `,
      );
    } else {
      ctx.reply(
        `😕 Увы, сегодня промах. Но не сдавайся, попробуй снова завтра!`,
      );
    }
  }, 4000);
};
