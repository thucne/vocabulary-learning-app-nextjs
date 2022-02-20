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
  } else {
    return false;
  }
};

export const getJWT = () => {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("vip-token")) {
      return JSON.parse(localStorage.getItem("vip-token"));
    } else {
      return false;
    }
  } else {
    return false;
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
  } else if (`${error}` === "Error: Request failed with status code 500") {
    return { error: `Internal Server Error` };
  } else {
    return { error: `Internal Server Error` };
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

export const validateEmail = (email) => {
  if (!email || email.length === 0) return false;
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const validatePassword = (password) => {
  return String(password).match(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  );
};

export const isValidHttpUrl = (string, canBeEmtyOrNull = false) => {
  if (
    canBeEmtyOrNull &&
    (!string || string === "" || string === null || string === undefined)
  ) {
    return true;
  }

  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};

export function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 50,
      height: 50,
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export const convertString2Array = (str) =>
  str === "" ? [] : str.split(",").map((item) => item.trim());
