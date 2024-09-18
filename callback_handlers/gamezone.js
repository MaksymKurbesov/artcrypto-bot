import { updatePageWithPhoto } from "../helpers.js";
import { gameZoneKeyboard } from "../consts.js";

export const Gamezone = async (ctx) => {
  await updatePageWithPhoto(
    ctx,
    ctx.t("gamezone_caption"),
    gameZoneKeyboard(ctx),
    "./images/gamezone.png",
  );
};
