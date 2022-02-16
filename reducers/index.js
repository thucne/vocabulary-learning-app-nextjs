import { combineReducers } from "redux";
import user from "./user";
import snackbar from "./snackbar";
import linear from "./linear";
import backdrop from "./backdrop";
import tabName from "./tabName";

const rootReducer = combineReducers({
  user,
  snackbar,
  linear,
  backdrop,
  tabName
});

export default rootReducer;
