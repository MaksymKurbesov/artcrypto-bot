import { updateGameStatus } from "../FirestoreApi.js";
import { startMiningGame } from "../games/mining-game.js";
import { getUserData } from "../helpers.js";

export const StartMiningGame = async (ctx) => {
  const username = ctx.update.callback_query.from.username;
  const userData = await getUserData(username);

  if (!!userData.games.mining) {
    await ctx.reply(`🔴 ${ctx.t("game_cooldown")}`);
    return;
  }

  await updateGameStatus("mining", true, userData.username);
  await startMiningGame(ctx);
  ctx.session.isMining = false;
};
