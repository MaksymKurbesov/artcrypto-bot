import { setDoc, doc, increment, updateDoc } from "firebase/firestore";
import { db } from "./index.js";

export async function addUser(username) {
  try {
    await setDoc(doc(db, "users", username), {
      username,
      balance: 0,
      withdrawn: 0,
      bitcoin_wallet: "",
      ton_wallet: "",
      trc20_wallet: "",
    });
  } catch (e) {
    console.error("Ошибка при добавлении документа: ", e);
  }
}

export async function changeUserWallet(wallet, walletNumber, username) {
  try {
    await updateDoc(doc(db, "users", username), {
      [`${wallet}_wallet`]: walletNumber,
    });
  } catch (e) {
    console.error("Ошибка при добавлении документа: ", e);
  }
}

export async function addMoneyToUser(amount, username) {
  try {
    await updateDoc(doc(db, "users", username), {
      balance: increment(amount),
    });
  } catch (e) {
    console.error("Ошибка при добавлении документа: ", e);
  }
}
