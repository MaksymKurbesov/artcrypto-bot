import { updatePage } from "../helpers.js";

export const footballGame = async (ctx) => {
  await updatePage(ctx, ctx.t("football_game_caption"), [
    [
      {
        text: `${ctx.t("throw_ball")} ⚽`,
        callback_data: "start_football_game",
      },
    ],
    [{ text: `${ctx.t("back")} ⬅️`, callback_data: "gamezone" }],
  ]);
};
