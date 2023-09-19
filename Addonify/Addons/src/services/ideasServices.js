import {
  get,
  off,
  onValue,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { db } from "../../firebaseConfig/config";

export const getIdea = (callback) => {
  const ideasRef = ref(db, "ideas");
  onValue(ideasRef, (snapshot) => {
    const ideasData = snapshot.val();

    callback(ideasData);
  });
  return () => off(ideasRef, "value");
};

export const deleteIdea = async (ideaId) => {
  await remove(ref(db, `ideas/${ideaId}`));
};

export const addLike = async (ideaId, likes) => {
  const likesRef = ref(db, `/ideas/${ideaId}/likes`);
  await push(likesRef, likes);
};

export const sendLike = async (uid, ideaId, setAllLikes) => {
  const newLike = { author: uid, idea: ideaId, date: Date.now() };

  const userLikeRef = ref(db, `users/${uid}/likedIdeas`);
  await update(userLikeRef, { [newLike.idea]: ideaId });

  try {
    await addLike(ideaId, newLike);
    setAllLikes((prevLikes) => ({
      ...prevLikes,
      [ideaId]: newLike,
    }));
  } catch (e) {
    console.error(`Error adding new like: ${e}`);
  }
};

export const getAllLikes = async (ideaId) => {
  const likesRef = ref(db, `/ideas/${ideaId}/likes`);
  const snapshot = await get(likesRef);
  const likesData = snapshot.val();

  return likesData || [];
};

export const removeLike = async (ideaId, likeToRemove) => {
  const likesRef = ref(db, `/ideas/${ideaId}/likes`);
  const snapshot = await get(likesRef);
  const currentLikes = snapshot.val();

  const keyToRemove = Object.keys(currentLikes).find((key) => {
    return currentLikes[key].author === likeToRemove.author;
  });

  if (keyToRemove) {
    delete currentLikes[keyToRemove];
    await set(likesRef, currentLikes);
  }
};

export const sendRemoveLike = async (ideaId, like, setAllLikes) => {
  try {
    await removeLike(ideaId, like);
    const updatedLikes = await getAllLikes(ideaId);
    setAllLikes(updatedLikes);
  } catch (e) {
    console.error(`Error while removing like: ${e}`);
  }
};