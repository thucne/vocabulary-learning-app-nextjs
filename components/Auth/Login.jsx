import React, { useState, useEffect, useRef, useCallback } from "react";

import Link from 'next/link';
import Image from 'next/image';

import {
    Avatar, TextField, FormControlLabel,
    Link as MuiLink, Grid, Box, Typography, Container,
    FormControl, InputLabel, OutlinedInput, InputAdornment, FormHelperText,
    IconButton, Button, Paper, Tooltip, Skeleton
} from '@mui/material';

import {
    Visibility,
    VisibilityOff,
    Send as SendIcon,
    Home as HomeIcon,
    ArrowBackIos as ArrowBackIosIcon
} from '@mui/icons-material';

import LoadingButton from '@mui/lab/LoadingButton';

import { Colors, Fonts } from '@styles';
import { login } from '@actions';
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import LoadingImage from '@components/LoadingImage';

export default function Login() {
    const [form, setForm] = useState({ identifier: '', password: '' });
    const [errors, setErrors] = useState({ identifier: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [focuses, setFocuses] = useState({ identifier: false, password: false });
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { query: { url } } = router;

    const canSubmit = !errors?.identifier && !errors?.password && form?.identifier && form?.password;

    const dispatch = useDispatch();

    const loginRefs = useRef([]);


    const handleSubmit = (e) => {
        e?.preventDefault();

        if (window?.adHocFetch) {
            adHocFetch({
                dispatch,
                action: login({
                    identifier: form.identifier,
                    password: form.password
                }),
                onSuccess: handleSuccessResponse,
                onStarting: () => setLoading(true),
                onFinally: () => setLoading(false),
                snackbarMessageOnSuccess: "Welcome back!"
            });
        }
    };

    const handleSuccessResponse = (data) => {
        localStorage.setItem('vip-token', JSON.stringify(data.jwt));
        localStorage.setItem('vip-user', JSON.stringify({
            id: data.user?.id,
            name: data.user?.name,
            email: data.user?.email,
            photo: data.user?.photo?.formats?.thumbnail?.url || data.user?.photo?.url,
            username: data.user?.username
        }));
        router.push(url || '/dashboard');
    }

    const handleEnterPress = () => {
        if (!form?.identifier?.trim()?.length) {
            loginRefs.current[0].focus();
        } else if (!form?.password?.trim()?.length) {
            loginRefs.current[1].focus();
        } else {
            handleSubmit();
        }
    }

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
                    <LoadingImage
                        src="https://res.cloudinary.com/katyperrycbt/image/upload/v1645112857/Manufacture_Production_Modern_Dark_Minimalist_Dashboard_Website_Desktop_Magenta_White_Blue_4_idd9su.svg"
                        alt="Login"
                        layout="fill"
                        objectFit="cover"
                        draggable={false}
                        quality={100}
                    />
                </Grid>

                <Grid
                    item
                    xs={12} lg={4}
                    sx={{ width: '100%', height: '100%', backgroundColor: ['none', Colors.LOGIN_BG] }}
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: ["flex-start", "center"],
                            alignItems: ["center"],
                            height: "100%",
                        }}
                    >
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
                            position: 'relative',
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
                                src='/logo.svg'
                                alt='Logo'
                                width={75}
                                height={75}
                                draggable={false}
                                priority={true}
                                objectFit="contain"
                            />

                            <Typography component="h1" sx={{ fontSize: Fonts.FS_24 }}>
                                Login
                            </Typography>
                            <Typography component="p" sx={{ fontSize: Fonts.FS_16, p: "8px 0px 0px" }}>
                                Use your Vip Account
                            </Typography>
                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                noValidate
                                sx={{ mt: 2, maxWidth: "100%" }}
                                onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                        handleEnterPress();
                                    }
                                }}
                            >
                                <TextField
                                    autoFocus
                                    inputRef={el => loginRefs.current[0] = el}
                                    margin="normal"
                                    type="text"
                                    label="Email or Username"
                                    required
                                    fullWidth
                                    inputProps={inputProps}
                                    error={!!errors?.identifier}
                                    helperText={errors?.identifier}
                                    onChange={(e) => {
                                        setForm(prev => ({ ...prev, identifier: e.target.value }));
                                    }}
                                />
                                <FormControl
                                    margin="normal"
                                    required
                                    fullWidth
                                    error={!!errors.password}
                                >
                                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                    <OutlinedInput
                                        inputRef={el => loginRefs.current[1] = el}
                                        id="outlined-adornment-password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={(e) => {
                                            setForm(prev => ({ ...prev, password: e.target.value }));
                                        }}
                                        inputProps={inputProps}
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

                                <Link href="/forgot-password" passHref>
                                    <MuiLink
                                        variant="body2"
                                        underline="none"
                                    >
                                        Forgot password?
                                    </MuiLink>
                                </Link>

                                <Grid container justifyContent='space-between' mb={2} mt={4}>
                                    <Grid item>
                                        <Link href="/signup" passHref>
                                            <Button variant="text"
                                                sx={{
                                                    ml: '-8px',
                                                    '&.MuiButton-text': {
                                                        textTransform: 'none !important',
                                                    }
                                                }}>
                                                Create account
                                            </Button>
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <LoadingButton
                                            type="submit"
                                            variant="contained"
                                            loadingPosition="start"
                                            sx={{
                                                '&.MuiLoadingButton-root': {
                                                    textTransform: 'none !important',
                                                }
                                            }}
                                            disabled={!canSubmit}
                                            loading={loading}
                                            startIcon={<SendIcon />}
                                        >
                                            Log in
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

const inputProps = {
    autoComplete: 'new-password',
    form: {
        autoComplete: 'off',
    },
}