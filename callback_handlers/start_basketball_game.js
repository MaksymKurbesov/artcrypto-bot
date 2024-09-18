import { updateGameStatus } from "../FirestoreApi.js";
import { startBasketballGame } from "../games/basketball-game.js";
import { getUserData } from "../helpers.js";

export const StartBasketballGame = async (ctx) => {
  const username = ctx.update.callback_query.from.username;
  const userData = await getUserData(username);

  if (!!userData.games.basketball) {
    await ctx.reply(`🔴 ${ctx.t("game_cooldown")}`);
    return ctx.answerCbQuery();
  }

  await updateGameStatus("basketball", true, userData.username);
  await startBasketballGame(ctx);
};
