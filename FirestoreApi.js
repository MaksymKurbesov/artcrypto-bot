import {
  setDoc,
  doc,
  increment,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { db } from "./index.js";
import { getUserData } from "./helpers.js";

export async function addUser(username) {
  try {
    const userData = {
      balance: 0,
      bitcoin_wallet: "",
      dailyReward: true,
      games: {
        basketball: false,
        darts: false,
        mining: false,
        football: false,
      },
      referrals: 0,
      ton_wallet: "",
      trc20_wallet: "",
      username,
      withdrawn: 0,
    };

    await setDoc(doc(db, "users", username), userData);

    return userData;
  } catch (e) {
    console.error("Ошибка при добавлении документа: ", e);
  }
}

export async function getTasks() {
  const tasksDoc = doc(db, "tasks", "tasks");
  const tasks = await getDoc(tasksDoc);

  return tasks.data();
}

export async function checkTaskStatus(id, username) {
  const userData = await getUserData(username);
  const tasks = userData.tasks;
  const task = tasks.find((task) => task.id === id);

  if (task) {
    return task.completed;
  } else {
    return false;
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

export async function completeTask(id, username) {
  try {
    await updateDoc(doc(db, "users", username), {
      tasks: arrayUnion({ id, completed: true }),
    });
  } catch (e) {
    console.error("Ошибка при выполнение задачи пользователю: ", e);
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
