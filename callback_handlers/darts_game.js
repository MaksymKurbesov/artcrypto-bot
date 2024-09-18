import { updatePage } from "../helpers.js";

export const dartsGame = async (ctx) => {
  await updatePage(ctx, ctx.t("darts_game_caption"), [
    [
      {
        text: `${ctx.t("throw_dart")} 🎯`,
        callback_data: "start_darts_game",
      },
    ],
    [{ text: `${ctx.t("back")} ⬅️`, callback_data: "gamezone" }],
  ]);
};
