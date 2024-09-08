import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import {
  animateMessage,
  generatePage,
  generateTaskButtons,
  getSlotSymbols,
  isUserInChat,
  updatePage,
} from "./helpers.js";
import {
  gameZoneKeyboard,
  languageKeyboard,
  startInlineKeyboard,
  walletsInlineKeyboard,
  withdrawKeyboard,
} from "./consts.js";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, getDoc } from "firebase/firestore";
import { addUser, changeUserWallet, updateGameStatus } from "./FirestoreApi.js";
import { startMiningGame } from "./games/mining-game.js";
import { startDartsGame } from "./games/darts-game.js";
import { firebaseConfig } from "./firebase.config.js";
import { I18n } from "@grammyjs/i18n";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const bot = new Telegraf("7427158827:AAHweRtzXbYUW0K_iwFPSNNMXCzMBlxmMiE");

const i18n = new I18n({
  defaultLocale: "en", // see below for more information
  directory: "locales", // Load all translation files from locales/.
  useSession: true,
});

bot.use(
  session({
    defaultSession: () => ({ isMining: false }),
  }),
);
bot.use(i18n);

bot.start(async (ctx) => {
  const username = ctx.update.message.from.username;
  const userRef = await doc(db, "users", username);
  const userDoc = await getDoc(userRef);
  const userData = userDoc.data();

  if (!userDoc.exists) {
    await addUser(username);
  }

  generatePage(
    ctx,
    ctx.t("main_menu_caption", { balance: userData.balance }),
    startInlineKeyboard(userData.id, ctx),
  );

  const payload = ctx.payload;

  console.log(payload, "payload");
});

bot.action(/page_(\d+)/, (ctx) => {
  const page = parseInt(ctx.match[1], 10);
  ctx.answerCbQuery();
  ctx.editMessageReplyMarkup(generateTaskButtons(ctx, page).reply_markup);
});

bot.on(message("text"), async (ctx) => {
  const text = ctx.update.message.text;
  const username = ctx.update.message.from.username;
  const wallet = ctx.session.changingWallet;

  if (ctx.session.isUserChangeWallet) {
    await changeUserWallet(wallet, text, username);
    ctx.reply(`🟢 ${ctx.t("wallet_changed")}`);
    console.log(ctx.session.changingWallet, "ctx.session.changingWallet");
    ctx.session.isUserChangeWallet = false;
  }

  if (ctx.session.isWithdraw) {
    ctx.reply(`🟢 ${ctx.t("withdraw_request_sent")}`);
    ctx.session.isWithdraw = false;
  }

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
});

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

bot.on("callback_query", async (ctx) => {
  const callbackData = ctx.callbackQuery.data;
  const username = ctx.update.callback_query.from.username;
  const userRef = doc(db, "users", username);

  await ctx.answerCbQuery();

  if (ctx.session.isMining) {
    return await ctx.answerCbQuery();
  }

  if (callbackData === "main_page") {
    ctx.session.isMining = false;
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    await updatePage(
      ctx,
      ctx.t("main_menu_caption", { balance: userData.balance }),
      startInlineKeyboard(userData.id, ctx),
    );
  }

  if (callbackData === "gamezone") {
    await updatePage(ctx, ctx.t("gamezone_caption"), gameZoneKeyboard(ctx));
  }

  if (callbackData === "tasks_page") {
    await updatePage(
      ctx,
      `<b>CRYPTO APATE BOT -> ${ctx.t("tasks")}</b>`,
      generateTaskButtons(ctx).reply_markup.inline_keyboard,
    );
  }

  if (callbackData === "send_task") {
    const baseMessage = `<b>CRYPTO APATE BOT -> Task</b>\n\nBase Telegram: Subscribe\n<b>0.000532BTC</b>\n🔗 <a href="google.com">Link</a>\n\nWaiting...`;
    const keyboard = [
      [{ text: "✅ Подписался", callback_data: "subscribed" }],
      [{ text: "🚫 Отмена", callback_data: "cancel_subscribe" }],
    ];

    const sentMessage = await ctx.reply(baseMessage, {
      reply_markup: {
        inline_keyboard: keyboard,
      },
      parse_mode: "HTML",
    });

    // ctx.session.isUserSubscribed = false;

    // for (let i = 0; i < 3; i++) {
    //   await animateMessage(ctx, sentMessage.message_id, baseMessage, keyboard);
    // }
  }

  if (callbackData === "subscribed") {
    const updatedMessage = `<b>CRYPTO APATE BOT -> Task</b>\n\n<b>🟢 Спасибо за подписку!</b>\nПолучите <b>0.000532BTC</b>`;
    const message = ctx.update.callback_query.message;

    await ctx.telegram.editMessageText(
      message.chat.id,
      message.message_id,
      null,
      updatedMessage,
      { parse_mode: "HTML" },
    );

    ctx.session.isUserSubscribed = true;
  }

  if (callbackData === "mining_game") {
    await updatePage(ctx, ctx.t("mining_game_caption"), [
      [
        {
          text: `${ctx.t("search_for_block")} ✅`,
          callback_data: "start_mining_game",
        },
      ],
      [{ text: `${ctx.t("back")} ⬅️`, callback_data: "gamezone" }],
    ]);
  }

  if (callbackData === "darts_game") {
    await updatePage(ctx, ctx.t("darts_game_caption"), [
      [
        {
          text: `${ctx.t("throw_dart")} 🎯`,
          callback_data: "start_darts_game",
        },
      ],
      [{ text: `${ctx.t("back")} ⬅️`, callback_data: "gamezone" }],
    ]);
  }

  if (callbackData === "start_mining_game") {
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    if (!userData.games.mining) {
      await ctx.reply(`🔴 ${ctx.t("game_cooldown")}`);
      return;
    }

    await updateGameStatus("mining", false, userData.username);
    await startMiningGame(ctx);
  }

  if (callbackData === "start_darts_game") {
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    if (!userData.games.darts) {
      await ctx.reply(`🔴 ${ctx.t("game_cooldown")}`);
      return;
    }

    await updateGameStatus("darts", false, userData.username);
    await startDartsGame(ctx);
  }

  if (callbackData === "user_wallets") {
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    await updatePage(
      ctx,
      ctx.t("user_wallets_caption", {
        bitcoin_wallet: userData.bitcoin_wallet,
        ton_wallet: userData.ton_wallet,
        trc20_wallet: userData.trc20_wallet,
      }),
      walletsInlineKeyboard(ctx),
    );
  }

  if (callbackData.startsWith("start_change_wallet")) {
    const wallet = callbackData.split("_")[3];

    await ctx.reply(`🟡 ${ctx.t("enter_new_wallet")}`);
    ctx.session.isUserChangeWallet = true;
    ctx.session.changingWallet = wallet;
  }

  if (callbackData === "withdraw") {
    await updatePage(ctx, ctx.t("withdraw_caption"), withdrawKeyboard(ctx));
  }

  if (callbackData.startsWith("withdraw_")) {
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    if (userData.balance < 50) {
      return await ctx.reply(ctx.t("insufficient_funds"));
    }

    const wallet = callbackData.split("_")[1];
    await ctx.reply(
      ctx.t("withdraw_request_created", {
        wallet: userData[`${wallet}_wallet`],
      }),
      {
        parse_mode: "HTML",
      },
    );
    ctx.session.isWithdraw = true;
  }

  if (callbackData === "language") {
    await updatePage(ctx, ctx.t("language_caption"), languageKeyboard(ctx));
  }

  if (callbackData.startsWith("language_")) {
    const language = callbackData.split("_")[1];
    await ctx.i18n.setLocale(language);
    await ctx.reply(`🟢 ${ctx.t("language_changed")}`);
  }
});

// Запуск бота
bot.launch();

// Обработка SIGINT и SIGTERM для корректного завершения работы
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
