import { setDoc, doc } from "firebase/firestore";
import { db } from "./index.js";

export async function addUser(username) {
  try {
    await setDoc(doc(db, "users", username), {
      name: username,
      balance: 0,
      withdrawn: 0,
    });
  } catch (e) {
    console.error("Ошибка при добавлении документа: ", e);
  }
}
