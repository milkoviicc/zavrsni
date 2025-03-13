import Cookies from "js-cookie";

const clearAllCookies = () => {
  const allCookies = Cookies.get(); // Get all cookies

  Object.keys(allCookies).forEach((cookieName) => {
    Cookies.remove(cookieName, { path: "/" });
  });

};


export default clearAllCookies;