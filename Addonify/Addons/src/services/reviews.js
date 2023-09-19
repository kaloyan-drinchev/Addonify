import {
  off,
  onValue,
  push,
  ref,
  remove,
  get,
  child,
} from "firebase/database";
import { db } from "../../firebaseConfig/config";

export const addReview = async (currAddonID, review) => {
  const reviewsRef = ref(db, `/add-ons/${currAddonID}/reviews`);
  const snapshot = await get(reviewsRef);

  if (snapshot.exists()) {
    const reviewsData = snapshot.val();
    const existingReviewKey = Object.keys(reviewsData).find(
      (key) => reviewsData[key].authorId === review.authorId
    );

    if (existingReviewKey) {
      const existingReviewRef = child(reviewsRef, existingReviewKey);
      await remove(existingReviewRef);
    }
  }
  await push(reviewsRef, review);
};

export const getAllReviews = (currAddonID, callback) => {
  const reviewRef = ref(db, `/add-ons/${currAddonID}/reviews`);
  onValue(reviewRef, (snapshot) => {
    const reviewData = snapshot.val();
    callback(reviewData);
  });
  return () => off(reviewRef, "value");
};

export const deleteReview = async (currAddonID, reviewID) => {
  await remove(ref(db, `add-ons/${currAddonID}/reviews/${reviewID}`));
};
