import Cookies from "js-cookie";

// funkcija za brisanje svih kolačića
const clearAllCookies = () => {
  const allCookies = Cookies.get(); // Dobijemo sve kolačiće

  // Iteriramo kroz sve kolačiće i brišemo ih
  Object.keys(allCookies).forEach((cookieName) => {
    Cookies.remove(cookieName, { path: "/" });
  });

};


export default clearAllCookies;