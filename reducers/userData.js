import * as t from "@consts";
import { isEqual, cloneDeep } from "lodash";

const userData = (state = {}, action) => {
  switch (action.type) {
    case t.SET_USER_DATA:
      return action.payload ? { ...action.payload } : state;
    case t.CLEAR_USER_DATA:
      return {};
    case t.UPDATE_USER_DATA:
      const oldState = cloneDeep(state);
      const newState = cloneDeep(action.payload);

      return !isEqual(oldState, newState) &&
        JSON.stringify(oldState).length !== JSON.stringify(newState).length
        ? { ...state, ...action.payload }
        : state;
    default:
      return { ...state };
  }
};

export default userData;
