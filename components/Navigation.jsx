import React, { useState, useEffect, useRef, useContext, useMemo, useLayoutEffect } from 'react';
import Router from 'next/router';
import Image from 'next/image';

import { styled } from '@mui/system';
import { useTheme } from "@mui/material/styles";
import useScrollTrigger from '@mui/material/useScrollTrigger';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

import { Container, Grid, Stack, Avatar, Button } from '@mui/material';

import { Fonts, SXs } from '@styles';
import { isAuth, getJWT } from '@utils';
import { logout, fetcherJWT } from "@actions";
import { ColorModeContext } from "@pages/_app";
import * as t from '@consts';
import { API } from '@config';

import Footer from '@components/Footer';
import MenuNavBar from '@components/LandingPage/MenuNavBar';

import { useDispatch, useSelector } from "react-redux";

import useSWR from 'swr';

const drawerWidth = 240;

const fetcher = async (...args) => await fetcherJWT(...args);

const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function useWindowSize(appBarRef) {
    const [sizes, setSizes] = useState([0, 0]);

    useIsomorphicLayoutEffect(() => {
        function updateSize() {
            setSizes([appBarRef.current.clientWidth, appBarRef.current.clientHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window && window.removeEventListener('resize', updateSize);
    }, [appBarRef]);

    return sizes;
}

function ResponsiveDrawer(props) {
    const { window, children, landing } = props;
    const dispatch = useDispatch();
    const theme = useTheme();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [bottom, setBottom] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);

    const myRef = useRef(null);
    const appBarRef = useRef(null);
    const colorMode = useContext(ColorModeContext);

    const User = useSelector(state => state?.user);
    const tabName = useSelector(state => state?.tabName);
    const bgColor = useSelector(state => state?.bgColor);

    const [width, height] = useWindowSize(appBarRef);

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 5,
    });

    // get words
    useSWR(getJWT() ? `${API}/api/users/me` : null, fetcher, {
        onSuccess: (data) => dispatch({
            type: t.UPDATE_USER_DATA, payload: data
        }),
        refreshInterval: 5000
    });


    useMemo(() => {
        if (trigger) {
            setScrolled(true);
        } else {
            setTimeout(() => setScrolled(false), 200)
        }
    }, [trigger])

    useEffect(() => {
        const data = myRef.current.getBoundingClientRect();
        const { bottom } = data;
        setBottom(bottom);
    }, []);

    useEffect(() => {
        setMounted(true);
    }, [])

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
            {/* <Toolbar> */}
            <Stack
                sx={{
                    p: 1,
                    filter: typeof window !== 'undefined' &&
                        (localStorage?.getItem("colorMode") || "light") === 'dark'
                        ? 'contrast(0%) brightness(200%)'
                        : 'brightness(1)',
                    position: 'relative',
                    width: '100%',
                    height: 150,
                    cursor: 'pointer'
                }}
                direction='row'
                justifyContent='space-between'
                alignItems='center'
                onClick={() => Router.push('/')}
            >
                <Image draggable={false} alt='logo' src={'/logo.full.svg'} layout='fill' objectFit='cover' priority={true} />
            </Stack>
            {/* </Toolbar> */}
            <Divider />
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>
                            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Container maxWidth={false} disableGutters>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar
                    enableColorOnDark
                    ref={appBarRef}
                    position="fixed"
                    color={landing ? 'white' : bgColor}
                    sx={{
                        width: {
                            lg:
                                !landing ? `calc(100% - ${drawerWidth}px)` : '100%'
                        },
                        ml: { lg: !landing ? `${drawerWidth}px` : 0 },
                        overflow: 'hidden',
                        boxShadow: !trigger && 'none',
                        backgroundImage: 'none',
                        borderBottom: landing && '1px solid rgba(0, 0, 0, 0.12)',
                    }}
                >
                    <Container maxWidth={landing ? 'xl' : false} sx={{ px: landing ? [0, 3, 7, 15] : 0 }}>
                        <Toolbar sx={{
                            backgroundImage: 'none',
                            py: 1
                        }}>
                            <Grid
                                container
                                justifyContent='space-between'
                                alignItems='center'
                                direction='row'
                                display={landing ? 'none' : 'flex'}
                            >
                                <Grid item display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
                                    <IconButton
                                        color="inherit"
                                        aria-label="open drawer"
                                        edge="start"
                                        onClick={handleDrawerToggle}
                                        sx={{ mr: 2, display: { lg: 'none' } }}
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                    <Typography sx={{
                                        animation: `${trigger ? 'navtext' : 'navtextOut'} 0.2s linear forwards`,
                                        position: 'relative',
                                    }} variant="h6" noWrap component="div">
                                        {scrolled && tabName}
                                    </Typography>
                                </Grid>
                                {
                                    mounted && <Grid item>
                                        <Stack direction='row' justifyContent='center' alignItems='center'>
                                            <IconButton
                                                sx={{
                                                    ...SXs.MUI_NAV_ICON_BUTTON,
                                                    color: theme => theme.palette[bgColor].contrastText,
                                                    borderColor: theme => `${theme.palette[bgColor].contrastText}5`,
                                                }}
                                                onClick={colorMode.toggleColorMode}
                                            >
                                                {theme.palette.mode === "dark" ? (
                                                    <LightModeOutlinedIcon />
                                                ) : (
                                                    <DarkModeOutlinedIcon />
                                                )}
                                            </IconButton>
                                            {
                                                User?.name && <IconButton
                                                    sx={{ padding: '4px', mr: 2 }}
                                                    onClick={() => Router.push('/info?tab=me')}
                                                    color="inherit"
                                                >
                                                    <Avatar alt='avatar' src={User?.Photo} sx={{
                                                        width: '32px',
                                                        height: '32px'
                                                    }} />
                                                </IconButton>
                                            }
                                            {
                                                !isAuth() && <Button
                                                    sx={{
                                                        ...SXs.MUI_NAV_BUTTON,
                                                        color: theme => theme.palette[bgColor].contrastText,
                                                        borderColor: theme => `${theme.palette[bgColor].contrastText}5`,
                                                    }}
                                                    onClick={() => Router.push('/login')}
                                                    variant="outlined"
                                                    startIcon={<LoginIcon
                                                    />}
                                                    disableElevation
                                                >
                                                    Log in
                                                </Button>
                                            }
                                            {
                                                isAuth() && <Button
                                                    onClick={() => logout(() => {
                                                        Router.push(`/login`);
                                                    })}
                                                    variant="contained"
                                                    sx={{
                                                        display: ['none', 'flex'],
                                                        ...SXs.MUI_NAV_BUTTON,
                                                        color: theme => theme.palette[bgColor].contrastText,
                                                        borderColor: theme => `${theme.palette[bgColor].contrastText}5`,
                                                    }}
                                                    startIcon={<LogoutIcon />}
                                                    disableElevation
                                                >
                                                    Log out
                                                </Button>
                                            }
                                            {
                                                isAuth() && <IconButton
                                                    sx={{ width: '40px', height: '40px', display: ['block', 'none'] }}
                                                    onClick={() => logout(() => {
                                                        Router.push(`/login`);
                                                    })}
                                                    color="inherit"
                                                >
                                                    <LogoutIcon />
                                                </IconButton>
                                            }
                                        </Stack>
                                    </Grid>
                                }
                            </Grid>
                            <Grid
                                container
                                justifyContent='space-between'
                                alignItems='center'
                                direction='row'
                                display={landing ? 'flex' : 'none'}
                            >
                                <Grid item onClick={() => Router.push('/')} sx={{ cursor: 'pointer' }}>
                                    <Image
                                        src='/logo.banner.x.svg'
                                        alt='logo'
                                        width={150}
                                        height={50}
                                        objectFit='contain'
                                        draggable={false}
                                    />
                                </Grid>
                                <Grid item>
                                    <Stack direction='row'>
                                        <IconButton
                                            sx={SXs.MUI_NAV_ICON_BUTTON}
                                            onClick={colorMode.toggleColorMode}
                                            color='mui_button_inner'
                                        >
                                            {theme.palette.mode === "dark" ? (
                                                <DarkModeOutlinedIcon />
                                            ) : (
                                                <LightModeOutlinedIcon />
                                            )}
                                        </IconButton>
                                        {
                                            mounted && <MenuNavBar isAuth={isAuth()} logout={() => logout(() => {
                                                Router.push(`/login`);
                                            })} />
                                        }
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Toolbar>
                    </Container>
                </AppBar>
                <Box
                    component="nav"
                    sx={{
                        width: { lg: drawerWidth }, flexShrink: { lg: 0 },
                        display: landing ? 'none' : 'block',
                    }}
                    aria-label="mailbox folders"
                >
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Drawer
                        container={container}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: { xs: 'block', lg: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                        }}
                    >
                        {drawer}
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', lg: 'block' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                        }}
                        open
                    >
                        {drawer}
                    </Drawer>
                </Box>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        width: {
                            sm:
                                !landing ? `calc(100% - ${drawerWidth}px)` : '100%'
                        },
                        position: 'relative',
                        mt: !landing ? 0 : `${height}px`,
                    }}
                >
                    {!landing && <Toolbar />}
                    <Box sx={{
                        position: 'absolute',
                        width: '100%',
                        height: 409,
                        zIndex: -1
                    }} />
                    <Container sx={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        display: 'flex'
                    }}
                        maxWidth={false}
                        ref={myRef}
                        disableGutters
                    >
                        {children}
                    </Container>
                    {/* <GutterBottom /> */}
                    <Footer bottom={bottom} landing={landing} />
                </Box>
            </Box>
        </Container>
    );
}

export default ResponsiveDrawer;
