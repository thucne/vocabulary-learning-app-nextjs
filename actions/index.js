import axios from "axios";

import { API } from "@config";
import {
  handleResponse,
  handleServerError,
  handleCommonResponse,
} from "@utils";

export const login = (data) => async (dispatch) => {
  if (!data?.identifier || !data?.password) {
    return { error: "Please enter email/username and password" };
  } else {
    return await axios
      .post(`${API}/api/auth/local`, {
        identifier: data.identifier,
        password: data.password,
      })
      .then((res) => handleCommonResponse(res))
      .catch((err) => handleServerError(err));
  }
};

export const logout = async (next) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("vip-user");
  }
  next();
};
