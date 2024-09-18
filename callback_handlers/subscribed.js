import { getCloseButton, inDollar } from "../helpers.js";
import { addMoneyToUser, completeTask } from "../FirestoreApi.js";

export const subscribed = async (ctx) => {
  if (!ctx.session.isUserSubscribed) {
    await ctx.reply(ctx.t("no_subscribe"), {
      reply_markup: {
        inline_keyboard: [[getCloseButton(ctx)]],
      },
    });
    return ctx.answerCbQuery();
  }

  const message = ctx.update.callback_query.message;
  const taskID = ctx.session.taskID;
  const username = message.chat.username;

  await addMoneyToUser(ctx.session.taskReward, username);
  await completeTask(taskID, username);
  await ctx.telegram.editMessageText(
    message.chat.id,
    message.message_id,
    null,
    ctx.t("thanks_for_subscribe", {
      award: ctx.session.taskReward,
      dollarReward: inDollar(ctx.session.taskReward),
    }),
    {
      reply_markup: {
        inline_keyboard: [[getCloseButton(ctx)]],
      },
      parse_mode: "HTML",
    },
  );

  ctx.session.isUserSubscribed = true;
};
