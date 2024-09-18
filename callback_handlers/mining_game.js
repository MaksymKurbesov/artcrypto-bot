import { updatePage } from "../helpers.js";

export const miningGame = async (ctx) => {
  await updatePage(ctx, ctx.t("mining_game_caption"), [
    [
      {
        text: `${ctx.t("search_for_block")} ✅`,
        callback_data: "start_mining_game",
      },
    ],
    [{ text: `${ctx.t("back")} ⬅️`, callback_data: "gamezone" }],
  ]);
};
