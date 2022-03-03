import * as t from "@consts";

const tabName = (state = "Dashboard", action) => {
    switch (action.type) {
        case t.SET_TAB_NAME:
            return action?.payload ? `${action.payload}` : state;
        case t.RESET_TAB_NAME:
            return "Dashboard";
        default:
            return state;
    }
};

export default tabName;
