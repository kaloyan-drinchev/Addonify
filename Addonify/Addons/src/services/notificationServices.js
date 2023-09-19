import { ref, push, get } from "firebase/database";
import { db } from "../../firebaseConfig/config";

export async function notificationProps(action, user, author, link) {
  if (!author) {
    console.error("currentUserUid is not set in localStorage");
    return;
  }
  const addonRef = ref(db, `users/${author}/mailBox`);
  try {
    const mails = await get(addonRef);
    const prevMails = mails.val();
    if (prevMails === null || prevMails === undefined) {
      console.error("prevMails is null or undefined");
      return;
    }
    const newMail = {
      user: user.userName,
      action: action,
      img: user.avatar,
      date: new Date().toDateString(),
      addon: link,
    };
    push(addonRef, newMail);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
