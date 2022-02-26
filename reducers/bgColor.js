import * as t from "@consts";

const bgColor = (state = "dashboard", action) => {
    switch (action.type) {
        case t.SET_BG:
            return action?.payload ? `${action.payload}` : state;
        default:
            return state;
    }
};

export default bgColor;
