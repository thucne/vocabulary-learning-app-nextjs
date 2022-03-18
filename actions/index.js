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
                token: data.token,
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
            token: data.token,
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

export const sendResetPasswordEmail = (email, token) => async (dispatch) => {
    if (!email?.length) {
        return { error: "Please enter email" };
    } else {
        return await axios
            .post(`${API}/api/auth/forgot-password`, {
                email,
                token,
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
                token: data.token,
            })
            .then((res) => handleCommonResponse(res))
            .catch((err) => handleServerError(err));
    }
};

export const fetcherJWT = async (url) => {
    if (!getJWT()) {
        return { error: "" };
    }
    return await axios
        .get(url, {
            headers: {
                Authorization: `Bearer ${getJWT()}`,
            },
        })
        .then((res) => handleCommonResponse(res))
        .catch((err) => handleServerError(err));
};

export const fetcherJWTIfAny = async (url) => {
    return await axios
        .get(url, {
            headers: {
                Authorization: getJWT() ? `Bearer ${getJWT()}` : undefined,
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
};

export const createVIP = (data) => async (dispatch) => {
    if (!data || !getJWT()) {
        return { error: "Empty body or jwt." };
    }
    return await axios
        .post(`${API}/api/vips`, data, {
            headers: {
                Authorization: `Bearer ${getJWT()}`,
            },
        })
        .then((res) => handleCommonResponse(res))
        .catch((err) => handleServerError(err));
};

export const updateVIP = (data, id) => async (dispatch) => {
    if (!data || !getJWT()) {
        return { error: "Empty body or jwt." };
    }
    return await axios
        .put(`${API}/api/vips/${id}`, data, {
            headers: {
                Authorization: `Bearer ${getJWT()}`,
            },
        })
        .then((res) => handleCommonResponse(res))
        .catch((err) => handleServerError(err));
};

export const updateManyVIPs = (data) => async (dispatch) => {
    if (!data || !getJWT()) {
        return { error: "Empty body or jwt." };
    }
    return await axios
        .put(`${API}/api/vips`, data, {
            headers: {
                Authorization: `Bearer ${getJWT()}`,
            },
        })
        .then((res) => handleCommonResponse(res))
        .catch((err) => handleServerError(err));
};


export const updateSettings = (id, data) => async dispatch => {
    if (!data || !getJWT()) {
        return { error: "Empty body or jwt." };
    }
    return await axios
        .put(`${API}/api/users/${id}`, data, {
            headers: {
                Authorization: `Bearer ${getJWT()}`,
            },
        })
        .then((res) => handleCommonResponse(res))
        .catch((err) => handleServerError(err));

}

export const updateUser = (data, id) => async (dispatch) => {
    if (!data || !getJWT()) {
        return { error: "Empty body or jwt." };
    }
    return await axios
        .put(`${API}/api/users/${id}`, data, {
            headers: {
                Authorization: `Bearer ${getJWT()}`,
            },
        })
        .then((res) => handleCommonResponse(res))
        .catch((err) => handleServerError(err));
};

export const subscribeVip = (id, token) => async (dispatch) => {
    if (!getJWT()) {
        return { error: "Login first." };
    }
    return await axios
        .put(`${API}/api/users/subscribe/${id}`, { token }, {
            headers: {
                Authorization: `Bearer ${getJWT()}`,
                'Content-Type': 'application/json',
            },
        })
        .then((res) => handleCommonResponse(res))
        .catch((err) => handleServerError(err));
}

export const unsubscribeVip = (id, token) => async (dispatch) => {
    if (!getJWT()) {
        return { error: "Login first." };
    }
    return await axios
        .put(`${API}/api/users/unsubscribe/${id}`, { token }, {
            headers: {
                Authorization: `Bearer ${getJWT()}`,
                'Content-Type': 'application/json',
            },
        })
        .then((res) => handleCommonResponse(res))
        .catch((err) => handleServerError(err));
}