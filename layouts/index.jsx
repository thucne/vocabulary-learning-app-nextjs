import React, { useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/router";
import Script from "next/script";

import {
    Container,
    Snackbar,
    Slide,
    Alert as MuiAlert,
    Backdrop,
    LinearProgress,
    Button
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/system";

import * as t from "@consts";
import { RECAPTCHA } from "@config";

import Meta from "@components/Meta";
import Navigation from "@components/Navigation";
import ConfirmDialog from "components/ConfirmDialog";

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

import { SXs } from '@styles';

const TransitionRight = (props) => {
    return <Slide {...props} direction="left" />;
};

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledProgess = styled(LinearProgress)({
    ".MuiLinearProgress-bar1Determinate": {
        backgroundImage:
            "linear-gradient(to right, #64b5f6 0%, #ffd54f 100%) !important",
    },
});

const Layout = ({ children, login = false, landing = false, noMeta = false, tabName = "", noBack = false }) => {
    const router = useRouter();
    const [openMessage, setOpenMessage] = useState(false);

    const dispatch = useDispatch();
    const snackbar = useSelector((state) => state.snackbar);
    const linear = useSelector((state) => state.linear);
    const backdrop = useSelector((state) => state.backdrop);
    const confirmDialog = useSelector((state) => state?.confirmDialog);
    const blurScreen = useSelector((state) => state?.blurScreen);

    useEffect(() => {
        const handleRouteChange = () => dispatch({ type: t.SHOW_BACKDROP });

        const handleDone = () => dispatch({ type: t.HIDE_BACKDROP })

        router.events.on('routeChangeStart', handleRouteChange);
        router.events.on('routeChangeComplete', handleDone);
        router.events.on('routeChangeError', handleDone);

        // If the component is unmounted, unsubscribe
        // from the event with the `off` method:
        // return () => {
        //     router.events.off('routeChangeStart', handleRouteChange);
        //     router.events.off('routeChangeComplete', handleDone);
        //     router.events.off('routeChangeError', handleDone);
        // }
    }, [router, dispatch]);

    useEffect(() => {
        if (router?.query?.message) {
            setOpenMessage(true);
        }
    }, [router]);

    useEffect(() => {
        if (tabName) {
            dispatch({ type: t.SET_TAB_NAME, payload: tabName });
        }
        return () => dispatch({ type: t.RESET_TAB_NAME });
    }, [tabName, dispatch, router]);

    const handleClose = async (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        dispatch({ type: t.HIDE_SNACKBAR, payload: {} });
    };

    const handleClose2 = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenMessage(false);
    };

    return (
        <Container
            maxWidth={false}
            disableGutters
            style={{
                pointerEvents: backdrop?.show ? "none" : "auto",
            }}
        >
            <ConfirmDialog
                open={confirmDialog?.show}
                data={confirmDialog?.data}
                handleClose={() => dispatch({ type: t.HIDE_CONFIRM_DIALOG })}
            />
            {
                !login && !landing && router?.asPath !== "/" && !noBack && <Button
                    sx={{
                        position: "fixed",
                        zIndex: "1000",
                        bottom: "1rem",
                        right: "1rem",
                        ...SXs.COMMON_BUTTON_STYLES
                    }}
                    onClick={() => router.back()}
                    startIcon={<ArrowBackRoundedIcon />}
                    size="small"
                    variant="outlined"
                >
                    Back
                </Button>
            }
            {
                !noMeta && <Meta />
            }
            <Script
                id="recaptcha-v3"
                src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA}`}
                onLoad={() => dispatch({ type: t.DONE_RECAPTCHA })}
            />
            <Backdrop
                sx={{
                    zIndex: (theme) => theme.zIndex.modal + 1,
                    backgroundColor: "#00000090",
                }}
                open={backdrop?.show}
            >
                <div
                    style={{
                        width: 170,
                        height: 170,
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "relative",
                            borderRadius: "10px",
                            overflow: "hidden",
                        }}
                    >
                        <Image
                            src="https://res.cloudinary.com/katyperrycbt/image/upload/v1645608152/Double_Ring-1s-200px_nw6bl0.svg"
                            layout="fill"
                            alt="loading"
                            draggable={false}
                        />
                    </div>
                    <div style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        height: 50,
                        width: 50,
                    }}>
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                position: "relative",
                                borderRadius: "10px",
                                overflow: "hidden",
                            }}
                        >
                            <Image
                                src="/logo.icon.svg"
                                layout="fill"
                                alt="Logo"
                                draggable={false}
                            />
                        </div>
                    </div>
                </div>
            </Backdrop>

            {linear?.show && (
                <StyledProgess
                    sx={{
                        position: "fixed",
                        top: 0,
                        zIndex: 100000,
                        width: "100%",
                    }}
                    variant="determinate"
                    value={linear?.percentage ? linear.percentage : 0}
                />
            )}
            {snackbar?.show && snackbar?.message && (
                <Snackbar
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    TransitionComponent={TransitionRight}
                    open={snackbar?.show}
                    autoHideDuration={snackbar?.duration ? snackbar.duration : 2000}
                    onClose={handleClose}
                >
                    <Alert
                        onClose={handleClose}
                        severity={snackbar?.type ? snackbar.type : "success"}
                        sx={{ width: "100%", "&.MuiPaper-root": { borderRadius: '10px' } }}
                    >
                        {snackbar?.message}
                    </Alert>
                </Snackbar>
            )}
            {router?.query?.message?.length > 0 && (
                <Snackbar
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    TransitionComponent={TransitionRight}
                    autoHideDuration={2000}
                    onClose={handleClose2}
                    open={openMessage}
                >
                    <Alert
                        severity={
                            router?.query?.typeMessage ? router.query.typeMessage : "info"
                        }
                        sx={{ width: "100%" }}
                    >
                        {router?.query?.message}
                    </Alert>
                </Snackbar>
            )}
            {!login ? (
                <Navigation landing={landing}>{children}</Navigation>
            ) : (
                children
            )}
        </Container>
    );
};

export default Layout;
