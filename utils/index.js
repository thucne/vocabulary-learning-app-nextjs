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

export const adhocFetch = (ins) => {
  const {
    dispatch,
    action,
    onStarting = () => {},
    onSuccess = () => {},
    onError = () => {},
    onCatch = () => {},
    onFinally = () => {},
    linearStart = 1,
    linearEnd = 100,
    linearAutoCloseAfter = 2000,
    snackbarMessageOnSuccess = "",
    snackbarMessageOnError = "",
    snackbarTypeOnSuccess = "success",
    snackbarTypeOnError = "error",
    lateTime = 5000,
    showBackdrop = true,
  } = ins;

  if (!dispatch || !action) {
    return new Error("Missing dispatch or action");
  }

  if (showBackdrop) {
    dispatch({
      type: t.SHOW_BACKDROP,
    });
  }

  if (onStarting) {
    onStarting();
  }

  let count = 0;
  let countFunc = setInterval(() => {
    count = count + 100;
    if (count >= lateTime) {
      clearInterval(countFunc);
      dispatch({
        type: t.SHOW_SNACKBAR,
        payload: {
          message: "Our server is starting... Please wait.",
          type: "info",
        },
      });
    }
  }, 100);

  dispatch({ type: t.SHOW_LINEAR, payload: { percentage: linearStart } });

  let linearcounter = linearStart;

  // randomly increase the percentage
  const increaseLinear = setInterval(() => {
    linearcounter = linearcounter + getRandomNumberInRange(1, 10);
    dispatch({ type: t.SHOW_LINEAR, payload: { percentage: linearcounter } });
    if (linearcounter >= 70) {
      clearInterval(increaseLinear);
    }
  }, 1000);

  dispatch(action)
    .then((data) => {
      clearInterval(countFunc);
      clearInterval(increaseLinear);
      dispatch({ type: t.SHOW_LINEAR, payload: { percentage: linearEnd } });

      if (!data?.error) {
        dispatch({
          type: t.SHOW_SNACKBAR,
          payload: {
            message: snackbarMessageOnSuccess || data.message || "",
            type: snackbarTypeOnSuccess,
            duration: linearAutoCloseAfter,
          },
        });
        if (onSuccess) {
          onSuccess(data);
        }
      } else {
        dispatch({
          type: t.SHOW_SNACKBAR,
          payload: {
            message: data.error,
            type: snackbarTypeOnError,
            duration: linearAutoCloseAfter || 6000,
          },
        });
        if (onError) {
          onError(data.error);
        }
      }
      setTimeout(() => dispatch({ type: t.HIDE_LINEAR }), linearAutoCloseAfter);
    })
    .catch((err) => {
      clearInterval(countFunc);
      dispatch({ type: t.SHOW_LINEAR, payload: { percentage: linearEnd } });
      if (err) {
        dispatch({
          type: t.SHOW_SNACKBAR,
          payload: {
            message: snackbarMessageOnError || `${err}`,
            type: snackbarTypeOnError,
            duration: linearAutoCloseAfter || 6000,
          },
        });
      }
      setTimeout(() => dispatch({ type: t.HIDE_LINEAR }), linearAutoCloseAfter);
      if (onCatch) {
        onCatch(err);
      }
    })
    .finally(() => {
      
      if (showBackdrop) {
        dispatch({
          type: t.HIDE_BACKDROP,
        });
      }

      if (onFinally) {
        onFinally();
      }
    });
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
