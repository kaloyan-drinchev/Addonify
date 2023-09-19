import { get, ref } from "firebase/database";
import { db } from "../../firebaseConfig/config";

export const getStatisticsData = async (
  setDownloadsCount,
  setUserApprovedAddons,
  setUserPendingAddons,
  setUserRejectedAddons,
  setRatesCount,
  setAddonRateData,
  setAverageRateValue
) => {
  const getRef = ref(db, `add-ons`);
  const snapshot = await get(getRef);
  const approvedAddons = [];
  const pendingAddons = [];
  const rejectedAddons = [];
  let totalDownloadData = 0;
  const IDs = [];
  snapshot.forEach((addon) => {
    if (
      addon.val().approvalStatus === "approved" &&
      addon.val().authorUID === localStorage.getItem("currentUserUid")
    ) {
      const adjustAddon = {
        ...addon.val(),
        key: addon.key,
      };
      IDs.push(addon.key);
      approvedAddons.push(adjustAddon);
      totalDownloadData += addon.val().downloads;
    }
    if (
      addon.val().approvalStatus === "pending" &&
      addon.val().authorUID === localStorage.getItem("currentUserUid")
    ) {
      const adjustAddon = {
        ...addon.val(),
        key: addon.key,
      };
      pendingAddons.push(adjustAddon);
    }
    if (
      addon.val().approvalStatus === "rejected" &&
      addon.val().authorUID === localStorage.getItem("currentUserUid")
    ) {
      const adjustAddon = {
        ...addon.val(),
        key: addon.key,
      };
      rejectedAddons.push(adjustAddon);
    }
  });
  setDownloadsCount(totalDownloadData);
  setUserApprovedAddons(
    approvedAddons?.sort((a, b) => b.downloads - a.downloads).slice(0, 3)
  );
  setUserPendingAddons(
    pendingAddons?.sort(
      (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
    )
  );
  setUserRejectedAddons(
    rejectedAddons?.sort(
      (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
    )
  );
  const getRateRef = ref(db, "rates");
  const gatherRates = await get(getRateRef);
  const collectData = [];
  const rateValues = [];
  let totalRatesData = 0;
  gatherRates.forEach((rate) => {
    if (IDs.includes(rate.key)) {
      let currentAverage = 0;
      totalRatesData += rate.val().rater.length;
      rate.val().rater.forEach((rate) => {
        rateValues.push(rate.value);
        currentAverage += rate.value;
      });
      const adjustRate = {
        ...rate.val(),
        key: rate.key,
        average: currentAverage / rate.val().rater.length,
      };
      collectData.push(adjustRate);
    }
  });
  setRatesCount(totalRatesData);
  setAddonRateData(
    collectData?.sort((a, b) => b.average - a.average).slice(0, 3)
  );
  let averageScore = 0;
  rateValues.forEach((value) => {
    averageScore += value;
  });
  setAverageRateValue((averageScore / rateValues.length).toFixed(2));
};
