window.adHocFetch = (ins) => {
    const {
        dispatch,
        action,
        onStarting = () => { },
        onSuccess = () => { },
        onError = () => { },
        onCatch = () => { },
        onFinally = () => { },
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

    if (
        !dispatch ||
        !action ||
        typeof dispatch !== "function" ||
        typeof action !== "function"
    ) {
        return new Error("Missing dispatch or action");
    }

    if (showBackdrop) {
        dispatch({
            type: "SHOW_BACKDROP",
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
                type: "SHOW_SNACKBAR",
                payload: {
                    message: "Our server is starting... Please wait.",
                    type: "info",
                },
            });
        }
    }, 100);

    dispatch({ type: "SHOW_LINEAR", payload: { percentage: linearStart } });

    let linearcounter = linearStart;

    // randomly increase the percentage
    const increaseLinear = setInterval(() => {
        linearcounter = linearcounter + getRandomNumberInRange(1, 10);
        dispatch({ type: "SHOW_LINEAR", payload: { percentage: linearcounter } });
        if (linearcounter >= 70) {
            clearInterval(increaseLinear);
        }
    }, 1000);

    dispatch(action)
        .then((data) => {
            clearInterval(countFunc);
            clearInterval(increaseLinear);
            dispatch({ type: "SHOW_LINEAR", payload: { percentage: linearEnd } });

            if (!data?.error) {
                dispatch({
                    type: "SHOW_SNACKBAR",
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
                    type: "SHOW_SNACKBAR",
                    payload: {
                        message: `${typeof data?.error === "string"
                                ? data?.error
                                : data.error?.message
                            }`,
                        type: snackbarTypeOnError,
                        duration: linearAutoCloseAfter || 6000,
                    },
                });
                if (onError) {
                    onError(data.error);
                }
            }
            setTimeout(() => dispatch({ type: "HIDE_LINEAR" }), linearAutoCloseAfter);
        })
        .catch((err) => {
            clearInterval(countFunc);
            dispatch({ type: "SHOW_LINEAR", payload: { percentage: linearEnd } });
            if (err) {
                dispatch({
                    type: "SHOW_SNACKBAR",
                    payload: {
                        message: snackbarMessageOnError || `${err}`,
                        type: snackbarTypeOnError,
                        duration: linearAutoCloseAfter || 6000,
                    },
                });
            }
            setTimeout(() => dispatch({ type: "HIDE_LINEAR" }), linearAutoCloseAfter);
            if (onCatch) {
                onCatch(err);
            }
        })
        .finally(() => {
            if (showBackdrop) {
                dispatch({
                    type: "HIDE_BACKDROP",
                });
            }

            if (onFinally) {
                onFinally();
            }
        });
};

const getRandomNumberInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
