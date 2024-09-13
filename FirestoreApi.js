import { setDoc, doc, increment, updateDoc } from "firebase/firestore";
import { db } from "./index.js";

export async function addUser(username) {
  try {
    const userData = {
      username,
      balance: 0,
      withdrawn: 0,
      bitcoin_wallet: "",
      ton_wallet: "",
      trc20_wallet: "",
      games: {
        basketball: true,
        darts: true,
        mining: true,
      },
      referrals: 0,
    };

    await setDoc(doc(db, "users", username), userData);

    return userData;
  } catch (e) {
    console.error("Ошибка при добавлении документа: ", e);
  }
}

export async function updateGameStatus(game, status, username) {
  try {
    await updateDoc(doc(db, "users", username), {
      [`games.${game}`]: status,
    });
  } catch (e) {
    console.error("Ошибка при изменение статуса игры: ", e);
  }
}

export async function changeUserWallet(wallet, walletNumber, username) {
  try {
    await updateDoc(doc(db, "users", username), {
      [`${wallet}_wallet`]: walletNumber,
    });
  } catch (e) {
    console.error("Ошибка при изменение кошелька: ", e);
  }
}

export async function addMoneyToUser(amount, username) {
  try {
    await updateDoc(doc(db, "users", username), {
      balance: increment(amount),
    });
  } catch (e) {
    console.error("Ошибка при добавлении денег пользователю: ", e);
  }
}

export async function updateDailyRewardStatus(status, username) {
  try {
    await updateDoc(doc(db, "users", username), {
      dailyReward: status,
    });
  } catch (e) {
    console.error("Ошибка при добавлении денег пользователю: ", e);
  }
}

export async function addReferralToUser(username) {
  try {
    await updateDoc(doc(db, "users", username), {
      referrals: increment(1),
    });
  } catch (e) {
    console.error("Ошибка при добавлении пользователя в рефералы: ", e);
  }
}
