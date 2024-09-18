import { updatePageWithPhoto } from "../helpers.js";
import { languageKeyboard } from "../consts.js";

export const Language = async (ctx) => {
  await updatePageWithPhoto(
    ctx,
    ctx.t("language_caption"),
    languageKeyboard(ctx),
    "./images/language.png",
  );
};
