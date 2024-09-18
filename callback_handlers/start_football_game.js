import { updateGameStatus } from "../FirestoreApi.js";
import { startFootballGame } from "../games/football-game.js";
import { getUserData } from "../helpers.js";

export const StartFootballGame = async (ctx) => {
  const username = ctx.update.callback_query.from.username;
  const userData = await getUserData(username);

  if (!!userData.games.football) {
    await ctx.reply(`🔴 ${ctx.t("game_cooldown")}`);
    return ctx.answerCbQuery();
  }

  await updateGameStatus("football", true, userData.username);
  await startFootballGame(ctx);
};
