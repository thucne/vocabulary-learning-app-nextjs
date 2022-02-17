import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import { useDispatch } from "react-redux";

import {
  Link as MuiLink,
  Grid,
  Box,
  FormControl,
  FormHelperText,
  InputAdornment,
  IconButton,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Send as SendIcon,
} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Image from "next/image";
import { Colors, Fonts } from "@styles";
import { LoadingButton } from "@mui/lab";
import { signup } from "@actions";
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const theme = createTheme();

export default function Signup() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focuses, setFocuses] = useState({
    email: false,
    password: false,
    username: false,
    name: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = React.useState({ email: {} });
  const [loading, setLoading] = React.useState(false);

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
    // console.log({name,username, email, password})
    if (window?.adHocFetch) {
      adHocFetch({
        dispatch,
        action: signup({
          name: name.trim(),
          password: password.trim(),
          username: username.trim(),
          email: email.trim()
        }),
        onSuccess: (data)=>{console.log(data)},
        onStarting: () => setLoading(true),
        onFinally: () => setLoading(false),
        onError: err=>console.log(err)
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
        if (!EMAIL_REGEX.test(e.target.value)) {
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
        if (!PASSWORD_REGEX.test(e.target.value)) {
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
    <ThemeProvider theme={theme}>
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
            <Image
              src="https://res.cloudinary.com/katyperrycbt/image/upload/v1645100136/t7urw3hlzmd2ezryr75m.jpg"
              alt="Signup"
              layout="fill"
              objectFit="cover"
              priority={true}
              draggable={false}
            />
          </Grid>
          <Grid
            item
            xs={12}
            lg={4}
            sx={{
              width: "100%",
              height: "100%",
              // backgroundColor: Colors.LOGIN_BG,
            }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                mt: [0, 0, 0, -10],
              }}
            >
              <Image
                src="/logo.svg"
                alt="Logo"
                width={75}
                height={75}
                draggable={false}
                priority={true}
                objectFit="contain"
              />
              <Typography
                component="h1"
                variant="h4"
                color={Colors.WHITE}
                sx={{ fontWeight: Fonts.FW_600 }}
              >
                Let create your account!
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 5, width: 350 }}
              >
                <TextField
                  type="text"
                  margin="normal"
                  label="Name "
                  required
                  fullWidth
                  inputProps={{
                    autoComplete: "new-password",
                    form: {
                      autoComplete: "off",
                    },
                  }}
                  error={errors["name"]?.error}
                  helperText={errors["name"]?.msg}
                  onChange={(e) => {
                    setName(e.target.value);
                    checkInputCriteria(e, "name");
                  }}
                />

                <TextField
                  margin="normal"
                  label="Username"
                  required
                  fullWidth
                  id="userName"
                  name="userName"
                  autoComplete="family-name"
                  error={errors["username"]?.error}
                  helperText={errors["username"]?.msg}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    checkInputCriteria(e, "username");
                  }}
                />

                <TextField
                  required
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={errors["email"]?.error}
                  helperText={errors["email"]?.msg}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    checkInputCriteria(e, "email");
                  }}
                />

                <FormControl
                  margin="normal"
                  required
                  fullWidth
                  readOnly={!focuses.password}
                  error={errors?.password?.error}
                  onFocus={() =>
                    setFocuses((prev) => ({ ...prev, password: true }))
                  }
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      checkInputCriteria(e, "password");
                    }}
                    onPaste={preventCopyPaste}
                    onCopy={preventCopyPaste}
                    inputProps={{
                      autoComplete: "new-password",
                      form: {
                        autoComplete: "off",
                      },
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
                    label="Password"
                  />
                  <FormHelperText 
                  style={{opacity: errors?.password?.error ? 1 : 0}}
                  id="outlined-password-helper-text">
                    {errors?.password?.msg || "Password must be at least 8 characters"}
                  </FormHelperText>
                </FormControl>

                <FormControl
                  margin="normal"
                  required
                  fullWidth
                  readOnly={!focuses.confirmPassword}
                  error={errors?.confirmPassword?.error}
                  onFocus={() =>
                    setFocuses((prev) => ({ ...prev, password: true }))
                  }
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Confirm Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      checkInputCriteria(e, "confirmPassword");
                    }}
                    onPaste={preventCopyPaste}
                    onCopy={preventCopyPaste}
                    inputProps={{
                      autoComplete: "new-password",
                      form: {
                        autoComplete: "off",
                      },
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
                    label="Password"
                  />
                  <FormHelperText 
                  style={{opacity:errors?.confirmPassword?.error ? 1 : 0}}
                  id="outlined-password-helper-text">
                    {errors?.confirmPassword?.msg || "Confirm your passwodr"}
                  </FormHelperText>
                </FormControl>

                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="/login" passHref>
                      <MuiLink variant="body2" >
                        Already have an account? Sign in
                      </MuiLink>
                    </Link>
                  </Grid>
                </Grid>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loadingPosition="start"
                  fullWidth
                  margin="normal"
                  sx={{ mt: 5, mb: 2 }}
                  disabled={!checkCanSubmit()}
                  loading={loading}
                  startIcon={<SendIcon />}
                >
                  Sign up
                </LoadingButton>

               
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

const inputStyles = {
  color: Colors.WHITE,
  "*": {
    color: Colors.WHITE,
  },
  "& label.Mui-focused": {
    color: Colors.WHITE,
  },
  "& label": {
    color: Colors.WHITE,
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: Colors.WHITE,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: Colors.WHITE,
      color: Colors.WHITE,
    },
    "&:hover fieldset": {
      borderColor: Colors.WHITE,
      color: Colors.WHITE,
    },
    "&.Mui-focused fieldset": {
      borderColor: Colors.WHITE,
      color: Colors.WHITE,
    },
  },
  ".MuiOutlinedInput-root": {
    "*": {
      borderColor: Colors.WHITE,
      color: Colors.WHITE,
    },
  },
  ".MuiFormHelperText-root": {
    marginTop: 0,
    height: 0,
    color: Colors.RED,
  },
  ".MuiFormControl-root": {
    marginBottom: "100px",
  },
};
