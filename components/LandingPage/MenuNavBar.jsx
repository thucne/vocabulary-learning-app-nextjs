import * as React from 'react';

import Link from 'next/link';

import { styled, alpha } from '@mui/material/styles';

import {
    Menu, MenuItem, Divider, IconButton,
    Link as MuiLink, Stack, Avatar, Icon, SvgIcon
} from '@mui/material';

import {
    Menu as MenuIcon,
    Login as LoginIcon,
    AppRegistration as AppRegistrationIcon,
    Article as ArticleIcon,
    Support as SupportIcon,
    Signpost as SignpostIcon,
    Logout as LogoutIcon,
    Dashboard as DashboardIcon
} from '@mui/icons-material'

import { SXs } from '@styles';

import { useSelector } from 'react-redux';

import { stringAvatar } from '@utils';

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

export default function CustomizedMenus({ isAuth, logout }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const user = useSelector(state => state?.userData);

    return (
        <div>
            <IconButton
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                onClick={handleClick}
                sx={SXs.MUI_NAV_ICON_BUTTON}
            >
                <MenuIcon color='mui_button_inner' />
            </IconButton>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >

                {
                    (user?.name?.length > 0 || user?.photo?.formats?.thumbnail?.url?.length > 0) &&
                    <MenuItem disableRipple color='inherit' >
                        <Stack direction='row' alignItems='center'>
                            <Icon sx={{
                                color: 'inherit !important', m: '0px 12px 0px 0px',
                                display: 'flex', alignItems: 'center',
                                width: 18,
                                height: 24,
                            }}>
                                <Avatar
                                    src={user?.photo?.formats?.thumbnail?.url}
                                    {...stringAvatar(`${user?.name || 'No Name'}`)}
                                    sx={{
                                        width: 18,
                                        height: 18,
                                    }}
                                />
                            </Icon>
                            {user?.name?.split(' ')?.slice(-1)?.join(' ')}
                        </Stack>
                    </MenuItem>
                }
                {
                    !isAuth && <MenuItem disableRipple color='inherit' sx={{ p: 0 }}>
                        <Link href='/login' passHref>
                            <MuiLink underline='none' sx={menuSX}>
                                <Stack direction='row' alignItems='center'>
                                    <LoginIcon sx={{ color: 'inherit !important' }} />
                                    Log in
                                </Stack>
                            </MuiLink>
                        </Link>
                    </MenuItem>
                }
                {
                    !isAuth && <MenuItem disableRipple color='inherit' sx={{ p: 0 }}>
                        <Link href='/signup' passHref>
                            <MuiLink underline='none' sx={menuSX}>
                                <Stack direction='row' alignItems='center'>
                                    <AppRegistrationIcon sx={{ color: 'inherit !important' }} />
                                    Sign up
                                </Stack>
                            </MuiLink>
                        </Link>
                    </MenuItem>
                }
                {
                    isAuth && <MenuItem disableRipple color='inherit' sx={{ p: 0 }}>
                        <Link href='/dashboard' passHref>
                            <MuiLink underline='none' sx={menuSX}>
                                <Stack direction='row' alignItems='center'>
                                    <DashboardIcon sx={{ color: 'inherit !important' }} />
                                    Dashboard
                                </Stack>
                            </MuiLink>
                        </Link>
                    </MenuItem>
                }
                {
                    isAuth && <MenuItem disableRipple color='inherit'
                        onClick={() => {
                            if (logout) {
                                logout();
                            }
                        }}
                    >
                        <Stack direction='row' alignItems='center'>
                            <LogoutIcon sx={{ color: 'inherit !important' }} />
                            Log out
                        </Stack>
                    </MenuItem>
                }
                <Divider />
                <MenuItem disableRipple color='inherit' sx={{ p: 0 }}>
                    <Link href='/blogs' passHref>
                        <MuiLink underline='none' sx={menuSX}>
                            <Stack direction='row' alignItems='center'>
                                <ArticleIcon sx={{ color: 'inherit !important' }} />
                                Blogs
                            </Stack>
                        </MuiLink>
                    </Link>
                </MenuItem>
                <MenuItem disableRipple color='inherit' sx={{ p: 0 }}>
                    <Link href='/getting-started' passHref>
                        <MuiLink underline='none' sx={menuSX}>
                            <Stack direction='row' alignItems='center'>
                                <SignpostIcon sx={{ color: 'inherit !important' }} />
                                Getting started
                            </Stack>
                        </MuiLink>
                    </Link>
                </MenuItem>
                <Divider />
                <MenuItem disableRipple color='inherit' sx={{ p: 0 }}>
                    <Link href='/support' passHref>
                        <MuiLink underline='none' sx={menuSX}>
                            <Stack direction='row' alignItems='center'>
                                <SupportIcon sx={{ color: 'inherit !important' }} />
                                Support
                            </Stack>
                        </MuiLink>
                    </Link>
                </MenuItem>
            </StyledMenu>
        </div >
    );
}


const menuSX = {
    // color: theme => theme.palette.footer_title.main,
    color: theme => 'inherit !important',
    width: '100%',
    height: '100%',
    p: '6px 16px'
}