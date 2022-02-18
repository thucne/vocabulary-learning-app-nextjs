import React, { useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";

import { useDispatch } from "react-redux";

import {
  Link as MuiLink, Box, FormControl, FormHelperText,
  InputAdornment, IconButton, InputLabel, OutlinedInput,
  Typography, Container, TextField, Grid, Paper, Button
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  Send as SendIcon,
  Error as ErrorIcon
} from "@mui/icons-material";

import { Colors, Fonts } from "@styles";
import { LoadingButton } from "@mui/lab";
import { signup } from "@actions";
import { validateEmail, validatePassword } from '@utils';


export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [focuses, setFocuses] = useState({
    email: false,
    password: false,
    username: false,
    name: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({ email: {} });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (window?.adHocFetch) {

      adHocFetch({
        dispatch,
        action: signup({
          name: name.trim(),
          password: password.trim(),
          username: username.trim(),
          email: email.trim()
        }),
        onSuccess: (data) => { console.log(data) },
        onStarting: () => setLoading(true),
        onFinally: () => setLoading(false),
        onError: err => console.log(err),
        snackbarMessageOnSuccess: "Successfully signed up, please confirm your email.",
      });
    }

  };

  const preventCopyPaste = (e) => {
    e.preventDefault();
    return false;
  };

  const checkInputCriteria = (e, field) => {
    switch (field) {
      case "name":
        setErrors((state) => ({
          ...state,
          ["name"]: e.target.value
            ? {}
            : { msg: "Name is required", error: true },
        }));
        return;
      case "username":
        setErrors((state) => ({
          ...state,
          ["username"]: e.target.value
            ? {}
            : { msg: "Username is required", error: true },
        }));
        return;
      case "email":
        var error = {};
        if (!validateEmail(e.target.value)) {
          error = { msg: "Invalid email", error: true };
        }
        if (!e.target.value) error = { msg: "Email is required", error: true };
        setErrors((state) => ({
          ...state,
          ["email"]: error,
        }));
        return;
      case "password":
        var error = {};
        if (e.target.value.trim() !== confirmPassword.trim()) {
          setErrors((state) => ({
            ...state,
            ["confirmPassword"]: {
              msg: "Confirm password is incorect",
              error: true,
            },
          }));
        } else {
          setErrors((state) => ({
            ...state,
            ["confirmPassword"]: {},
          }));
        }
        if (!validatePassword(e.target.value)) {
          error = {
            msg: "At least 8 characters, 1 uppercase and 1 number",
            error: true,
          };
        }
        if (!e.target.value)
          error = { msg: "Password is required", error: true };
        setErrors((state) => ({
          ...state,
          ["password"]: error,
        }));
        return;
      case "confirmPassword":
        var error = {};
        if (e.target.value.trim() !== password.trim()) {
          error = {
            msg: "Confirm password is incorrect",
            error: true,
          };
        }
        if (!e.target.value)
          error = { msg: "Password is required", error: true };
        setErrors((state) => ({
          ...state,
          ["confirmPassword"]: error,
        }));
        return;
    }
  };

  const checkCanSubmit = () =>
    (email.length &&
      !errors?.email?.error &&
      password.length &&
      !errors?.password?.error &&
      username.length &&
      !errors?.username?.error &&
      name.length &&
      !errors?.name?.error &&
      confirmPassword.length &&
      !errors?.confirmPassword?.error) ??
    false;

  return (
    <Container maxWidth={false} disableGutters>
      <Grid
        container
        sx={{
          height: "100vh",
          width: "100vw",
        }}
      >
        <Grid item xs={12} lg={8}
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: ["none", "none", "none", "flex"],
          }}
        >
          <Image
            src="https://res.cloudinary.com/katyperrycbt/image/upload/v1645111388/Manufacture_Production_Modern_Dark_Minimalist_Dashboard_Website_Desktop_Magenta_White_Blue_zztgat.svg"
            alt="Sign up"
            layout="fill"
            objectFit="cover"
            priority={true}
            draggable={false}
            quality={100}
          />
        </Grid>
        <Grid item xs={12} lg={4} display="flex" alignItems="center" justifyContent="center"
          sx={{
            width: "100%",
            height: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }} className='noselect'>
            <Paper variant='outlined' sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
              mx: [0, 3, 5, 7],
              p: "48px 40px 36px",
              borderRadius: '10px',
              maxWidth: "400px",
              border: ['none', '1px solid rgba(0, 0, 0, 0.12)'],
              cursor: 'pointer',
              position: "relative",
            }}>

              <Link href="/" passHref>
                <Button variant="text"
                  sx={{
                    position: 'absolute',
                    top: "58px",
                    left: "40px",
                    ml: '-8px',
                    '&.MuiButton-text': {
                      textTransform: 'none !important',
                    },
                  }}>
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

              <Typography component="h1" sx={{ fontWeight: Fonts.FW_400, fontSize: Fonts.FS_24 }}>
                Create your Vip Account
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 3 }}
              >
                <TextField
                  margin="dense"
                  type="text"
                  label="Name"
                  size="small"
                  required
                  fullWidth
                  error={errors["name"]?.error}
                  helperText={errors["name"]?.msg || 'Name is required'}
                  inputProps={inputProps}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    checkInputCriteria(e, "name");
                  }}
                />

                <TextField
                  margin="dense"
                  type="text"
                  label="Username"
                  size="small"
                  required
                  fullWidth
                  error={errors["username"]?.error}
                  helperText={errors["username"]?.msg || 'Username is required'}
                  inputProps={inputProps}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    checkInputCriteria(e, "username");
                  }}
                />

                <TextField
                  margin="dense"
                  type="text"
                  label="Email Address"
                  size='small'
                  required
                  fullWidth
                  error={errors["email"]?.error}
                  helperText={errors["email"]?.msg || 'Email is required'}
                  inputProps={inputProps}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    checkInputCriteria(e, "email");
                  }}
                />

                <Grid container direction='row' spacing={1} id="vip-confirm-password3">
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      margin="dense"
                      size="small"
                      required
                      fullWidth
                      readOnly={!focuses.password}
                      error={errors?.password?.error}
                      onFocus={() =>
                        setFocuses((prev) => ({ ...prev, password: true }))
                      }
                    >
                      <InputLabel htmlFor="password-field-vip" >
                        Password
                      </InputLabel>
                      <OutlinedInput
                        id="password-field-vip"
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        inputProps={inputProps}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          checkInputCriteria(e, "password");
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      <FormHelperText
                        id="outlined-password-helper-text-vip-1"
                        sx={{ display: ['flex', 'none'] }}
                      >
                        {errors?.password?.msg || "Use 8 or more characters with a mix of letters, numbers & symbols"}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      margin="dense"
                      size="small"
                      required
                      fullWidth
                      readOnly={!focuses.confirmPassword}
                      error={errors?.confirmPassword?.error}
                      onFocus={() =>
                        setFocuses((prev) => ({ ...prev, password: true }))
                      }
                    >
                      <InputLabel htmlFor="vip-confirm-password">
                        Confirm
                      </InputLabel>
                      <OutlinedInput
                        id="vip-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        label="Confirm"
                        onPaste={preventCopyPaste}
                        onCopy={preventCopyPaste}
                        inputProps={inputProps}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          checkInputCriteria(e, "confirmPassword");
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowConfirmPassword}
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
                      />
                      <FormHelperText
                        id="outlined-password-helper-text-vip-2"
                        sx={{ display: ['flex', 'none'] }}
                      >
                        {errors?.confirmPassword?.msg || "Re-enter password"}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>

                <FormHelperText sx={{
                  display: ['none', 'flex'],
                  m: "4px 14px 0px",
                  color: (errors?.password?.msg?.length > 0 || errors?.confirmPassword?.msg?.length > 0) && 'red'
                }}>
                  {errors?.password?.msg ||
                    errors?.confirmPassword?.msg ||
                    'Use 8 or more characters with a mix of letters, numbers & symbols'
                  }
                </FormHelperText>

                <Grid container justifyContent="space-between" mt={2}>
                  <Grid item>
                    <Link href="/login" passHref>
                      <Button variant="text" sx={{
                        ml: '-8px',
                        '&.MuiButton-text': {
                          textTransform: 'none !important',
                        }
                      }}>
                        Log in instead
                      </Button>
                    </Link>
                  </Grid>
                  <Grid item>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loadingPosition="start"
                      fullWidth
                      disabled={!checkCanSubmit()}
                      loading={loading}
                      startIcon={<SendIcon />}
                      sx={{
                        '&.MuiLoadingButton-root': {
                          textTransform: 'none !important',
                        }
                      }}
                    >
                      Sign up
                    </LoadingButton>
                  </Grid>
                </Grid>

              </Box>
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
}