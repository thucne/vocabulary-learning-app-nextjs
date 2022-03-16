import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";

import {
    Button, Dialog, DialogContent, DialogTitle,
    IconButton, Typography, Grid,
    DialogActions, CircularProgress
} from '@mui/material';

import {
    ArrowBackIosNewRounded as ArrowBackIosIcon,
    ArrowForwardIosRounded as ArrowForwardIosIcon,
    ArrowDropDownRounded as ArrowDropDownIcon,
    ArrowDropUpRounded as ArrowDropUpIcon,
    CloseRounded as CloseIcon,
    VolumeUpRounded as VolumeUpIcon,
    ThumbUpRounded as ThumbUpRoundedIcon,
    ThumbDownRounded as ThumbDownRoundedIcon,
    CloseRounded as CloseRoundedIcon
} from '@mui/icons-material';

import { useTheme } from "@mui/material/styles";

import { Colors, Fonts, SXs, Props } from "@styles";
import { useWindowSize, useThisToGetSizesFromRef, getAudioUrl, getOptimizedPraticeSet, useSettings } from "@utils";
import { RECAPTCHA } from "@config";
import { updateManyVIPs, updateVIP } from "@actions";
import { IMAGE_ALT, AUDIO_ALT } from '@consts';

import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import _ from 'lodash';

import LoadingImage from '@components/LoadingImage';
import SecondaryBlock from "./SecondaryBlock";

const showTypes = {
    ONLY_ONE: "ONLY_ONE",
    ALL: "ALL",
    HIDE: "HIDE",
};

const WordCard = ({ open, setOpen, wordList, settings }) => {

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

    const optimizedWordList = useCallback(() => getOptimizedPraticeSet(wordList, settings), [wordList, settings]);

    const userData = useSelector((state) => state.userData);
    const { objectFit = "contain" } = useSettings(userData);

    useEffect(() => {

        let canset = true;
        if (canset) {
            setWordIndex(0);
        }

        return () => canset = false;
    }, [optimizedWordList.length, open]);

    useEffect(() => {
        let canRun = true;

        const run = async () => {
            if (wordIndex < optimizedWordList.length && wordIndex >= 0 && canRun) {
                
                setLoadingAudio(true);
                setAudioUrl("");
                getAudioUrl(optimizedWordList[wordIndex].audio, (url) => {
                    setAudioUrl(url);
                    if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current.load();
                    }
                    setLoadingAudio(false);
                });
            }
        }

        if (canRun && _.isEqual) {
            run();
        }

        return () => canRun = false;

    }, [wordIndex, optimizedWordList]);

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
                return prev > optimizedWordList.length ? optimizedWordList.length - 1 : prev - 1;
            }
        });
    };


    const updateWordStatus = (value) => {
        setLearnStatus((prev) => {
            const findIndex = prev.findIndex((item) => item?.id === optimizedWordList?.[wordIndex]?.id);

            if (findIndex !== -1) {
                prev[findIndex].lastReviewOK = Boolean(value);
                return [...prev];
            } else {
                return [
                    ...prev,
                    {
                        id: optimizedWordList?.[wordIndex]?.id,
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

    const isThumbDownSelected = () => {
        return learnStatus.findIndex((item) => item?.id === optimizedWordList?.[wordIndex]?.id && item?.lastReviewOK === false) !== -1;
    }

    const isThumbUpSelected = () => {
        return learnStatus.findIndex((item) => item?.id === optimizedWordList?.[wordIndex]?.id && item?.lastReviewOK === true) !== -1;
    }

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
                fullWidth
                sx={{
                    '.MuiPaper-root': {
                        borderRadius: '10px',
                        maxWidth: windowSize?.width >= theme.breakpoints.values.sm ? 390 : '100%'
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
                            Words: {(wordIndex + 1) < optimizedWordList.length ? (wordIndex + 1) : optimizedWordList.length}/{optimizedWordList.length}
                        </Typography>
                    </Grid>
                </DialogTitle>

                <DialogContent dividers sx={{
                    position: 'relative'
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
                        wordIndex === optimizedWordList.length
                            ? <FinishDialog
                                handlePrevious={handlePrevious}
                                handleUpdateVIP={handleUpdateVIP}
                                handleClose={handleClose}
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
                                                optimizedWordList?.[wordIndex]?.illustration?.formats?.large?.url ||
                                                optimizedWordList?.[wordIndex]?.illustration?.url ||
                                                IMAGE_ALT
                                            }
                                            alt="something"
                                            objectFit={objectFit}
                                            layout='fill'
                                            quality={100}
                                            draggable={false}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={12} {...Props.GIRBC}>
                                    <Typography variant="caption">
                                        Last review: {moment(optimizedWordList?.[wordIndex]?.lastReview).fromNow()}.
                                        Status: {optimizedWordList?.[wordIndex]?.lastReviewOK ? 'remember' : 'don\'t remember'}.
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
                                        {optimizedWordList[wordIndex].vip}
                                    </Typography>

                                    <IconButton onClick={handleNext}>
                                        <ArrowForwardIosIcon sx={{ fontSize: Fonts.FS_16 }} />
                                    </IconButton>

                                </Grid>

                                <Grid item xs={12} {...Props.GIRCC} mt={1} sx={{ position: 'relative' }} >

                                    <Typography sx={{ color: (theme) => theme.palette.action.main }}>
                                        {optimizedWordList[wordIndex].pronounce}
                                    </Typography>

                                    {
                                        !loadingAudio ? <IconButton
                                            disabled={!optimizedWordList?.[wordIndex]?.audio}
                                            onClick={() => audioRef.current.play()}
                                            sx={{ fontSize: Fonts.FS_16, height: '25px', width: '25px', ml: 1 }}
                                        >
                                            <VolumeUpIcon fontSize='inherit' />
                                        </IconButton> : <CircularProgress size={16} sx={{ ml: 1 }} />
                                    }

                                    <audio ref={audioRef}>
                                        <source src={audioUrl || AUDIO_ALT} />
                                    </audio>

                                </Grid>

                                <Grid item xs={12} {...Props.GICCC} mt={1.5}>
                                    <SecondaryBlock data={optimizedWordList[wordIndex]} />
                                </Grid>

                            </Grid>
                    }
                </DialogContent>

                {
                    wordIndex < optimizedWordList.length && wordIndex >= 0 && <DialogActions>
                        <Grid container {...Props.GCRCC} spacing={1}>
                            <Grid item>
                                <Typography>Remember this word?</Typography>
                            </Grid>

                            <Grid item>
                                <IconButton
                                    onClick={() => updateWordStatus(false)}
                                    variant="outlined"
                                    sx={{
                                        ...SXs.MUI_NAV_ICON_BUTTON,
                                        backgroundColor: isThumbDownSelected() && Colors.LOGO_BLUE
                                    }}
                                >
                                    <ThumbDownRoundedIcon />
                                </IconButton>
                            </Grid>

                            <Grid item>
                                <IconButton
                                    onClick={() => updateWordStatus(true)}
                                    variant="outlined"
                                    sx={{
                                        ...SXs.MUI_NAV_ICON_BUTTON,
                                        backgroundColor: isThumbUpSelected() && Colors.LOGO_YELLOW
                                    }}
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

const FinishDialog = ({ handlePrevious, handleUpdateVIP, handleClose, loading }) => {
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

                <Grid container {...Props.GCRCC} spacing={1}>
                    <Button
                        sx={{ ...SXs.COMMON_BUTTON_STYLES, mt: 2, minWidth: '0px' }}
                        onClick={handleUpdateVIP}
                        // size="large"
                        variant="contained"
                        disableElevation
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>

            <Grid item {...Props.GIRCC} mt={5}>
                <Button
                    onClick={handlePrevious}
                    variant="outlined"
                    sx={{ ...SXs.COMMON_BUTTON_STYLES, mr: 1 }}
                    disabled={loading}
                    startIcon={<ArrowBackIosIcon />}
                    size="small"
                >
                    Back
                </Button>
                <Button
                    sx={{ ...SXs.COMMON_BUTTON_STYLES }}
                    onClick={handleClose}
                    size="small"
                    variant="outlined"
                    endIcon={<CloseRoundedIcon />}
                    disabled={loading}
                >
                    Close
                </Button>
            </Grid>
        </Grid>
    );
};

export default WordCard;
