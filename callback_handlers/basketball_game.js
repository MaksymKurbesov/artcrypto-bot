import { updatePage } from "../helpers.js";

export const basketballGame = async (ctx) => {
  await updatePage(ctx, ctx.t("basketball_game_caption"), [
    [
      {
        text: `${ctx.t("throw_ball")} 🏀`,
        callback_data: "start_basketball_game",
      },
    ],
    [{ text: `${ctx.t("back")} ⬅️`, callback_data: "gamezone" }],
  ]);
};
