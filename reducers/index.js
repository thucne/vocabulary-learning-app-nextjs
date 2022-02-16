import { combineReducers } from "redux";
import user from "./user";
import snackbar from "./snackbar";
import linear from "./linear";
import backdrop from "./backdrop";

const rootReducer = combineReducers({
  user,
  snackbar,
  linear,
  backdrop,
});

export default rootReducer;
