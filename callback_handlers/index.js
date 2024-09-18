import { MainPage } from "./main_page.js";
import { Gamezone } from "./gamezone.js";
import { Tasks } from "./tasks.js";
import { subscribed } from "./subscribed.js";
import { deleteMessage } from "./delete_message.js";
import { miningGame } from "./mining_game.js";
import { dartsGame } from "./darts_game.js";
import { basketballGame } from "./basketball_game.js";
import { StartMiningGame } from "./start_mining_game.js";
import { StartDartsGame } from "./start_darts_game.js";
import { StartBasketballGame } from "./start_basketball_game.js";
import { UserWallets } from "./user_wallets.js";
import { Withdraw } from "./withdraw.js";
import { Language } from "./language.js";
import { Referrals } from "./referrals.js";
import { DailyReward } from "./daily_reward.js";
import { GetDailyReward } from "./get_daily_reward.js";
import { sendTask } from "./send_task.js";
import { startChangeWallet } from "./start_change_wallet.js";
import { ConfirmWithdraw } from "./confirm_withdraw.js";
import { changeLanguage } from "./change_language.js";
import { footballGame } from "./football_game.js";
import { StartFootballGame } from "./start_football_game.js";

export const callbackHandlers = [
  // Точные соответствия
  {
    check: (data) => data === "main_page",
    handler: MainPage,
  },
  {
    check: (data) => data === "gamezone",
    handler: Gamezone,
  },
  {
    check: (data) => data === "tasks_page",
    handler: Tasks,
  },
  {
    check: (data) => data === "subscribed",
    handler: subscribed,
  },
  {
    check: (data) => data === "delete_message",
    handler: deleteMessage,
  },
  {
    check: (data) => data === "mining_game",
    handler: miningGame,
  },
  {
    check: (data) => data === "darts_game",
    handler: dartsGame,
  },
  {
    check: (data) => data === "basketball_game",
    handler: basketballGame,
  },
  {
    check: (data) => data === "football_game",
    handler: footballGame,
  },
  {
    check: (data) => data === "start_mining_game",
    handler: StartMiningGame,
  },
  {
    check: (data) => data === "start_darts_game",
    handler: StartDartsGame,
  },
  {
    check: (data) => data === "start_basketball_game",
    handler: StartBasketballGame,
  },
  {
    check: (data) => data === "start_football_game",
    handler: StartFootballGame,
  },
  {
    check: (data) => data === "user_wallets",
    handler: UserWallets,
  },
  {
    check: (data) => data === "withdraw",
    handler: Withdraw,
  },
  {
    check: (data) => data === "language",
    handler: Language,
  },
  {
    check: (data) => data === "referrals",
    handler: Referrals,
  },
  {
    check: (data) => data === "daily_reward",
    handler: DailyReward,
  },
  {
    check: (data) => data === "get_daily_reward",
    handler: GetDailyReward,
  },
  // Обработчики с префиксами
  {
    check: (data) => data.startsWith("send_task_id"),
    handler: sendTask,
  },
  {
    check: (data) => data.startsWith("start_change_wallet"),
    handler: startChangeWallet,
  },
  {
    check: (data) => data.startsWith("withdraw_"),
    handler: ConfirmWithdraw,
  },
  {
    check: (data) => data.startsWith("language_"),
    handler: changeLanguage,
  },
];
