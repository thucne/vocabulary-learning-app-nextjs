import * as t from "@consts";

const linear = (state = { show: false, percentage: 0 }, action) => {
    switch (action.type) {
        case t.SHOW_LINEAR:
            return action?.payload
                ? { show: true, percentage: action.payload.percentage }
                : { ...state };
        case t.HIDE_LINEAR:
            return { show: false, percentage: 0 };
        case t.SET_PERCENTAGE:
            return {
                ...state,
                percentage: action?.payload
                    ? action.payload.percentage
                    : state.percentage,
            };
        default:
            return { ...state };
    }
};

export default linear;
