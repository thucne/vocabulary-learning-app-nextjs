import * as t from "@consts";

const user = (state = {}, action) => {
    switch (action.type) {
        case t.SET_USER:
            return action.payload ? { ...action.payload } : state;
        case t.CLEAR_USER:
            return {};
        case t.UPDATE_USER:
            return { ...state, ...action.payload };
        default:
            return { ...state };
    }
};

export default user;
