import Cookies from "js-cookie";

const secondsIn1Minute = 60;
const millisecondsIn1Second = 1000;
const loginCookiesExpiryTimeInDays = 7;
const expiryTimeInMinutes = 15;

const trackerKey = "priceTracker_trackers";

const handleLogoutCookies = [
  "accessToken",
  "refreshToken",
  "profileName",
  "profileImage",
];
const handleLogoutStorage = [trackerKey];

export const setLoginCookies = (cookiesList) => {
  for (const [key, value] of Object.entries(cookiesList)) {
    Cookies.set(key, value, {
      expires: loginCookiesExpiryTimeInDays,
      path: "",
    });
  }
};

export const clearLogout = () => {
  handleLogoutCookies.forEach((element) => {
    Cookies.remove(element);
  });

  handleLogoutStorage.forEach((element) => {
    localStorage.removeItem(element);
  });
};

export const removeTrackerStorage = () => {
  handleLogoutStorage.forEach((element) => {
    localStorage.removeItem(element);
  });
};

export const addTracker = (key, value) => {
  const now = new Date();

  const item = {
    value: value,
    expiry:
      now.getTime() +
      expiryTimeInMinutes * secondsIn1Minute * millisecondsIn1Second,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getTracker = (key) => {
  let data = null;
  if (
    localStorage.getItem(key) != null &&
    localStorage.getItem(key) !== undefined
  ) {
    let trackerList = localStorage.getItem(key);
    const item = JSON.parse(trackerList);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
    } else {
      data = item.value;
    }
    return data;
  }
};
