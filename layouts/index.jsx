import React, { useEffect, useState } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Container, Snackbar, Slide, Alert as MuiAlert, Backdrop, LinearProgress, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { styled } from '@mui/system';

import * as t from '@consts';
import { FB } from 'config';

import Meta from "@components/Meta";
import Navigation from '@components/Navigation';

const TransitionRight = (props) => {
    return <Slide {...props} direction="left" />;
}

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledProgess = styled(LinearProgress)(({
    '.MuiLinearProgress-bar1Determinate': {
        backgroundImage: 'linear-gradient(to right, red,orange,yellow,green,blue,indigo,violet) !important'
    }
}));


const Layout = ({ children, login }) => {
    const router = useRouter();
    const [openMessage, setOpenMessage] = useState(false);

    const dispatch = useDispatch();
    const snackbar = useSelector(state => state.snackbar);
    const linear = useSelector(state => state.linear);
    const backdrop = useSelector(state => state.backdrop);

    useEffect(() => {
        if (router?.query?.message) {
            setOpenMessage(true);
        }
    }, [router]);

    const handleClose = async (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        dispatch({ type: t.HIDE_SNACKBAR, payload: {} });
    };

    const handleClose2 = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenMessage(false);
    };

    return <Container maxWidth="100%" style={{
        padding: 0,
        pointerEvents: backdrop?.show ? 'none' : 'auto',
    }}>
        <Meta />
        <Backdrop
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: '#00000090'
            }}
            open={backdrop?.show}
        >
            <div style={{
                width: 100, height: 100,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative'
                    }}
                >
                    <Image
                        src='https://res.cloudinary.com/katyperrycbt/image/upload/v1642755521/aa_cgipsy.svg'
                        layout='fill'
                        alt='loading'
                        priority={true}
                    />
                </div>
            </div>
        </Backdrop>

        {
            linear?.show && <StyledProgess sx={{
                position: 'fixed',
                top: 0,
                zIndex: 100000,
                width: '100%'
            }} variant="determinate" value={linear?.percentage ? linear.percentage : 0} />
        }
        {
            snackbar?.show && snackbar?.message &&
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                TransitionComponent={TransitionRight}
                open={snackbar?.show}
                autoHideDuration={snackbar?.duration ? snackbar.duration : 2000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity={snackbar?.type ? snackbar.type : 'success'} sx={{ width: '100%' }}>
                    {snackbar?.message}
                </Alert>
            </Snackbar>
        }
        {
            router?.query?.message?.length > 0 &&
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                TransitionComponent={TransitionRight}
                autoHideDuration={2000}
                onClose={handleClose2}
                open={openMessage}
            >
                <Alert severity={router?.query?.typeMessage ? router.query.typeMessage : 'info'} sx={{ width: '100%' }}>
                    {router?.query?.message}
                </Alert>
            </Snackbar>
        }
        {
            !login ? <Navigation>
                {children}
            </Navigation> : children
        }
    </Container>
}

export default Layout;