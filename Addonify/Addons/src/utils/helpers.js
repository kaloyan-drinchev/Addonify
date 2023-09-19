export const getSlidesCount = (param) => {
  if (param === "Trending") return 5;
  if (param === "Popular") return 3;
  if (param === "Newest") return 4;
};

export const userObject = {
  avatar: "",
  creationDate: "",
  email: "",
  firstName: "",
  followers: [],
  following: [],
  isVerified: false,
  lastName: "",
  mailBox: {},
  phone: 0,
  role: ["user"],
  userID: "",
  userName: "",
};

export const changePage = (event, setCurrentPage) => {
  setCurrentPage(event.selected);
};

export const sortAddons = (sortOption, setAddons, addons) => {
  switch (sortOption) {
    case "addonnamesAZ":
      setAddons([...addons].sort((a, b) => a.name.localeCompare(b.name)));
      break;
    case "addonnamesZA":
      setAddons([...addons].sort((a, b) => b.name.localeCompare(a.name)));
      break;
    case "createDateNewToOld":
      setAddons(
        [...addons].sort(
          (a, b) => new Date(a.dateCreated) - new Date(b.dateCreated)
        )
      );
      break;
    case "createDateOldToNew":
      setAddons(
        [...addons].sort(
          (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
        )
      );
      break;
    case "downloadNumber":
      setAddons([...addons].sort((a, b) => b.downloads - a.downloads));
      break;
    case "lastUpdate":
      setAddons(
        [...addons].sort(
          (a, b) => new Date(a.lastUpdate) - new Date(b.lastUpdate)
        )
      );
      break;
    default:
      break;
  }
};

export const sortUsers = (sortOption, setAllUsers, allUsers) => {
  switch (sortOption) {
    case "usernamesAZ":
      setAllUsers(
        allUsers.sort((a, b) => a.userName.localeCompare(b.userName))
      );
      break;
    case "usernamesZA":
      setAllUsers(
        allUsers.sort((a, b) => b.userName.localeCompare(a.userName))
      );
      break;
    case "regDateNewToOld":
      setAllUsers(
        allUsers.sort(
          (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
        )
      );
      break;
    case "regDateOldToNew":
      setAllUsers(
        allUsers.sort(
          (a, b) => new Date(a.creationDate) - new Date(b.creationDate)
        )
      );
      break;
    case "firstNameAZ":
      setAllUsers(
        allUsers.sort((a, b) => a.firstName.localeCompare(b.firstName))
      );
      break;
    case "firstNameZA":
      setAllUsers(
        allUsers.sort((a, b) => b.firstName.localeCompare(a.firstName))
      );
      break;
    default:
      break;
  }
};

export const sortingUserOptions = {
  usernamesAZ: "Usernames A-Z",
  usernamesZA: "Usernames Z-A",
  regDateNewToOld: "Registration Date(newest to oldest)",
  regDateOldToNew: "Registration Date(older to newest)",
  firstNameAZ: "First name A-Z",
  firstNameZA: "First name Z-A",
};

export const checkIsAdmin = (userData) => userData?.role.includes("admin");

export const checkIsBlocked = (userData) => userData?.role.includes("blocked");
