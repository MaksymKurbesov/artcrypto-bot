import { TASK_REWARD_BY_TYPE_MAP } from "../consts.js";
import { getCloseButton, getUserData, inDollar } from "../helpers.js";
import { checkTaskStatus, getTasks } from "../FirestoreApi.js";

export const sendTask = async (ctx) => {
  const callbackData = ctx.callbackQuery.data;
  const username = ctx.update.callback_query.from.username;
  const userData = await getUserData(username);

  const taskID = Number(callbackData.split("_")[3]);
  const tasks = await getTasks(ctx);
  const task = tasks.tasks.find((item) => item.id === taskID);
  const taskIsCompleted = await checkTaskStatus(taskID, username);

  if (taskIsCompleted) {
    return ctx.reply(ctx.t("task_completed"), {
      reply_markup: {
        inline_keyboard: [[getCloseButton(ctx)]],
      },
    });
  }

  const taskDescription = task.text;
  const taskLink = task.link;
  const taskType = taskDescription.split(":")[1].trim();
  const reward = TASK_REWARD_BY_TYPE_MAP[taskType].toFixed(6);

  ctx.session.taskID = taskID;
  ctx.session.taskReward = reward;
  ctx.session.isUserSubscribed = false;

  const keyboard = [
    [{ text: `✅ ${ctx.t("done")}`, callback_data: "subscribed" }],
    [{ text: `🚫 ${ctx.t("cancel")}`, callback_data: "delete_message" }],
  ];

  await ctx.reply(
    ctx.t("task_message", {
      taskDescription: taskDescription,
      award: reward,
      link: taskLink,
      dollarReward: inDollar(reward),
    }),
    {
      reply_markup: {
        inline_keyboard: keyboard,
      },
      parse_mode: "HTML",
      link_preview_options: {
        is_disabled: true,
      },
    },
  );

  setTimeout(() => {
    ctx.session.isUserSubscribed = true;
  }, 5000);
};
