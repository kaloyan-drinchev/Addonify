import { createContext } from "react";
import { userObject } from "./utils/helpers";

export const AppContext = createContext({
  userData: userObject,
  setUserData() {},
});
