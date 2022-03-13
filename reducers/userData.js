import * as t from "@consts";
import _, { isEqual, cloneDeep } from "lodash";

const userData = (state = {}, action) => {
    switch (action.type) {
        case t.SET_USER_DATA:
            return action.payload ? { ...action.payload } : state;
        case t.CLEAR_USER_DATA:
            return {};
        case t.UPDATE_USER_DATA:
            const oldState = cloneDeep(state);
            const newState = cloneDeep(action.payload);

            return !isEqual(oldState, newState)
                ? { ...state, ...action.payload}
                : state;

        default:
            return { ...state };
    }
};

export default userData;
