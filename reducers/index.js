import { combineReducers } from "redux";
import user from "./user";
import snackbar from "./snackbar";
import linear from "./linear";
import backdrop from "./backdrop";
import tabName from "./tabName";
import bgColor from "./bgColor";
import userData from "./userData";
import recaptcha from "./recaptcha";

const rootReducer = combineReducers({
    user,
    snackbar,
    linear,
    backdrop,
    tabName,
    bgColor,
    userData,
    recaptcha,
});

export default rootReducer;
