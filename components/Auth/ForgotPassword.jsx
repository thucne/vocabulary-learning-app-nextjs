import React, { useState, useEffect, useRef } from "react";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import {
    Avatar,
    TextField,
    FormControlLabel,
    Link as MuiLink,
    Grid,
    Box,
    Typography,
    Container,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    FormHelperText,
    IconButton,
    Button,
    Paper,
    Tooltip,
} from "@mui/material";

import {
    Visibility,
    VisibilityOff,
    Send as SendIcon,
    Home as HomeIcon,
    ArrowBackIos as ArrowBackIosIcon,
} from "@mui/icons-material";

import LoadingButton from "@mui/lab/LoadingButton";

import { Colors, Fonts, SXs } from "@styles";
import { sendResetPasswordEmail, resetPassword } from "@actions";
import { useDispatch, useSelector } from "react-redux";
import { validateEmail, validatePassword, isValidHttpUrl } from "@utils";
import * as t from "@consts";
import { RECAPTCHA } from "@config";

import LoadingImage from "@components/LoadingImage";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errors, setErrors] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        code: "",
    });
    const [step, setStep] = useState(0);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [focuses, setFocuses] = useState({
        email: false,
        password: false,
        confirmPassword: false,
    });
    const [loading, setLoading] = useState(false);

    const [code, setCode] = useState("");

    const router = useRouter();
    const dispatch = useDispatch();
    const recaptcha = useSelector((state) => state.recaptcha);

    useEffect(() => {
        if (router?.query?.code) {
            setCode(router.query.code);
        }
    }, [router?.query?.code]);

    const refs = useRef([]);

    const canSubmit =
        step === 0
            ? !errors?.email && email?.trim()?.length > 0
            : step === 1
                ? true
                : !errors?.password &&
                password?.trim()?.length > 0 &&
                !errors?.confirmPassword &&
                confirmPassword?.trim()?.length > 0 &&
                !errors?.code &&
                code?.trim()?.length > 0;

    const handleSuccessResponse = (data) => {
        handleNext();
        localStorage.setItem("vip-token", JSON.stringify(data.jwt));
        localStorage.setItem("vip-user", JSON.stringify(data.user));
        setTimeout(() => router.push("/"), 3000);
    };

    const handleResetPassword = (e) => {
        e?.preventDefault();

        if (window?.adHocFetch && recaptcha === true && window?.grecaptcha) {
            grecaptcha.ready(function () {
                grecaptcha
                    .execute(`${RECAPTCHA}`, { action: "vip_authentication" })
                    .then(function (token) {
                        // Add your logic to submit to your backend server here.
                        adHocFetch({
                            dispatch,
                            action: resetPassword({
                                code: code?.trim(),
                                password: password?.trim(),
                                passwordConfirmation: confirmPassword?.trim(),
                                token,
                            }),
                            onError: (data) => {
                                setCode("");
                                setErrors({ ...errors, code: "Incorrect reset link" });
                            },
                            onSuccess: handleSuccessResponse,
                            onStarting: () => setLoading(true),
                            onFinally: () => setLoading(false),
                            snackbarMessageOnSuccess:
                                "Password reset successfully. Redirecting...",
                        });
                    });
            });
        }
    };

    const handleSendResetPasswordEmail = (e) => {
        e?.preventDefault();

        if (window?.adHocFetch && recaptcha === true && window?.grecaptcha) {
            grecaptcha.ready(function () {
                grecaptcha
                    .execute(`${RECAPTCHA}`, { action: "vip_authentication" })
                    .then(function (token) {
                        // Add your logic to submit to your backend server here.
                        adHocFetch({
                            dispatch,
                            action: sendResetPasswordEmail(email?.trim(), token),
                            onSuccess: (data) => {
                                handleNext();
                            },
                            onError: (data) => {
                                // console.log(data);
                            },
                            onStarting: () => setLoading(true),
                            onFinally: () => setLoading(false),
                        });
                    });
            });
        }
    };

    const handleMouseDownPassword = (e) => {
        e.preventDefault();
    };

    const handleNext = (e) => {
        e?.preventDefault();

        if (step === 0 && !errors?.email && email?.length > 0) {
            setStep(() => {
                if (!errors?.email && email?.length > 0) {
                    return 1;
                } else {
                    dispatch({
                        type: t.SHOW_SNACKBAR,
                        payload: {
                            message: "Empty or invalid email address",
                            type: "error",
                        },
                    });
                    return 0;
                }
            });
        }
        if (step === 1 && email?.length > 0) {
            return setStep(() => {
                if (email?.length > 0) {
                    return 2;
                } else {
                    dispatch({
                        type: t.SHOW_SNACKBAR,
                        payload: {
                            message: "Something went wrong, back to step 1 and try again",
                            type: "error",
                        },
                    });
                    return 2;
                }
            });
        } else if (step === 2) {
            return setStep(() => {
                if (
                    password?.length > 0 &&
                    confirmPassword?.length > 0 &&
                    password === confirmPassword
                ) {
                    return 3;
                } else {
                    return 2;
                }
            });
        }
    };

    const handleAction =
        step === 0
            ? handleNext
            : step === 1
                ? handleSendResetPasswordEmail
                : handleResetPassword;

    const handleResetLink = (link) => {
        if (isValidHttpUrl(link)) {
            const getCodeFromLink = String(link).match(/code=([^&]*)/);
            setCode(getCodeFromLink?.[1]);
            return true;
        } else {
            return false;
        }
    };

    return (
        <Container maxWidth={false} disableGutters>
            <Grid
                container
                sx={{
                    height: "100vh",
                    width: "100vw",
                }}
            >
                <Grid
                    item
                    xs={12}
                    lg={8}
                    sx={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        display: ["none", "none", "none", "flex"],
                    }}
                >
                    <LoadingImage
                        src="https://res.cloudinary.com/katyperrycbt/image/upload/v1645198210/Every_day_is_a_good_day_to_learn._mbttkp.svg"
                        alt="Forgot password"
                        layout="fill"
                        objectFit="cover"
                        draggable={false}
                        quality={100}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    lg={4}
                    sx={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: ["none", Colors.LOGO_YELLOW],
                    }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: ["flex-start", "center"],
                            alignItems: "center",
                            height: "100%",
                        }}
                    >
                        <Paper
                            variant="outlined"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "column",
                                justifyContent: "center",
                                mx: [0, 3, 5, 7],
                                p: "48px 40px 36px",
                                borderRadius: "10px",
                                maxWidth: "400px",
                                minWidth: "370px",
                                border: ["none", "1px solid rgba(0, 0, 0, 0.12)"],
                                position: "relative",
                            }}
                        >
                            <Link href="/" passHref>
                                <Button
                                    variant="text"
                                    sx={{
                                        ...SXs.COMMON_BUTTON_STYLES,
                                        position: "absolute",
                                        top: "58px",
                                        left: "40px",
                                        ml: "-8px",
                                    }}
                                >
                                    Back to Home
                                </Button>
                            </Link>

                            <Image
                                src="/logo.svg"
                                alt="Logo"
                                width={75}
                                height={75}
                                draggable={false}
                                priority={true}
                                objectFit="contain"
                            />

                            <Typography component="h1" sx={{ fontSize: Fonts.FS_24 }}>
                                Reset Password
                            </Typography>
                            <Typography
                                align="center"
                                component="p"
                                sx={{ fontSize: Fonts.FS_16, p: "8px 0px 0px" }}
                            >
                                {step === 0 && "What is your email?"}
                                {step === 1 &&
                                    "We will send you an email with a link to reset your password."}
                                {step === 2 && "Enter your new password."}
                            </Typography>
                            <Box
                                component="form"
                                onSubmit={handleAction}
                                noValidate
                                sx={{ mt: 2, width: "100%" }}
                                onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                        if (step === 0 || step === 1) {
                                            handleAction();
                                        } else if (step === 2) {
                                            if (!code?.trim()?.length) {
                                                refs.current[3].focus();
                                            } else if (!password?.trim().length) {
                                                refs.current[1].focus();
                                            } else if (!confirmPassword?.trim().length) {
                                                refs.current[2].focus();
                                            } else {
                                                handleAction();
                                            }
                                        }
                                    }
                                }}
                            >
                                {step === 0 && (
                                    <TextField
                                        ref={(el) => (refs.current[0] = el)}
                                        margin="normal"
                                        type="text"
                                        label="Email"
                                        autoFocus
                                        required
                                        fullWidth
                                        inputProps={inputProps}
                                        readOnly={!focuses?.email}
                                        error={!!errors?.email}
                                        helperText={errors?.email}
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (!validateEmail(e.target.value)) {
                                                setErrors({ ...errors, email: "Invalid email" });
                                            } else {
                                                setErrors({ ...errors, email: "" });
                                            }
                                        }}
                                        onFocus={() =>
                                            setFocuses((prev) => ({ ...prev, email: true }))
                                        }
                                    />
                                )}

                                {step === 1 && (
                                    <Grid container alignItems="center" justifyContent="center">
                                        <div
                                            style={{
                                                position: "relative",
                                                width: 150,
                                                height: 150,
                                                borderRadius: "10px",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <Image
                                                src="https://res.cloudinary.com/katyperrycbt/image/upload/v1645175780/imageedit_6_7571286311_jg3lr5.gif"
                                                alt="Email"
                                                layout="fill"
                                                priority={true}
                                            />
                                        </div>
                                    </Grid>
                                )}

                                {step === 2 && !code.length > 0 && (
                                    <TextField
                                        ref={(el) => (refs.current[3] = el)}
                                        margin="normal"
                                        type="text"
                                        label="Reset Link"
                                        autoFocus
                                        required
                                        fullWidth
                                        inputProps={inputProps}
                                        error={!!errors?.code}
                                        helperText={
                                            errors?.code ||
                                            "Copy & paste the reset link here. No typing."
                                        }
                                        value={code}
                                        onChange={(e) => {
                                            if (!handleResetLink(e.target.value)) {
                                                setErrors({ ...errors, code: "Invalid reset link" });
                                            } else {
                                                setErrors({ ...errors, code: "" });
                                            }
                                        }}
                                    />
                                )}

                                {step === 2 && (
                                    <FormControl
                                        margin="normal"
                                        required
                                        fullWidth
                                        readOnly={!focuses.password}
                                        error={!!errors.password}
                                        onFocus={() =>
                                            setFocuses((prev) => ({ ...prev, password: true }))
                                        }
                                    >
                                        <InputLabel htmlFor="outlined-adornment-password">
                                            Password
                                        </InputLabel>
                                        <OutlinedInput
                                            ref={(el) => (refs.current[1] = el)}
                                            id="outlined-adornment-password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                if (!validatePassword(e.target.value)) {
                                                    setErrors({
                                                        ...errors,
                                                        password:
                                                            "Use 8 or more characters with a mix of letters, numbers & symbols",
                                                    });
                                                } else {
                                                    setErrors({ ...errors, password: "" });
                                                }
                                            }}
                                            inputProps={inputProps}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowPassword((prev) => !prev)}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Password"
                                        />
                                        <FormHelperText id="outlined-password-helper-text">
                                            {errors?.password}
                                        </FormHelperText>
                                    </FormControl>
                                )}

                                {step === 2 && (
                                    <FormControl
                                        margin="normal"
                                        required
                                        fullWidth
                                        readOnly={!focuses.confirmPassword}
                                        error={!!errors.confirmPassword}
                                        onFocus={() =>
                                            setFocuses((prev) => ({ ...prev, confirmPassword: true }))
                                        }
                                    >
                                        <InputLabel htmlFor="outlined-adornment-password-confirm">
                                            Confirm
                                        </InputLabel>
                                        <OutlinedInput
                                            ref={(el) => (refs.current[2] = el)}
                                            id="outlined-adornment-password-confirm"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value);
                                                if (e.target.value !== password) {
                                                    setErrors({
                                                        ...errors,
                                                        confirmPassword: "Not match",
                                                    });
                                                } else {
                                                    setErrors({ ...errors, confirmPassword: "" });
                                                }
                                            }}
                                            inputProps={inputProps}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() =>
                                                            setShowConfirmPassword((prev) => !prev)
                                                        }
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showConfirmPassword ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Confirm"
                                        />
                                        <FormHelperText id="outlined-password-helper-text-confirm">
                                            {errors?.confirmPassword}
                                        </FormHelperText>
                                    </FormControl>
                                )}

                                {step === 0 && (
                                    <Link href="/signup" passHref>
                                        <Tooltip
                                            arrow
                                            title="Currently, we have not supported to get back your account when you forgot your email as well."
                                        >
                                            <MuiLink variant="body2" underline="none">
                                                Forgot email? → Create a new account
                                            </MuiLink>
                                        </Tooltip>
                                    </Link>
                                )}

                                <Grid container justifyContent="space-between" mb={2} mt={4}>
                                    {step === 0 && (
                                        <Grid item>
                                            <Link href="/login" passHref>
                                                <Button
                                                    variant="text"
                                                    sx={{
                                                        ...SXs.COMMON_BUTTON_STYLES,
                                                        ml: "-8px",
                                                    }}
                                                >
                                                    Back to log in
                                                </Button>
                                            </Link>
                                        </Grid>
                                    )}
                                    {step > 0 && step < 3 && (
                                        <Grid item>
                                            <Button
                                                variant="text"
                                                sx={{
                                                    ...SXs.COMMON_BUTTON_STYLES,
                                                    ml: "-8px",
                                                }}
                                                onClick={() =>
                                                    setStep((prev) => (prev - 1 >= 0 ? prev - 1 : 0))
                                                }
                                            >
                                                Previous
                                            </Button>
                                        </Grid>
                                    )}

                                    {step < 3 && (
                                        <Grid item>
                                            <LoadingButton
                                                type="submit"
                                                variant="contained"
                                                sx={SXs.LOADING_BUTTON_STYLES}
                                                disabled={!canSubmit}
                                                loading={loading}
                                            >
                                                {step === 0 && "Next"}
                                                {step === 1 && "Send"}
                                                {step === 2 && "Reset password"}
                                            </LoadingButton>
                                        </Grid>
                                    )}

                                    {step === 3 && (
                                        <Grid container alignItems="center" justifyContent="center">
                                            <div
                                                style={{
                                                    position: "relative",
                                                    width: 150,
                                                    height: 150,
                                                    borderRadius: "10px",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                <Image
                                                    src="https://res.cloudinary.com/katyperrycbt/image/upload/v1645182038/imageedit_14_3201369741_pq5gcy.gif"
                                                    alt="Done!"
                                                    layout="fill"
                                                    priority={true}
                                                />
                                            </div>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>

                            <Typography variant="caption" sx={{ mt: 2 }}>
                                This site is protected by reCAPTCHA and the Google{" "}
                                <MuiLink
                                    href="https://policies.google.com/privacy"
                                    underline="hover"
                                >
                                    Privacy Policy
                                </MuiLink>{" "}
                                and{" "}
                                <MuiLink
                                    href="https://policies.google.com/terms"
                                    underline="hover"
                                >
                                    Terms of Service
                                </MuiLink>{" "}
                                apply.
                            </Typography>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}

const inputProps = {
    autoComplete: "new-password",
    form: {
        autoComplete: "off",
    },
};
