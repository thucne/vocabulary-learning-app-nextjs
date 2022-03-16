import * as t from "@consts";

import _ from "lodash";

const theme = (state = {}, action) => {
    switch (action.type) {
        case t.SET_BG:
            return !_.isEmpty(action?.payload) && !_.isEqual(action?.payload, state) ? action.payload : state;
        default:
            return state;
    }
};

export default theme;
