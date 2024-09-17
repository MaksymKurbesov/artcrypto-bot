import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import {
  generatePage,
  generateReward,
  generateTaskButtons,
  getCloseButton,
  getSlotSymbols,
  inDollar,
  isUserInChat,
  updatePage,
} from "./helpers.js";
import {
  gameZoneKeyboard,
  languageKeyboard,
  REFERRAL_REWARD,
  startInlineKeyboard,
  TASK_REWARD_BY_TYPE_MAP,
  walletsInlineKeyboard,
  withdrawKeyboard,
} from "./consts.js";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, getDoc } from "firebase/firestore";
import {
  addMoneyToUser,
  addReferralToUser,
  addUser,
  changeUserWallet,
  updateDailyRewardStatus,
  updateGameStatus,
} from "./FirestoreApi.js";
import { startMiningGame } from "./games/mining-game.js";
import { startDartsGame } from "./games/darts-game.js";
import { firebaseConfig } from "./firebase.config.js";
import { I18n } from "@grammyjs/i18n";
import { startBasketballGame } from "./games/basketball-game.js";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const bot = new Telegraf("7249494538:AAFTyrQvUKj9yqS7JFFgIWhyHNJ4xwwX-yI"); // prod
// const bot = new Telegraf("7427158827:AAHweRtzXbYUW0K_iwFPSNNMXCzMBlxmMiE"); // dev

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

bot.action(/page_(\d+)/, (ctx) => {
  const page = parseInt(ctx.match[1], 10);
  ctx.answerCbQuery();
  ctx.editMessageReplyMarkup(generateTaskButtons(ctx, page).reply_markup);
});

export const BITCOIN_CURRENCY_EXCHANGE = 58471.09;

bot.command(["start", "menu"], async (ctx) => {
  const username = ctx.update.message.from.username;
  const userRef = await doc(db, "users", username);
  const userDoc = await getDoc(userRef);

  let userBalance;
  let userWithdrawn;
  let userReferrals;

  if (!userDoc.exists()) {
    const user = await addUser(username);

    userBalance = user.balance.toFixed(6);
    userWithdrawn = user.withdrawn.toFixed(6);
    userReferrals = user.referrals;
  } else {
    const userData = userDoc.data();
    userBalance = userData.balance.toFixed(6);
    userWithdrawn = userData.withdrawn.toFixed(6);
    userReferrals = userData.referrals;
  }

  generatePage(
    ctx,
    ctx.t("main_menu_caption", {
      username: username,
      balance: userBalance,
      dollarBalance: inDollar(userBalance),
      dollarWithdrawn: inDollar(userWithdrawn),
      withdrawn: userWithdrawn,
      referrals: userReferrals,
    }),
    startInlineKeyboard(username, ctx),
  );

  const referralNickname = ctx.payload;

  if (referralNickname) {
    await addReferralToUser(referralNickname);
    await addMoneyToUser(REFERRAL_REWARD, referralNickname);
  }
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
  try {
    const callbackData = ctx.callbackQuery.data;
    const username = ctx.update.callback_query.from.username;
    const userRef = doc(db, "users", username);

    if (ctx.session.isMining) {
      return;
    }

    if (callbackData === "main_page") {
      ctx.session.isMining = false;
      ctx.session.isWithdraw = false;

      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      const userBalance = userData.balance.toFixed(6);
      const userWithdrawn = userData.withdrawn.toFixed(6);
      const userReferrals = userData.referrals;

      await updatePage(
        ctx,
        ctx.t("main_menu_caption", {
          username: username,
          balance: userBalance,
          dollarBalance: inDollar(userBalance),
          withdrawn: userWithdrawn,
          dollarWithdrawn: inDollar(userWithdrawn),
          referrals: userReferrals,
        }),
        startInlineKeyboard(userData.username, ctx),
      );
    }

    if (callbackData === "gamezone") {
      await updatePage(ctx, ctx.t("gamezone_caption"), gameZoneKeyboard(ctx));
    }

    if (callbackData === "tasks_page") {
      await updatePage(
        ctx,
        `<b>CRYPTO QUEST -> ${ctx.t("tasks")}</b>`,
        generateTaskButtons(ctx).reply_markup.inline_keyboard,
      );
    }

    if (callbackData.startsWith("send_task")) {
      const taskDescription = callbackData.split("_")[2];
      const taskLink = callbackData.split("__")[1];
      const taskType = taskDescription.split(":")[1].trim();
      const reward = TASK_REWARD_BY_TYPE_MAP[taskType].toFixed(6);

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
    }

    if (callbackData === "subscribed") {
      if (!ctx.session.isUserSubscribed) {
        await ctx.reply(ctx.t("no_subscribe"), {
          reply_markup: {
            inline_keyboard: [[getCloseButton(ctx)]],
          },
        });
        return ctx.answerCbQuery();
      }

      const message = ctx.update.callback_query.message;
      console.log(message, "message");

      await addMoneyToUser(ctx.session.taskReward, message.chat.username);
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
    }

    if (callbackData === "delete_message") {
      const message = ctx.update.callback_query.message;
      await ctx.deleteMessage(message.message_id);
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

    if (callbackData === "basketball_game") {
      await updatePage(ctx, ctx.t("basketball_game_caption"), [
        [
          {
            text: `${ctx.t("throw_ball")} 🏀`,
            callback_data: "start_basketball_game",
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
      ctx.session.isMining = false;
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

    if (callbackData === "start_basketball_game") {
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      if (!userData.games.basketball) {
        await ctx.reply(`🔴 ${ctx.t("game_cooldown")}`);
        return ctx.answerCbQuery();
      }

      await updateGameStatus("basketball", false, userData.username);
      await startBasketballGame(ctx);
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

    if (callbackData === "referrals") {
      await updatePage(
        ctx,
        ctx.t("referrals_caption", {
          reward: REFERRAL_REWARD.toFixed(6),
          dollarReward: REFERRAL_REWARD * BITCOIN_CURRENCY_EXCHANGE.toFixed(2),
        }),
        [
          [
            {
              text: ctx.t("invite_friends"),
              url: `https://t.me/share/url?text=${ctx.t("referral_message")}&url=https://t.me/cryptoapatebot/?start=${username}`,
            },
          ],
          [{ text: `${ctx.t("main_menu")} 🏠`, callback_data: "main_page" }],
        ],
      );
    }

    if (callbackData === "daily_reward") {
      await updatePage(ctx, ctx.t("daily_reward_caption"), [
        [
          {
            text: `${ctx.t("get_daily_reward")} 🎁`,
            callback_data: "get_daily_reward",
          },
        ],
        [{ text: `${ctx.t("main_menu")} 🏠`, callback_data: "main_page" }],
      ]);
    }

    if (callbackData === "get_daily_reward") {
      const reward = generateReward();
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      if (!userData.dailyReward) {
        await ctx.reply(ctx.t("daily_reward_received"), {
          reply_markup: {
            inline_keyboard: [[getCloseButton(ctx)]],
          },
        });
        return ctx.answerCbQuery();
      }

      await ctx.reply(
        ctx.t("daily_reward_message", {
          reward: reward,
          dollarReward: inDollar(reward),
        }),
        {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [[getCloseButton(ctx)]],
          },
        },
      );
      await addMoneyToUser(reward, username);
      await updateDailyRewardStatus(false, username);
    }

    await ctx.answerCbQuery();
  } catch (e) {
    console.log(e, "error");
  }
});

// Запуск бота
bot.launch();

// Обработка SIGINT и SIGTERM для корректного завершения работы
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
