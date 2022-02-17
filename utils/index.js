import Router from "next/router";
import { logout } from "@actions";
import * as t from "@consts";

export const isAuth = () => {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("vip-user")) {
      return JSON.parse(localStorage.getItem("vip-user"));
    } else {
      return false;
    }
  }
};

export const handleServerError = (error, noRedirect) => {
  if (!error)
    return { error: `Unknown error, please report this case to us! 😥` };
  if (`${error}` === "TypeError: Failed to fetch") {
    return {
      error: `Oops! Our server is currently unresponsive or under maintenance, please try again later!`,
    };
  } else if (`${error}` === "Error: Request failed with status code 401") {
    handleResponse({ status: 401 }, noRedirect);
    return { error: "Unauthorized, please login again!" };
  } else if (`${error}` === "Error: Request failed with status code 400") {
    return { error: error.response.data.error };
  } else {
    return { error: `${error}` };
  }
};

export const handleResponse = (res, noRedirect) => {
  if (res.status === 401) {
    if (!noRedirect) {
      logout(() =>
        Router.push({
          pathname: "/login",
          query: {
            message: "Your session is expire. Please sign in!",
          },
        })
      );
    }
    return "true";
  } else {
    return;
  }
};

export const handleCommonResponse = (res, options = {}) => {
  if (!res) {
    return {};
  } else {
    const {
      onRedirect = () => {},
      onError = () => {},
      onSuccess = () => {},
    } = options;
  
    const isRedirect = handleResponse(res) === "true";
    if (isRedirect) {
      if (onRedirect) {
        onRedirect();
      }
      return {};
    } else {
      const data = res.data;
      if (data?.error) {
        if (onError) {
          onError(data.error);
        }
        return { error: data.error };
      }
      if (onSuccess) {
        onSuccess(data);
      }
      return data;
    }
  }
};

export const getRandomNumberInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getSizeImage = async (link, callback) => {
  const data = await toDataURL(link);
  return new Promise((resolve, reject) => {
    const newImg = new window.Image();
    newImg.src = data;
    newImg.onload = function () {
      if (callback) {
        console.log({
          width: this.width,
          height: this.height,
        })
        callback({
          width: this.width,
          height: this.height,
        });
        resolve();
      }
    };
  });
};

export const toDataURL = async (url) => {
  return fetch(url)
    .then((response) => {
      return response.blob();
    })
    .then((blob) => {
      return URL.createObjectURL(blob);
    });
};