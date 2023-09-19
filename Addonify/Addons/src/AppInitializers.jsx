import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig/config";
import { useContext, useEffect, useState } from "react";
import { userObject } from "./utils/helpers";
import { getUserByHandle, getVerifiedData } from "./services/userServices";
import { AppContext } from "./AppContext";
import { node } from "prop-types";

const AppInitializers = ({ children }) => {
  const [userData, setUserData] = useState(userObject);
  const [verifiedData, setVerifiedData] = useState([]);
  let [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user === null) return;
    getUserByHandle(user.uid)
      .then((snapshot) => {
        if (!snapshot.exists()) return;
        setUserData(snapshot.val());
      })
      .catch((e) => alert(e.message));
    getVerifiedData().then(setVerifiedData);
  }, [user]);

  return (
    <AppContext.Provider
      value={{ user, userData, setUserData, verifiedData, loading }}
    >
      {loading && <h6>Loading</h6>}
      {children}
    </AppContext.Provider>
  );
};
export default AppInitializers;

AppInitializers.propTypes = {
  children: node,
};

export const useUserContext = () => {
  return useContext(AppContext);
};
