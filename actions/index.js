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

export const signup = data => async (dispatch) => {
  console.table({
    name: data.name,
    email: data.email,
    password: data.password,
    username: data.username,
  })
  if (!data?.name || !data?.email || !data?.password || !data?.username)
    return { error: "Please fill all the input fileds" };
  return await axios
    .post(`${API}/api/auth/local/register`, {
      name: data.name,
      email: data.email,
      password: data.password,
      username: data.username,
    })
    .then((res) => handleCommonResponse(res))
    .catch((err) => handleServerError(err));
}

export const logout = async (next) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("vip-user");
  }
  next();
};
