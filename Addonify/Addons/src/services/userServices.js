import { get, ref, update } from "firebase/database";
import { updateProfile } from "firebase/auth";
import { db, storage } from "../../firebaseConfig/config";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "@firebase/storage";

export const getUserData = async () => {
  const userRef = ref(db, `users/${localStorage.getItem("currentUserUid")}`);
  const snapshot = await get(userRef);
  return snapshot.val();
};

export const getVerifiedData = async () => {
  const getRef = ref(db, "users");
  const allUsers = await get(getRef);
  const verifiedList = [];
  allUsers.forEach((user) => {
    if (user.val().isVerified) {
      verifiedList.push(user.val().userID);
    }
  });
  return verifiedList;
};

export const uploadUserAvatar = async (fileBytes, currentUser, setLoading) => {
  const fileRef = storageRef(storage, `users/${currentUser.uid}`);
  const userRef = ref(db, `users/${currentUser.uid}`);
  try {
    setLoading(true);
    const snapshot = await uploadBytes(fileRef, fileBytes);
    const avatarUrl = await getDownloadURL(fileRef);

    await update(userRef, {
      avatar: avatarUrl,
    });

    updateProfile(currentUser, { avatarURL: avatarUrl });

    setLoading(false);
    console.error(`Photo has been uploaded!`);
    alert(`Image: ${fileBytes} has been been successfully uploaded`);
  } catch (e) {
    alert(`Error while uploading photo!`);
    console.error(`Error while uploading photo: ${e}!`);
  }
};

export const getUserByHandle = (handle) => {
  return get(ref(db, `users/${handle}`));
};

export const getFollowersCount = async (
  userData,
  setFollowers,
  setFollowersProfiles
) => {
  const getRef = ref(db, `users/${userData.userID}`);
  const gatheredData = await get(getRef);
  const following = gatheredData.val().following || [];

  setFollowersProfiles(following);

  const followersPromises = following.map((e) =>
    getUserByHandle(e.userID).then((result) => {
      const user = result.val();
      const followersCount = user && user.followers ? user.followers.length : 0;
      setFollowers((followers) => [...followers, followersCount]);
    })
  );

  return Promise.all(followersPromises);
};

export const getSotedUsersByFollowers = async () => {
  const getRef = ref(db, "users");
  const collectedData = await get(getRef);
  const dataContainer = [];
  collectedData.forEach((user) => {
    if (!user.val().followers) {
      const adjustUser = {
        ...user.val(),
        followers: [],
        key: user.key,
      };
      dataContainer.push(adjustUser);
    } else {
      const adjustUser = {
        ...user.val(),
        key: user.key,
      };
      dataContainer.push(adjustUser);
    }
  });
  const result = dataContainer
    .sort((a, b) => b.followers.length - a.followers.length)
    .slice(0, 3);
  return result;
};

//// export const getFollowersCount = async(userData, setFollowers, setFollowersProfiles) => {
//   const getRef = ref(db, `users/${userData.userID}`)
//   const gatheredData = await get(getRef)
//   setFollowersProfiles(gatheredData.val().following)
//   return gatheredData.val().following && gatheredData.val().following.map((e) =>
//     getUserByHandle(e.userID).then((result) =>
//       setFollowers((followers) => [...followers, result.val()?.followers.length])
//     )
//   );
