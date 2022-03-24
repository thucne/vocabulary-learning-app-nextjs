import * as t from "@consts";

const reload = (state = false, action) => {
    switch (action.type) {
        case t.FORCE_RELOAD:
            return true;
        case t.DONE_RELOAD:
            return false;
        default:
            return state;
    }
};

export default reload;
