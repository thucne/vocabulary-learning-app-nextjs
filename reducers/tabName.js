import * as t from "@consts";

const tabName = (state = "Dashboard", action) => {
    switch (action.type) {
        case t.SET_TAB_NAME:
            return action?.payload ? `${action.payload}` : state;
        default:
            return state;
    }
};

export default tabName;
