import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../../firebaseConfig/config";
// import { showToastError} from "../utils/toasts";
import { get, ref } from "firebase/database";
import { checkIsAdmin } from "../utils/helpers";

export const handleLogin = async (email, password, toast, icon) => {
  try {
    const signUserIn = await signInWithEmailAndPassword(auth, email, password);

    const userRef = ref(db, `users/${signUserIn.user.uid}`);
    const userSnapshot = await get(userRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.val();
      if (checkIsAdmin(userData)) {
        localStorage.setItem("isAdminLogged", true);
      }
    }
    localStorage.setItem("loginStatus", true);
    localStorage.setItem("currentUserUid", auth.currentUser.uid);
    localStorage.setItem("themeStatus", true);

    window.location.pathname = "/";
  } catch (error) {
    switch (error.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        showToastError(
          toast,
          "Invalid email or password! Please check and try again!",
          icon
        );
        break;
      case "auth/network-request-failed":
        showToastError(
          toast,
          "Network request failed. Please check your internet connection and try again.",
          icon
        );
        break;
      default:
        showToastError(
          toast,
          "An error occurred during login. Please try again later.",
          icon
        );
    }
    console.error("Firebase Authentication Error:", error);
  }
};

const showToastError = (toast, message, icon) => {
  toast({
    title: "Error",
    description: message,
    status: "error",
    duration: 5000,
    isClosable: true,
  });
};

export const handleSignOut = () => {
  signOut(auth)
    .then(() => {
      localStorage.clear(); // zachistva ima li lognat user ili ne
    })
    .catch((error) => {
      alert(error);
    });
};
