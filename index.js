import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import {
  generateTaskButtons,
  getCloseButton,
  getSlotSymbols,
  isUserInChat,
} from "./helpers.js";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { changeUserWallet } from "./FirestoreApi.js";
import { firebaseConfig } from "./firebase.config.js";
import { InitialStartMenu } from "./callback_handlers/initial_start_menu.js";
import { callbackHandlers } from "./callback_handlers/index.js";
import { i18n } from "./i18n.js";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// const bot = new Telegraf("7249494538:AAFTyrQvUKj9yqS7JFFgIWhyHNJ4xwwX-yI"); // prod
const bot = new Telegraf("7427158827:AAHweRtzXbYUW0K_iwFPSNNMXCzMBlxmMiE"); // dev

export const BITCOIN_CURRENCY_EXCHANGE = 58471.09;

bot.use(
  session({
    defaultSession: () => ({ isMining: false }),
  }),
);
bot.use(i18n);

bot.action(/page_(\d+)/, async (ctx) => {
  const page = parseInt(ctx.match[1], 10);
  const taskButtons = await generateTaskButtons(ctx, page);

  ctx.editMessageReplyMarkup(taskButtons.reply_markup);
  ctx.answerCbQuery();
});

bot.command(["start", "menu"], InitialStartMenu);

bot.on(message("text"), async (ctx) => {
  const text = ctx.update.message.text;
  const username = ctx.update.message.from.username;
  const wallet = ctx.session.changingWallet;

  if (ctx.session.isUserChangeWallet) {
    await changeUserWallet(wallet, text, username);
    ctx.reply(`🟢 ${ctx.t("wallet_changed")}`, {
      reply_markup: {
        inline_keyboard: [[getCloseButton(ctx)]],
      },
    });
    ctx.session.isUserChangeWallet = false;
  }

  if (ctx.session.isWithdraw) {
    ctx.reply(`🟢 ${ctx.t("withdraw_request_sent")}`, {
      reply_markup: {
        inline_keyboard: [[getCloseButton(ctx)]],
      },
    });
    ctx.session.isWithdraw = false;
  }
});

bot.on("callback_query", async (ctx) => {
  try {
    const callbackData = ctx.callbackQuery.data;
    const handlerEntry = callbackHandlers.find(({ check }) =>
      check(callbackData),
    );

    if (ctx.session.isMining) {
      return;
    }

    if (handlerEntry) {
      await handlerEntry.handler(ctx);
    } else {
      console.warn(`Нет обработчика для callback_data: ${callbackData}`);
    }

    await ctx.answerCbQuery();
  } catch (e) {
    console.log(e, "error");
  }
});

// Запуск бота
bot.launch();

bot.catch((err, ctx) => {
  console.error(`Ошибка для пользователя ${ctx.updateType}`, err);
  ctx.reply("Произошла ошибка, попробуйте позже.");
});

// Обработка SIGINT и SIGTERM для корректного завершения работы
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

// if (text === "test") {
//   try {
//     const userId = ctx.message.from.id; // Получаем ID пользователя
//     const channelId = "-1001861036116";
//     const userInChat = await isUserInChat(ctx, channelId, userId);
//
//     if (userInChat) {
//       ctx.reply("Вы подписаны на канал!");
//     } else {
//       ctx.reply(
//         "Вы не подписаны на канал. Пожалуйста, подпишитесь, чтобы продолжить.",
//       );
//     }
//   } catch (error) {
//     console.error(error);
//     ctx.reply(
//       "Не удалось проверить подписку. Убедитесь, что бот является администратором канала.",
//     );
//   }
// }

// bot.command("spin", async (ctx) => {
//   const diceMessage = await ctx.sendDice({ emoji: "🎰" });
//
//   const diceValue = diceMessage.dice.value;
//
//   ctx.reply(`🎰 Результат слота: ${diceValue} ${getSlotSymbols(diceValue)}`);
//
//   if (diceValue === 64) {
//     ctx.reply("🎉 Поздравляю! Ты сорвал джекпот!");
//   } else {
//     ctx.reply("😔 Попробуй еще раз!");
//   }
// });
