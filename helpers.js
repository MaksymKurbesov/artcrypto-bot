import { SLOT_VALUES } from "./SLOT_VALUES.js";
import { db } from "./index.js";
import { doc, getDoc } from "firebase/firestore";
import { addUser, getTasks } from "./FirestoreApi.js";

export const inDollar = (amount) => {
  const BITCOIN_CURRENCY_EXCHANGE = 58471.09;

  return (amount * BITCOIN_CURRENCY_EXCHANGE).toFixed(2);
};

export async function getUserData(username) {
  const userRef = doc(db, "users", username);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data() : null;
}

export function formatUserData(userData) {
  return {
    balance: parseFloat(userData.balance).toFixed(6),
    withdrawn: parseFloat(userData.withdrawn).toFixed(6),
    referrals: userData.referrals,
  };
}

export async function getOrCreateUser(username) {
  const userRef = doc(db, "users", username);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    // Создаем нового пользователя
    return await addUser(username);
  } else {
    // Возвращаем существующие данные пользователя
    return userDoc.data();
  }
}

export const getSlotSymbols = (value) => {
  // Найдем объект, у которого value совпадает с выпавшим числом
  const result = SLOT_VALUES.find((slot) => slot.value === value);

  // Если найдено, возвращаем символы, иначе возвращаем сообщение об ошибке
  if (result) {
    return `Результат: ${result.first}, ${result.second}, ${result.third}`;
  } else {
    return "Неизвестное значение слота!";
  }
};

export const generateTaskButtons = async (ctx, page = 0) => {
  const tasksPerPage = 5;
  const start = page * tasksPerPage;
  const end = start + tasksPerPage;
  const tasks = await getTasks(ctx);

  // console.log(tasks.tasks, "tasks.tasks");

  const taskButtons = tasks.tasks.slice(start, end).map((task) => {
    return [
      {
        text: `${task.text} - ${task.price}`,
        callback_data: `send_task_id_${task.id}`,
      },
    ];
  });

  const navigationButtons = [];
  if (page > 0) {
    navigationButtons.push({
      text: `⬅️ ${ctx.t("back")}`,
      callback_data: `page_${page - 1}`,
    });
  }
  if (end < tasks.length) {
    navigationButtons.push({
      text: `${ctx.t("next")} ➡️`,
      callback_data: `page_${page + 1}`,
    });
  }

  return {
    reply_markup: {
      inline_keyboard: [
        ...taskButtons,
        navigationButtons,
        [
          {
            text: `${ctx.t("main_menu")} 🏠`,
            callback_data: "main_page",
          },
        ],
      ],
    },
  };
};

export const generatePage = (ctx, caption, inline_keyboard) => {
  return ctx.replyWithPhoto(
    { source: "./images/main.png" },
    {
      caption,
      reply_markup: {
        inline_keyboard,
      },
      parse_mode: "HTML",
    },
  );
};

export const updatePage = (ctx, caption, inline_keyboard) => {
  ctx.editMessageCaption(caption, {
    reply_markup: {
      inline_keyboard,
    },
    parse_mode: "HTML",
  });
};

export const updatePageWithPhoto = async (
  ctx,
  caption,
  inline_keyboard,
  srcImage,
) => {
  const chatId = ctx.update.callback_query.message.chat.id;
  const messageId = ctx.session.lastMessageID;

  await ctx.editMessageMedia({
    reply_markup: inline_keyboard,
    chat_id: chatId,
    message_id: messageId,
    media: {
      source: srcImage,
    },
    type: "photo",
    caption: caption,
    parse_mode: "HTML",
  });

  await ctx.editMessageReplyMarkup({ inline_keyboard });
};

export const animateMessage = async (ctx, messageId, baseMessage, keyboard) => {
  const dots = [".", "..", "..."];
  for (let i = 0; i < 3; i++) {
    const messageWithDots = baseMessage + dots[i];
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      messageId,
      null,
      messageWithDots,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: keyboard,
        },
      },
    );
    await new Promise((resolve) => setTimeout(resolve, 300)); // Задержка 500 мс
  }
};

export const generateReward = () => {
  const min = 0.000017;
  const max = 0.0000017;
  return (Math.random() * (max - min) + min).toFixed(6);
};

export const getCloseButton = (ctx) => {
  return {
    text: `${ctx.t("close")} ❌`,
    callback_data: "delete_message",
  };
};

export const isUserInChat = async (ctx, channelId, userId) => {
  const chatMember = await ctx.telegram.getChatMember(channelId, userId);

  return (
    chatMember.status === "member" ||
    chatMember.status === "administrator" ||
    chatMember.status === "creator"
  );
};
