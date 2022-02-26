import * as t from "@consts";

const snackbar = (
    state = { show: false, message: "", type: "success", duration: 2000 },
    action
) => {
    switch (action.type) {
        case t.SHOW_SNACKBAR:
            return action?.payload ? { show: true, ...action.payload } : { ...state };
        case t.HIDE_SNACKBAR:
            return { show: false, message: "", type: "success" };
        default:
            return { ...state };
    }
};

export default snackbar;
