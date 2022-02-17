import React, { useState, useEffect } from "react";

import Link from 'next/link';
import Image from 'next/image';

import {
  Avatar, TextField, FormControlLabel,
  Link as MuiLink, Grid, Box, Typography, Container,
  FormControl, InputLabel, OutlinedInput, InputAdornment, FormHelperText,
  IconButton
} from '@mui/material';

import { Visibility, VisibilityOff, Send as SendIcon } from '@mui/icons-material';

import LoadingButton from '@mui/lab/LoadingButton';

import { Colors, Fonts } from '@styles';
import { login } from '@actions';
import { useDispatch } from "react-redux";

export default function Login() {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [focuses, setFocuses] = useState({ identifier: false, password: false });
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const canSubmit = !errors?.identifier && !errors?.password && form?.identifier && form?.password;

  useEffect(() => {
    const checkAdHocFetch = setInterval(() => {
      if (window?.adhocFetch) {
        setMounted(true);
        clearInterval(checkAdHocFetch);
      }
    }, 250);
    return () => clearInterval(checkAdHocFetch);
  }, [])

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mounted) {
      adhocFetch({
        dispatch,
        action: login({
          identifier: form.identifier,
          password: form.password
        }),
        onSuccess: (data) => console.log(data),
        onStarting: () => setLoading(true),
        onFinally: () => setLoading(false),
      });
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
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
        <Grid item xs={12} lg={8} sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: ['none', 'none', 'none', 'flex'],
        }}>
          <Image
            src="https://res.cloudinary.com/katyperrycbt/image/upload/v1645029675/1_prsmtw.svg"
            alt="Login"
            layout="fill"
            objectFit="cover"
            priority={true}
          />
        </Grid>
        <Grid
          item
          xs={12} lg={4}
          sx={{ width: '100%', height: '100%', backgroundColor: Colors.LOGIN_BG }}
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              mt: [0, 0, 0, -10]
            }}
          >
            <Typography component="h1" variant="h4" color={Colors.WHITE} sx={{ fontWeight: Fonts.FW_600 }}>
              Welcome Back!
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 5, width: 350 }}
            >
              <TextField
                margin="normal"
                type="text"
                label="Email or Username"
                color="white"
                required
                fullWidth
                sx={inputStyles}
                inputProps={{
                  autoComplete: 'new-password',
                  form: {
                    autoComplete: 'off',
                  },
                }}
                readOnly={!focuses.identifier}
                error={!!errors?.identifier}
                helperText={errors?.identifier}
                onChange={(e) => {
                  setForm(prev => ({ ...prev, identifier: e.target.value }));
                }}
                onFocus={() => setFocuses(prev => ({ ...prev, identifier: true }))}
              />
              <FormControl
                margin="normal"
                required
                fullWidth
                sx={inputStyles}
                readOnly={!focuses.password}
                error={!!errors.password}
                onFocus={() => setFocuses(prev => ({ ...prev, password: true }))}
              >
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => {
                    setForm(prev => ({ ...prev, password: e.target.value }));
                  }}
                  inputProps={{
                    autoComplete: 'new-password',
                    form: {
                      autoComplete: 'off',
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
                <FormHelperText id="outlined-password-helper-text">{errors?.password}</FormHelperText>
              </FormControl>

              <LoadingButton
                type="submit"
                variant="contained"
                loadingPosition="start"
                color="white"
                fullWidth
                sx={{ mt: 3, mb: 2 }}
                disabled={!canSubmit}
                loading={loading}
                startIcon={<SendIcon />}
              >
                Sign In
              </LoadingButton>
              <Grid container>
                <Grid item xs>
                  <Link href="#" passHref>
                    <MuiLink variant="body2" color={Colors.WHITE}>
                      Forgot password?
                    </MuiLink>
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/signup" passHref>
                    <MuiLink variant="body2" color={Colors.WHITE}>
                      Don&apos;t have an account? Sign up
                    </MuiLink>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}


const inputStyles = {
  color: Colors.WHITE,
  '*': {
    color: Colors.WHITE,
  },
  '& label.Mui-focused': {
    color: Colors.WHITE,
  },
  '& label': {
    color: Colors.WHITE,
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: Colors.WHITE,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: Colors.WHITE,
      color: Colors.WHITE,
    },
    '&:hover fieldset': {
      borderColor: Colors.WHITE,
      color: Colors.WHITE,
    },
    '&.Mui-focused fieldset': {
      borderColor: Colors.WHITE,
      color: Colors.WHITE,
    },
  },
  '.MuiOutlinedInput-root': {
    '*': {
      borderColor: Colors.WHITE,
      color: Colors.WHITE,
    }
  }
}