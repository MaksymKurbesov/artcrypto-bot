import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import {
  generatePage,
  generateTaskButtons,
  getSlotSymbols,
  isUserInChat,
  updatePage,
} from "./helpers.js";
import {
  dartsGameCaption,
  gameZoneCaption,
  languageCaption,
  languageKeyboard,
  miningGameCaption,
  startCaption,
  startInlineKeyboard,
  walletsInlineKeyboard,
  withdrawCaption,
  withdrawKeyboard,
} from "./consts.js";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, getDoc } from "firebase/firestore";
import { addUser, changeUserWallet } from "./FirestoreApi.js";
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
  const formattedCaption = ctx
    .t("main_menu_caption", { balance: "0" })
    .replace(/\\n/g, "\n");

  if (!userDoc.exists) {
    await addUser(username);
  }

  generatePage(ctx, formattedCaption, startInlineKeyboard(userData.id, ctx));

  const payload = ctx.payload.split("=")[1];

  console.log(payload, "payload");
});

bot.action(/page_(\d+)/, (ctx) => {
  const page = parseInt(ctx.match[1], 10);
  ctx.answerCbQuery();
  ctx.editMessageReplyMarkup(generateTaskButtons(page).reply_markup);
});

bot.on(message("text"), async (ctx) => {
  const text = ctx.update.message.text;
  const username = ctx.update.message.from.username;
  const wallet = ctx.session.changingWallet;

  if (ctx.session.isUserChangeWallet) {
    await changeUserWallet(wallet, text, username);
    ctx.reply("🟢 Кошелёк успешно изменён!");
    console.log(ctx.session.changingWallet, "ctx.session.changingWallet");
    ctx.session.isUserChangeWallet = false;
  }

  if (ctx.session.isWithdraw) {
    ctx.reply("🟢 Заявка на вывод успешно отправлена!");
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

  await ctx.answerCbQuery();

  if (ctx.session.isMining) {
    return await ctx.answerCbQuery();
  }

  if (callbackData === "main_page") {
    ctx.session.isMining = false;
    const username = ctx.update.callback_query.from.username;
    const userRef = doc(db, "users", username);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    const formattedCaption = ctx
      .t("main_menu_caption", { balance: "0" })
      .replace(/\\n/g, "\n");

    await updatePage(
      ctx,
      formattedCaption,
      startInlineKeyboard(userData.id, ctx),
    );
  }

  if (callbackData === "gamezone") {
    await updatePage(ctx, gameZoneCaption, [
      [
        { text: "Майнинг ⛏️", callback_data: "mining_game" },
        { text: "Дартс 🎯", callback_data: "darts_game" },
        { text: "Баскетбол 🏀", callback_data: "basketball_game" },
      ],
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

  if (callbackData === "mining_game") {
    await updatePage(ctx, miningGameCaption, [
      [{ text: "Начать поиск блока ✅", callback_data: "start_mining_game" }],
      [{ text: "Назад ⬅️", callback_data: "gamezone" }],
    ]);
  }

  if (callbackData === "darts_game") {
    await updatePage(ctx, dartsGameCaption, [
      [{ text: "Метнуть дротик 🎯", callback_data: "start_darts_game" }],
      [{ text: "Назад ⬅️", callback_data: "gamezone" }],
    ]);
  }

  if (callbackData === "start_mining_game") {
    await startMiningGame(ctx);
  }

  if (callbackData === "start_darts_game") {
    await startDartsGame(ctx);
  }

  if (callbackData === "user_wallets") {
    const username = ctx.update.callback_query.from.username;
    const userRef = doc(db, "users", username);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    await updatePage(
      ctx,
      `<b>CRYPTO APATE BOT -> Кошельки</b>\n\nУкажите номер кошелька для вывода средств. Пожалуйста, проверьте корректность данных, чтобы избежать ошибок при переводе.\n\n<b>BITCOIN:</b> ${userData.bitcoin_wallet}\n<b>TON:</b> ${userData.ton_wallet}\n<b>TRC20:</b> ${userData.trc20_wallet}`,
      walletsInlineKeyboard(ctx),
    );
  }

  if (callbackData.startsWith("start_change_wallet")) {
    const wallet = callbackData.split("_")[3];

    await ctx.reply("🟡 Укажите ваш новый номер кошелька");
    ctx.session.isUserChangeWallet = true;
    ctx.session.changingWallet = wallet;
  }

  if (callbackData === "withdraw") {
    await updatePage(ctx, withdrawCaption, withdrawKeyboard(ctx));
  }

  if (callbackData.startsWith("withdraw_")) {
    const username = ctx.update.callback_query.from.username;
    const userRef = doc(db, "users", username);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    const wallet = callbackData.split("_")[1];
    await ctx.reply(
      `🟡 <b>Заявка на вывод успешно создана!</b>\n\nТеперь <b>укажите сумму</b>, которую хотите вывести, и ваша заявка будет полностью оформлена. После этого ваши BTC будут отправлены на указанный кошелек в ближайшее время.\n\nНомер вашего кошелька:\n<code>${userData[`${wallet}_wallet`]}</code>`,
      {
        parse_mode: "HTML",
      },
    );
    ctx.session.isWithdraw = true;
  }

  if (callbackData === "language") {
    await updatePage(ctx, languageCaption, languageKeyboard(ctx));
  }

  if (callbackData.startsWith("language_")) {
    const language = callbackData.split("_")[1];
    await ctx.i18n.setLocale(language);
    await ctx.reply("🟢 Язык успешно изменён!");
  }
});

// Запуск бота
bot.launch();

// Обработка SIGINT и SIGTERM для корректного завершения работы
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
