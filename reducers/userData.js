import * as t from '@consts';

const userData = (state = {}, action) => {
  switch (action.type) {
    case t.SET_USER_DATA:
        return action.payload ? { ...action.payload } : state;
    case t.CLEAR_USER_DATA:
        return {};
    case t.UPDATE_USER_DATA:
        return { ...state, ...action.payload };
    default:
      return { ...state };
  }
};

export default userData;
