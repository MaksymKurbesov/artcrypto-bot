import { Telegraf, Markup, session } from "telegraf";
import {
  animateMessage,
  generatePage,
  generateTaskButtons,
  updatePage,
} from "./helpers.js";
import {
  getBitcoinCaption,
  progressMessages,
  startCaption,
  startInlineKeyboard,
} from "./consts.js";

import { initializeApp } from "firebase/app";
import { doc, getFirestore, getDoc } from "firebase/firestore";
import { addUser } from "./FirestoreApi.js";

const firebaseConfig = {
  apiKey: "AIzaSyDcf4LKhJrqnDY5ZdsYNxBFzO4xQEzo5ac",
  authDomain: "artcrypto-bot.firebaseapp.com",
  projectId: "artcrypto-bot",
  storageBucket: "artcrypto-bot.appspot.com",
  messagingSenderId: "473191985593",
  appId: "1:473191985593:web:9b3e2434dd9430d1f1c668",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const bot = new Telegraf("7427158827:AAHweRtzXbYUW0K_iwFPSNNMXCzMBlxmMiE");
bot.use(session({ defaultSession: () => ({ isMining: false }) }));

bot.action(/page_(\d+)/, (ctx) => {
  const page = parseInt(ctx.match[1], 10);
  ctx.answerCbQuery();
  ctx.editMessageReplyMarkup(generateTaskButtons(page).reply_markup);
});

bot.on("callback_query", async (ctx) => {
  const callbackData = ctx.callbackQuery.data;

  await ctx.answerCbQuery();

  if (ctx.session.isMining) {
    return await ctx.answerCbQuery();
  }

  if (callbackData === "main_page") {
    ctx.session.isMining = false;
    await updatePage(ctx, startCaption, startInlineKeyboard);
  }

  if (callbackData === "get_bitcoin") {
    await updatePage(ctx, getBitcoinCaption, [
      [{ text: "Начать процесс майнинга", callback_data: "start_mining" }],
      [{ text: "Главное меню 🏠", callback_data: "main_page" }],
    ]);
  }

  if (callbackData === "tasks_page") {
    await updatePage(
      ctx,
      `<b>CRYPTO APATE BOT -> Задачи</b>`,
      generateTaskButtons().reply_markup.inline_keyboard,
    );
  }

  if (callbackData === "start_mining") {
    ctx.session.isMining = true;
    const sentMessage = await ctx.reply("Процесс майнинга запущен...");

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

    ctx.session.isMining = false;
  }

  if (callbackData === "user_wallets") {
    await updatePage(
      ctx,
      `<b>CRYPTO APATE BOT -> Кошельки</b>\n\nУкажите номер кошелька для вывода средств. Пожалуйста, проверьте корректность данных, чтобы избежать ошибок при переводе.\n\n<b>BITCOIN:</b> -\n<b>TON:</b> -\n<b>TRC20:</b> -`,
      [
        [{ text: "Изменить Bitcoin", callback_data: "test1" }],
        [{ text: "Изменить TON", callback_data: "test2" }],
        [{ text: "Изменить TRC20", callback_data: "test3" }],
        [{ text: "Главное меню 🏠", callback_data: "main_page" }],
      ],
    );
  }
});

// Обработка команды /start
bot.start(async (ctx) => {
  const username = ctx.update.message.from.username;
  const userRef = await doc(db, "users", username);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists) {
    await addUser(username);
  }

  generatePage(ctx, startCaption, startInlineKeyboard);

  const payload = ctx.payload;

  console.log(payload, "payload");
});

// Запуск бота
bot.launch();

// Обработка SIGINT и SIGTERM для корректного завершения работы
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
