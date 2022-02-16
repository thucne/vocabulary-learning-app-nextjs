import * as t from "@consts";

const backdrop = (state = { show: false }, action) => {
    switch (action.type) {
        case t.SHOW_BACKDROP:
            return { show: true };
        case t.HIDE_BACKDROP:
            return { show: false };
        default:
            return { ...state };
    }
}

export default backdrop;