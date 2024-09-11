import { animateMessage } from "../helpers.js";
import { addMoneyToUser } from "../FirestoreApi.js";
import { getProgressMessages } from "../consts.js";

export const startMiningGame = async (ctx) => {
  ctx.session.isMining = true;
  const sentMessage = await ctx.reply(`${ctx.t("start_mining")}...`);

  const username = ctx.update.callback_query.from.username;
  const progressMessages = getProgressMessages(ctx);

  let messageId = sentMessage.message_id;

  for (let i = 0; i < progressMessages.length; i++) {
    const message = progressMessages[i];

    for (let j = 0; j < 3; j++) {
      await animateMessage(ctx, messageId, message);
    }
  }

  await ctx.telegram.editMessageText(
    ctx.chat.id,
    messageId,
    null,
    ctx.t("mining_success_end"),
    { parse_mode: "HTML" },
  );

  await addMoneyToUser(0.0001, username);

  ctx.session.isMining = false;
};
