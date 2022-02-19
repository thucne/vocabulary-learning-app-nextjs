import axios from "axios";

import { API } from "@config";
import {
  handleResponse,
  handleServerError,
  handleCommonResponse,
  getJWT,
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

export const signup = (data) => async (dispatch) => {
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
};

export const logout = async (next) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("vip-user");
    localStorage.removeItem("vip-token");
  }
  next();
};

export const sendResetPasswordEmail = (email) => async (dispatch) => {
  if (!email?.length) {
    return { error: "Please enter email" };
  } else {
    return await axios
      .post(`${API}/api/auth/forgot-password`, {
        email,
      })
      .then((res) => handleCommonResponse(res))
      .catch((err) => handleServerError(err));
  }
};

export const resetPassword = (data) => async (dispatch) => {
  if (!data?.code || !data?.password || !data?.passwordConfirmation) {
    return { error: "Please enter all the fields" };
  } else {
    return await axios
      .post(`${API}/api/auth/reset-password`, {
        code: data.code,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
      })
      .then((res) => handleCommonResponse(res))
      .catch((err) => handleServerError(err));
  }
};

export const fetcherJWT = async (url) => {
  return await axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${getJWT()}`,
      },
    })
    .then((res) => handleCommonResponse(res))
    .catch((err) => handleServerError(err));
};

export const fetcher = async (url) => {
    return await axios
        .get(url)
        .then((res) => handleCommonResponse(res))
        .catch((err) => handleServerError(err));
}