import Cookies from "js-cookie";
import { clearLogout } from "./Cache";

export const handleLoginLogout = () => {
  if (
    Cookies.get("accessToken") &&
    Cookies.get("accessToken").endsWith("=") &&
    Cookies.get("refreshToken")
  ) {
    clearLogout();
    return true;
  } else return false;
};

export const validateLogin = () => {
  if (
    Cookies.get("accessToken") === undefined ||
    Cookies.get("refreshToken") === undefined
  ) {
    clearLogout();
    return false;
  } else return true;
};
