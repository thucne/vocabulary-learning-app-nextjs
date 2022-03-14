import * as t from "@consts";

const confirmDialog = (state = { show: false }, action) => {
    switch (action.type) {
        case t.SHOW_CONFIRM_DIALOG:
            return { show: true, data: action?.payload };
        case t.HIDE_CONFIRM_DIALOG:
            return { ...state, show: false };
        default:
            return { ...state };
    }
};

export default confirmDialog;
