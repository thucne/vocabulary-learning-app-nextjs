import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";

import {
    Button, Dialog, DialogContent, DialogContentText, DialogTitle,
    Box, IconButton, Typography, Grow, Grid, Tabs, Tab, TabList,
    DialogActions
} from '@mui/material';

import {
    ArrowBackIosNewRounded as ArrowBackIosIcon,
    ArrowForwardIosRounded as ArrowForwardIosIcon,
    ArrowDropDownRounded as ArrowDropDownIcon,
    ArrowDropUpRounded as ArrowDropUpIcon,
    CloseRounded as CloseIcon,
    VolumeUpRounded as VolumeUpIcon,
    ThumbUpRounded as ThumbUpRoundedIcon,
    ThumbDownRounded as ThumbDownRoundedIcon
} from '@mui/icons-material';

import { useTheme } from "@mui/material/styles";

import { Colors, Fonts, SXs, Props } from "@styles";
import { useWindowSize, useThisToGetSizesFromRef, getAudioUrl } from "@utils";
import { RECAPTCHA } from "@config";
import { updateManyVIPs, updateVIP } from "@actions";
import { IMAGE_ALT, AUDIO_ALT } from '@consts';

import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import LoadingImage from '@components/LoadingImage';
import SecondaryBlock from "./SecondaryBlock";

const showTypes = {
    ONLY_ONE: "ONLY_ONE",
    ALL: "ALL",
    HIDE: "HIDE",
};

const WordCard = ({ open, setOpen, wordList }) => {

    const windowSize = useWindowSize();
    const theme = useTheme();

    const audioRef = useRef(null);
    const photoRef = useRef(null);

    const dispatch = useDispatch();
    const recaptcha = useSelector((state) => state.recaptcha);

    const [loading, setLoading] = useState(false);
    const [wordIndex, setWordIndex] = useState(0);
    const [learnStatus, setLearnStatus] = useState([]);
    const [audioUrl, setAudioUrl] = useState("");
    const [loadingAudio, setLoadingAudio] = useState(false);

    useEffect(() => {
        setWordIndex(0);
    }, [wordList.length, open]);

    useEffect(() => {
        const run = async () => {
            if (wordIndex < wordList.length && wordIndex >= 0) {
                setLoadingAudio(true);
                setAudioUrl("");
                getAudioUrl(wordList[wordIndex].audio, (url) => {
                    setAudioUrl(url);
                    if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current.load();
                    }
                    setLoadingAudio(false);
                });
            }
        }
        run();
    }, [wordIndex, wordList]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleUpdateVIP = () => {
        const now = new Date();

        let data = [...learnStatus].map(item => ({
            ...item,
            lastReview: now.toISOString(),
        })).sort((a, b) => a.id - b.id);

        if (window?.adHocFetch && recaptcha === true && window?.grecaptcha) {
            grecaptcha.ready(function () {
                grecaptcha
                    .execute(`${RECAPTCHA}`, { action: "vip_authentication" })
                    .then(function (token) {

                        adHocFetch({
                            dispatch,
                            action: updateManyVIPs({ data, token }),
                            onSuccess: (res) => { setWordIndex(0); handleClose() },
                            onError: (error) => console.log(error),
                            onStarting: () => setLoading(true),
                            onFinally: () => setLoading(false),
                            snackbarMessageOnSuccess: "Updated!",
                        });
                    });
            });
        }
    };

    const handleNext = () => {
        setWordIndex(prev => prev + 1);
    };

    const handlePrevious = () => {
        setWordIndex(prev => {
            if (prev === 0) {
                return 0;
            } else {
                return prev > wordList.length ? wordList.length - 1 : prev - 1;
            }
        });
    };


    const updateWordStatus = (value) => {
        setLearnStatus((prev) => {
            const findIndex = prev.findIndex((item) => item.id === wordList[wordIndex].id);

            if (findIndex !== -1) {
                prev[findIndex].lastReviewOK = Boolean(value);
                return [...prev];
            } else {
                return [
                    ...prev,
                    {
                        id: wordList?.[wordIndex]?.id,
                        lastReviewOK: Boolean(value),
                    },
                ];
            }
        });
        handleNext();
    };

    const photoSizes = useThisToGetSizesFromRef(photoRef, {
        revalidate: 1000,
        terminalCondition: ({ width }) => width !== 0,
        falseCondition: ({ width }) => width === 0,
    });

    return (
        <div>
            <Dialog
                open={open}
                onClose={loading ? null : handleClose}
                scroll="paper"
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                fullScreen={windowSize?.width < theme.breakpoints.values.sm ? true : false}
                maxWidth="xs"
                sx={{
                    '.MuiPaper-root': {
                        borderRadius: '10px',
                        maxWidth: windowSize?.width > theme.breakpoints.values.sm && 390,
                        width: '100%',
                        height: '100%'
                    }
                }}
            >
                <DialogTitle sx={{ py: 1 }}>
                    <Grid item xs={12} {...Props.GIRBC}>
                        <IconButton
                            sx={{
                                ...SXs.MUI_NAV_ICON_BUTTON,
                                width: '30px',
                                height: '30px',
                                fontSize: '25px',
                                borderRadius: '5px',
                            }}
                            onClick={loading ? null : handleClose}
                        >
                            <CloseIcon fontSize='inherit' />
                        </IconButton>
                        <Typography variant="h6" sx={{
                            display: 'inline',
                            fontWeight: Fonts.FW_500,
                        }}>
                            Practice Set
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'inline' }}>
                            Words: {(wordIndex + 1) < wordList.length ? (wordIndex + 1) : wordList.length}/{wordList.length}
                        </Typography>
                    </Grid>
                </DialogTitle>

                <DialogContent dividers sx={{
                    position: 'relative',
                }}>
                    {/* <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                        <div style={{ position: 'relative', width: '100%', height: '100%', opacity: 0.1 }}>
                            <Image
                                src="/logo.icon.svg"
                                alt="Logo"
                                layout='fill'
                                draggable={false}
                                objectFit='contain'
                            />
                        </div>
                    </div> */}
                    {
                        wordIndex === wordList.length
                            ? <FinishDialog
                                handleBackbutton={handlePrevious}
                                handleUpdateVIP={handleUpdateVIP}
                                loading={loading}
                            />
                            : <Grid container {...Props.GCRCC} sx={{ overflow: 'hidden' }}>

                                <Grid ref={photoRef} item xs={12} {...Props.GIRCC}>
                                    <div style={{
                                        width: photoSizes?.width,
                                        height: photoSizes?.width,
                                        position: 'relative',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        marginTop: '5px'
                                    }}>
                                        <LoadingImage
                                            src={
                                                wordList?.[wordIndex]?.illustration?.formats?.large?.url ||
                                                wordList?.[wordIndex]?.illustration?.url ||
                                                IMAGE_ALT
                                            }
                                            alt="something"
                                            objectFit="contain"
                                            layout='fill'
                                            quality={100}
                                            draggable={false}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={12} {...Props.GIRBC}>
                                    <Typography variant="caption">
                                        Last review: {moment(wordList?.[wordIndex]?.lastReview).fromNow()}.
                                        Status: {wordList?.[wordIndex]?.lastReviewOK ? 'remember' : 'don\'t remember'}.
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} {...Props.GIRBC} mt={3}>
                                    <IconButton onClick={handlePrevious} disabled={wordIndex === 0}>
                                        <ArrowBackIosIcon sx={{ fontSize: Fonts.FS_16 }} />
                                    </IconButton>

                                    <Typography
                                        variant='h5'
                                        sx={{ fontWeight: Fonts.FW_600, mx: 3 }}
                                        className='overflowTypography'
                                    >
                                        {wordList[wordIndex].vip}
                                    </Typography>

                                    <IconButton onClick={handleNext}>
                                        <ArrowForwardIosIcon sx={{ fontSize: Fonts.FS_16 }} />
                                    </IconButton>

                                </Grid>

                                <Grid item xs={12} {...Props.GIRCC} mt={1} sx={{ position: 'relative' }} >

                                    <Typography sx={{ color: (theme) => theme.palette.action.main }}>
                                        {wordList[wordIndex].pronounce}
                                    </Typography>

                                    {
                                        !loadingAudio && <IconButton
                                            disabled={!wordList?.[wordIndex]?.audio}
                                            onClick={() => audioRef.current.play()}
                                            sx={{ fontSize: Fonts.FS_16, height: '25px', width: '25px', ml: 1 }}
                                        >
                                            <VolumeUpIcon fontSize='inherit' />
                                        </IconButton>
                                    }

                                    <audio ref={audioRef}>
                                        <source src={audioUrl || AUDIO_ALT} />
                                    </audio>

                                </Grid>

                                <Grid item xs={12} {...Props.GICCC} mt={1.5}>
                                    <SecondaryBlock data={wordList[wordIndex]} />
                                </Grid>

                            </Grid>
                    }
                </DialogContent>

                {
                    wordIndex < wordList.length && wordIndex >= 0 && <DialogActions>
                        <Grid container {...Props.GCRCC} spacing={1}>
                            <Grid item>
                                <Typography>Remember this word?</Typography>
                            </Grid>

                            <Grid item>
                                <IconButton
                                    onClick={() => updateWordStatus(false)}
                                    variant="outlined"
                                    sx={SXs.MUI_NAV_ICON_BUTTON}
                                >
                                    <ThumbDownRoundedIcon />
                                </IconButton>
                            </Grid>

                            <Grid item>
                                <IconButton
                                    onClick={() => updateWordStatus(true)}
                                    variant="outlined"
                                    sx={SXs.MUI_NAV_ICON_BUTTON}
                                >
                                    <ThumbUpRoundedIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </DialogActions>
                }
            </Dialog>
        </div>
    );
};

const FinishDialog = ({ handleBackbutton, handleUpdateVIP, loading }) => {
    return (
        <Grid container {...Props.GCCBC} sx={{ height: "100%" }}>
            <Grid item {...Props.GICCC}>
                <div style={{ width: 200, height: 200, borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                    <LoadingImage
                        src="https://res.cloudinary.com/katyperrycbt/image/upload/v1646233521/imageedit_7_8841258520_qlcyao.gif"
                        alt="finish-img"
                        layout='fill'
                        draggable={false}
                    />
                </div>
                <Typography
                    component="h1"
                    sx={{
                        fontSize: Fonts.FS_20,
                        p: "16px 0px 0px",
                        fontWeight: Fonts.FW_500,
                    }}
                >
                    Well done! You finished the quiz!
                </Typography>

                <Typography
                    component="p"
                    sx={{ fontSize: Fonts.FS_15, p: "8px 0px 0px" }}
                    align="center"
                >
                    Save the progress so next time you can start with more optimized word list
                </Typography>

                <Button
                    sx={{ ...SXs.COMMON_BUTTON_STYLES, mt: 1 }}
                    onClick={handleUpdateVIP}
                    size="small"
                    variant="text"
                >
                    Update
                </Button>
            </Grid>

            <Grid item {...Props.GIRCC}>
                <Button
                    onClick={handleBackbutton}
                    variant="outlined"
                    sx={{ ...SXs.COMMON_BUTTON_STYLES }}
                    disabled={loading}
                    startIcon={<ArrowBackIosIcon />}
                    size="small"
                >
                    Go back
                </Button>
            </Grid>
        </Grid>
    );
};

export default React.memo(WordCard);
