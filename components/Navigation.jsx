import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
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

import { Container, Grid, Stack, Avatar, Button } from '@mui/material';

import { Fonts } from '@styles';
import { isAuth } from '@utils';
import { ColorModeContext } from "@pages/_app";
import * as t from "@consts";

import Footer from '@components/Footer';

import { useDispatch, useSelector } from "react-redux";

const GutterBottom = styled('div')(({
    height: 300
}))

const AniText = styled(Typography)(({
    animation: 'navtext 0.5s linear',
    position: 'relative'
}));

const drawerWidth = 240;


function ResponsiveDrawer(props) {
    const { window, children } = props;
    const dispatch = useDispatch();
    const theme = useTheme();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [bottom, setBottom] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const myRef = useRef(null);
    const colorMode = useContext(ColorModeContext);

    const User = useSelector(state => state?.user);
    const tabName = useSelector(state => state?.tabName);

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 5,
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
                    height: 150
                }}
                direction='row'
                justifyContent='space-between'
                alignItems='center'
            >
                <Image quality={100} alt='logo' src={'/logo.full.svg'} layout='fill' objectFit='cover' />
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
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                enableColorOnDark
                position="fixed"
                sx={{
                    width: { lg: `calc(100% - ${drawerWidth}px)` },
                    ml: { lg: `${drawerWidth}px` },
                    overflow: 'hidden',
                    boxShadow: !trigger && 'none',
                    backgroundImage: 'none',
                }}
            >
                <Toolbar sx={{
                    backgroundImage: 'none',
                    py: 1
                }}>
                    <Grid container justifyContent='space-between' alignItems='center' direction='row'>
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
                        <Grid item>
                            <Stack direction='row' justifyContent='center' alignItems='center'>
                                <IconButton
                                    sx={{ mr: 1, width: '40px', height: '40px' }}
                                    onClick={colorMode.toggleColorMode}
                                    color="inherit"
                                >
                                    {theme.palette.mode === "dark" ? (
                                        <Brightness7Icon />
                                    ) : (
                                        <Brightness4Icon />
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
                                            bgcolor: 'upsplashButton.bg',
                                            color: 'upsplashButton.main',
                                            borderColor: 'upsplashButton.main',
                                            ':hover': {
                                                borderColor: 'upsplashButton.hover',
                                                color: 'upsplashButton.hover',
                                                bgcolor: 'upsplashButton.bg',
                                            }
                                        }}
                                        onClick={() => Router.push('/login')} variant="contained" startIcon={<LoginIcon />}>
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
                                            bgcolor: 'upsplashButton.bg',
                                            color: 'upsplashButton.main',
                                            borderColor: 'upsplashButton.main',
                                            ':hover': {
                                                borderColor: 'upsplashButton.hover',
                                                color: 'upsplashButton.hover',
                                                bgcolor: 'upsplashButton.bg',
                                            }
                                        }}
                                        startIcon={<LogoutIcon />}>
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
                    </Grid>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{
                    width: { lg: drawerWidth }, flexShrink: { lg: 0 }
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
                sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` }, position: 'relative' }}
            >
                <Toolbar />
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
                    style={{ padding: '0px' }}
                    maxWidth="100%"
                    ref={myRef}
                >
                    {children}
                </Container>
                {/* <GutterBottom /> */}
                <Footer bottom={bottom} />
            </Box>
        </Box>
    );
}

export default ResponsiveDrawer;
