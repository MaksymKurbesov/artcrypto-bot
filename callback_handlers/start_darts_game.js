import { updateGameStatus } from "../FirestoreApi.js";
import { startDartsGame } from "../games/darts-game.js";
import { getUserData } from "../helpers.js";

export const StartDartsGame = async (ctx) => {
  const username = ctx.update.callback_query.from.username;
  const userData = await getUserData(username);

  if (!!userData.games.darts) {
    await ctx.reply(`🔴 ${ctx.t("game_cooldown")}`);
    return;
  }

  await updateGameStatus("darts", true, userData.username);
  await startDartsGame(ctx);
};
