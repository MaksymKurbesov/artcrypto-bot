import { updatePage } from "../helpers.js";

export const AboutUs = async (ctx) => {
  await updatePage(ctx, ctx.t("about_us_caption"), [
    [{ text: `${ctx.t("main_menu")} 🏠`, callback_data: "main_page" }],
  ]);
};
