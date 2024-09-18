import { getUserData, updatePageWithPhoto } from "../helpers.js";
import { walletsInlineKeyboard } from "../consts.js";

export const UserWallets = async (ctx) => {
  const username = ctx.update.callback_query.from.username;
  const userData = await getUserData(username);

  await updatePageWithPhoto(
    ctx,
    ctx.t("user_wallets_caption", {
      bitcoin_wallet: userData.bitcoin_wallet,
      ton_wallet: userData.ton_wallet,
      trc20_wallet: userData.trc20_wallet,
    }),
    walletsInlineKeyboard(ctx),
    "./images/wallets.png",
  );
};
