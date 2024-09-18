import { updatePageWithPhoto } from "../helpers.js";
import { withdrawKeyboard } from "../consts.js";

export const Withdraw = async (ctx) => {
  await updatePageWithPhoto(
    ctx,
    ctx.t("withdraw_caption"),
    withdrawKeyboard(ctx),
    "./images/withdraw.png",
  );
};
