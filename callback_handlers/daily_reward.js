import { updatePageWithPhoto } from "../helpers.js";

export const DailyReward = async (ctx) => {
  await updatePageWithPhoto(
    ctx,
    ctx.t("daily_reward_caption"),
    [
      [
        {
          text: `${ctx.t("get_daily_reward")} 🎁`,
          callback_data: "get_daily_reward",
        },
      ],
      [{ text: `${ctx.t("main_menu")} 🏠`, callback_data: "main_page" }],
    ],
    "./images/daily_bonus.png",
  );
};
