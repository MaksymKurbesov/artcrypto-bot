import { progressMessages } from "../consts.js";
import { animateMessage } from "../helpers.js";
import { addMoneyToUser } from "../FirestoreApi.js";

export const startMiningGame = async (ctx) => {
  ctx.session.isMining = true;
  const sentMessage = await ctx.reply("Процесс майнинга запущен...");

  const username = ctx.update.callback_query.from.username;

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
    "🎉 Блок найден! Вы заработали 0.0001 BTC.",
    { parse_mode: "HTML" },
  );

  await addMoneyToUser(0.0001, username);

  ctx.session.isMining = false;
};
