export const isAuth = () => {
  if (typeof window !== 'undefined') {
    if (localStorage.getItem("vip-user")) {
      return JSON.parse(localStorage.getItem("vip-user"));
    } else {
      return false;
    }
  }
};
