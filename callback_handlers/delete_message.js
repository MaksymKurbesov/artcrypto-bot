export const deleteMessage = async (ctx) => {
  const message = ctx.update.callback_query.message;
  await ctx.deleteMessage(message.message_id);
};
