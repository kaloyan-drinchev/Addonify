import {
  equalTo,
  get,
  orderByChild,
  query,
  ref,
  update,
} from "firebase/database";
import { db } from "../../firebaseConfig/config";

export const getPendingAddons = async () => {
  const listWithAddons = [];
  const getRef = ref(db, "add-ons");
  const data = await get(getRef);
  data.forEach((addon) => {
    const penAddon = addon.val();
    penAddon.key = addon.key;
    if (penAddon.approvalStatus === "pending") {
      listWithAddons.push(penAddon);
    }
  });
  return listWithAddons;
};

export const getAllAddons = async () => {
  const allAddons = [];
  const addons = await get(ref(db, "add-ons"));
  addons.forEach((addon) => {
    const adjustAddon = addon.val();
    adjustAddon.key = addon.key;
    if (adjustAddon.approvalStatus === "approved") {
      allAddons.push(adjustAddon);
    }
  });
  return allAddons;
};

export const getSortedAddons = async () => {
  const allAddons = [];
  const addons = await get(ref(db, "add-ons"));
  addons.forEach((addon) => {
    const adjustAddon = addon.val();
    adjustAddon.key = addon.key;
    if (adjustAddon.approvalStatus === "approved") {
      allAddons.push(adjustAddon);
    }
  });
  const getTrending = allAddons.filter((addon) => addon.trending);
  const getPopular = [...allAddons].sort((a, b) => b.downloads - a.downloads);
  const getNewest = [...allAddons].sort(
    (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
  );
  return { Trending: getTrending, Popular: getPopular, Newest: getNewest };
};

export const getAddonsIdByUsername = async (username) => {
  const snapshot = await get(
    query(ref(db, "add-ons"), orderByChild("authorUsername"), equalTo(username))
  );
  if (!snapshot.exists()) return [];
  return Object.keys(snapshot.val());
};

export const getAddonsByUsername = async (username) => {
  const snapshot = await get(
    query(ref(db, "add-ons"), orderByChild("authorUsername"), equalTo(username))
  );
  if (!snapshot.exists()) return [];
  const allAddons = [];
  snapshot.forEach((addon) => {
    const adjustAddon = addon.val();
    adjustAddon.key = addon.key;
    if (adjustAddon.approvalStatus === "approved") {
      allAddons.push(adjustAddon);
    }
  });
  return allAddons;
};

export const changeAddonStatus = async (addonID, isApproved) => {
  const userRef = ref(db, `add-ons/${addonID}`);
  await update(userRef, {
    approvalStatus: isApproved ? "approved" : "rejected",
  });
};

export const getAddon = async (addonID) => {
  const getRef = ref(db, `add-ons/${addonID}`);
  const addon = await get(getRef);
  return addon.val();
};

export const getAddonAuthor = async (addonID) => {
  const getRef = ref(db, `users/${addonID.authorUID}`);
  const currUser = await get(getRef);
  return currUser.val();
};

export const getGitData = async (addonID, callback) => {
  const authToken = "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";
  try {
    const headers = {
      Authorization: `token ${authToken}`,
    };

    const repoInfoResponse = await fetch(addonID.GitHubInformation?.fetchLink, {
      headers,
    });
    const getRepoInfo = await repoInfoResponse.json();

    const pullCountResponse = await fetch(
      `${addonID.GitHubInformation.pullCountLink}`,
      {
        headers,
      }
    );
    const getRepoPullsCount = await pullCountResponse.json();

    const readmeResponse = await fetch(
      `${addonID.GitHubInformation.fetchLink}/contents/README.md`,
      {
        headers,
      }
    );
    const getReadMe = await readmeResponse.json();

    callback(getReadMe.content);

    return {
      readMe: getReadMe.content,
      repositoryLink: getRepoInfo.html_url,
      lastUpdate: new Date(getRepoInfo.updated_at).toLocaleString(),
      openIssues: getRepoInfo.open_issues_count,
      pullsCount: getRepoPullsCount.length,
      language: getRepoInfo.language,
    };
  } catch (error) {
    return null;
  }
};

export const getAddonRating = async (addonID, setReview, setReviewCount) => {
  const userRef = ref(db, `rates/${addonID}`);
  const addon = await get(userRef);
  const ratingValue = addon.val() && addon.val().rater;
  const allValues =
    ratingValue &&
    ratingValue.reduce((acc, currVal) => {
      return acc + currVal.value;
    }, 0);
  allValues && setReview(allValues / ratingValue.length);
  allValues && setReviewCount(ratingValue.length);
};

export const getAddonByID = async (addonID) => {
  const userRef = ref(db, `add-ons/${addonID.key}`);
  const addon = await get(userRef);
  return addon.val();
};

export const getAddonData = async () => {
  const getRef = ref(db, `users/${localStorage.getItem("currentUserUid")}`);
  const snapshot = await get(getRef);
  const gatherUIDs = [];
  if (snapshot.val().following) {
    snapshot.val().following.forEach((element) => {
      gatherUIDs.push(element.userID);
    })}
  const getAddons = [];
  const getAddonsRef = ref(db, `add-ons`);
  const AddonsSnapshot = await get(getAddonsRef);
  AddonsSnapshot.forEach((addon) => {
    if (
      gatherUIDs.includes(addon.val().authorUID) &&
      addon.val().approvalStatus === "approved"
    ) {
      const adjustAddon = {
        ...addon.val(),
        key: addon.key,
      };
      getAddons.push(adjustAddon);
    }
  });

  return [...getAddons].sort(
    (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
  );
};

export const getSortedAddonsByDownloads = async () => {
  const getRef = ref(db, "add-ons");
  const gatherData = await get(getRef);
  const collectedData = [];
  gatherData.forEach((addon) => {
    if (addon.val().approvalStatus === "approved") {
      const adjustedAddon = {
        ...addon.val(),
        key: addon.key,
      };
      collectedData.push(adjustedAddon);
    }
  });
  const result = collectedData
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 3);
  return result;
};
