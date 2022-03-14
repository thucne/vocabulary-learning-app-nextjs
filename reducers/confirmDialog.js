import * as t from "@consts";

const confirmDialog = (state = { show: false }, action) => {
    switch (action.type) {
        case t.SHOW_CONFIRM_DIALOG:
            return { show: true, data: action?.payload };
        case t.HIDE_CONFIRM_DIALOG:
            return { show: false, data: {} };
        default:
            return { ...state };
    }
};

export default confirmDialog;
