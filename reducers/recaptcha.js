import * as t from "@consts";

const recaptcha = (state = false, action) => {
    switch (action.type) {
        case t.NO_RECAPTCHA:
            return false;
        case t.DONE_RECAPTCHA:
            return true;
        case t.RELOAD_RECAPTCHA:
            return "loading";
        default:
            return state;
    }
};

export default recaptcha;
