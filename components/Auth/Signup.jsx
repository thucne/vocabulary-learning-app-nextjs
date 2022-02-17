import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;


const theme = createTheme();

export default function Signup() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
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
        if (!e.target.value) 
        error = { msg: "Email is required", error: true };
        setErrors((state) => ({
          ...state,
          ["email"]: error,
        }));
        return;
      case "password":
        var error = {};

        if (!PASSWORD_REGEX.test(e.target.value)) {
          error = {
            msg: "Password must contain at least 8 characters, 1 uppercase and 1 number",
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
    }
  };

  const checkCanSubmit = () =>
    email && !errors?.email?.error  && password && !errors?.password?.error && username && errors?.username?.error && name && errors?.name?.error  ? true : false;

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  autoComplete="given-name"
                  name="Name"
                  required
                  fullWidth
                  id="firstName"
                  autoFocus
                  error={errors["name"]?.error}
                  helperText={errors["name"]?.msg}
                  onChange={(e) => {
                    setName(e.target.value);
                    checkInputCriteria(e, "name");
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password "
                  error={errors["password"]?.error}
                  helperText={errors["password"]?.msg}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    checkInputCriteria(e, "password");
                  }}
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!checkCanSubmit()}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 5 }} /> */}
      </Container>
    </ThemeProvider>
  );
}
