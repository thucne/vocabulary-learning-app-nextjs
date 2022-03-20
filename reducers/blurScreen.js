import * as t from "@consts";

const blurScreen = (state = false, action) => {
    switch (action.type) {
        case t.BLUR_SCREEN:
            return true;
        case t.UNBLUR_SCREEN:
            return false;
        default:
            return state;
    }
};

export default blurScreen;
