import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";

import {
    Button, Dialog, DialogContent, DialogContentText, DialogTitle,
    Box, IconButton, Typography, Grow, Grid, Tabs, Tab, TabList,
} from '@mui/material';

import {
    ArrowBackIosNewRounded as ArrowBackIosIcon,
    ArrowForwardIosRounded as ArrowForwardIosIcon,
    ArrowDropDownRounded as ArrowDropDownIcon,
    ArrowDropUpRounded as ArrowDropUpIcon,
    CloseRounded as CloseIcon,
    PlayCircleFilledWhite as PlayCircleFilledWhiteIcon,
    DoNotDisturb as DoNotDisturbIcon,
    Done as DoneIcon,
    VolumeUp as VolumeUpIcon
} from '@mui/icons-material';

import { useTheme } from "@mui/material/styles";

import { Colors, Fonts, SXs, Props } from "@styles";
import { useWindowSize, useThisToGetSizesFromRef, useThisToGetPositionFromRef, getAudioUrl } from "@utils";
import { RECAPTCHA } from "@config";
import { updateManyVIPs, updateVIP } from "@actions";
import { IMAGE_ALT, AUDIO_ALT } from '@consts';

import { useDispatch, useSelector } from "react-redux";

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
    const pronounceRef = useRef(null);
    const pronounceGridRef = useRef(null);

    const dispatch = useDispatch();
    const recaptcha = useSelector((state) => state.recaptcha);

    const [loading, setLoading] = useState(false);
    const [wordIndex, setWordIndex] = useState(0);
    const [learnStatus, setLearnStatus] = useState([]);
    const [audioUrl, setAudioUrl] = useState("");
    const [loadingAudio, setLoadingAudio] = useState(false);

    useEffect(() => {
        const run = async () => {
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
        run();
    }, [wordIndex, wordList]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleFowardbutton = () => {
        let nextIndex = wordIndex + 1;
        setWordIndex(nextIndex);
    };

    const handleBackbutton = () => {
        let prevIndex =
            wordIndex === 0
                ? 0
                : wordIndex >= wordList.length
                    ? wordList.length - 1
                    : wordIndex - 1;
        setWordIndex(prevIndex);
    };

    const handleUpdateVIP = () => {
        let data = [...learnStatus];

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

    const adToLearnStatus = (status) => {
        const { lastReviewOK, lastReview } = status;

        //lastReview is in seconds
        const lastReviewDate = new Date(lastReview);

        setLearnStatus((state) => [
            ...state,
            {
                id: wordList[wordIndex].id,
                lastReviewOK,
                lastReview: lastReviewDate,
            },
        ]);
    };

    const handleOkRate = () => {
        let updatedField = {
            lastReview: Date.now(),
            lastReviewOK: true,
        };

        // add to learn status
        adToLearnStatus(updatedField);

        handleFowardbutton()
    };

    const handleNotOkRate = () => {
        let updatedField = {
            lastReview: Date.now(),
            lastReviewOK: false,
        };

        // add to learn status
        adToLearnStatus(updatedField);

        handleFowardbutton()
    };

    const photoSizes = useThisToGetSizesFromRef(photoRef, {
        revalidate: 1000,
        terminalCondition: ({ width }) => width !== 0,
        falseCondition: ({ width }) => width === 0,
    });

    const pronouncePositions = useThisToGetPositionFromRef(pronounceRef, {
        revalidate: 1000,
        terminalCondition: ({ left, top }) => Number(left) > 0 && Number(top) > 0,
        falseCondition: ({ left, top }) => !left || !top,
    })

    const pronounceGridPositions = useThisToGetPositionFromRef(pronounceGridRef, {
        revalidate: 1000,
        terminalCondition: ({ left, top }) => Number(left) > 0 && Number(top) > 0,
        falseCondition: ({ left, top }) => !left || !top,
    })

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
                sx={{ '.MuiPaper-root': { borderRadius: '10px' } }}
            >
                <DialogContent dividers>
                    <IconButton
                        sx={{
                            ...SXs.MUI_NAV_ICON_BUTTON
                        }}
                        onClick={loading ? null : handleClose}
                    >
                        <CloseIcon />
                    </IconButton>
                    {
                        wordIndex === wordList.length
                            ? <FinishDialog
                                handleBackbutton={handleBackbutton}
                                handleUpdateVIP={handleUpdateVIP}
                                loading={loading}
                            />
                            : <Grid container {...Props.GCRCC} sx={{ overflow: 'hidden' }}>

                                <Grid item xs={12} {...Props.GIRBC} mt={2}>
                                    <Typography variant="h5" gutterBottom sx={{
                                        display: 'inline',
                                        fontWeight: Fonts.FW_600,
                                        // fontSize: Fonts.FS_18,
                                    }}>
                                        Practice Set
                                    </Typography>
                                    <Typography variant="caption" gutterBottom sx={{ display: 'inline' }}>
                                        Words: {wordIndex + 1}/{wordList.length}
                                    </Typography>
                                </Grid>

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
                                                wordList[wordIndex]?.illustration?.formats?.small?.url ||
                                                IMAGE_ALT
                                            }
                                            alt="something"
                                            objectFit="contain"
                                            layout='fill'
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={12} {...Props.GIRBC} mt={3}>
                                    <IconButton onClick={handleBackbutton} disabled={wordIndex === 0}>
                                        <ArrowBackIosIcon sx={{ fontSize: Fonts.FS_16 }} />
                                    </IconButton>

                                    <Typography
                                        variant='h5'
                                        sx={{ fontWeight: Fonts.FW_600, mx: 3 }}
                                        className='overflowTypography'
                                    >
                                        {wordList[wordIndex].vip}
                                    </Typography>

                                    <IconButton onClick={handleFowardbutton}>
                                        <ArrowForwardIosIcon sx={{ fontSize: Fonts.FS_16 }} />
                                    </IconButton>

                                </Grid>

                                <Grid ref={pronounceGridRef} item xs={12} {...Props.GIRCC} mt={1.5}
                                    sx={{ position: 'relative' }}
                                >

                                    <Typography ref={pronounceRef} sx={{
                                        color: (theme) => theme.palette.action.main
                                    }}>
                                        {wordList[wordIndex].pronounce}
                                    </Typography>

                                    {
                                        !loadingAudio && <IconButton
                                            disabled={!wordList[wordIndex].audio}
                                            onClick={() => audioRef.current.play()}
                                            sx={{
                                                position: 'absolute',
                                                // top: pronouncePositions?.top,
                                                left: pronouncePositions?.left - pronouncePositions?.height - 10 - pronounceGridPositions?.left,
                                                height: pronouncePositions?.height,
                                                width: pronouncePositions?.height,
                                                fontSize: pronouncePositions?.height * 0.9
                                            }}
                                        >
                                            <VolumeUpIcon fontSize='inherit' />
                                        </IconButton>
                                    }
                                    <audio ref={audioRef}>
                                        <source src={audioUrl || AUDIO_ALT} />
                                    </audio>

                                </Grid>

                                <Grid item xs={12} {...Props.GICCC} mt={1.5}>
                                    <SecondaryBlock data={wordList[wordIndex]}/>
                                </Grid>

                                {/* Rating section */}
                                <Box sx={{ textAlign: "center", mt: [0, 3] }}>
                                    <Typography sx={style.text}>Rate this word</Typography>
                                    <Box>
                                        <Button
                                            onClick={handleNotOkRate}
                                            variant="outlined"
                                            sx={{ m: 2 }}
                                            startIcon={<DoNotDisturbIcon />}
                                        >
                                            Not Ok
                                        </Button>
                                        <Button
                                            onClick={handleOkRate}
                                            variant="contained"
                                            sx={{ m: 2 }}
                                            endIcon={<DoneIcon />}
                                        >
                                            Ok
                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>
                    }
                </DialogContent>
            </Dialog>
        </div>
    );
};

const FinishDialog = ({ handleBackbutton, handleUpdateVIP, loading }) => {
    return (
        <Box sx={{ ...style.flexCenter, flexDirection: "column", height: "100%" }}>
            <Image src="https://res.cloudinary.com/katyperrycbt/image/upload/v1645968644/n9y7xgh5qr8ohlvibet0.png"
                alt="finish-img" width={200} height={200} />
            <Typography
                component="h1"
                sx={{
                    fontSize: Fonts.FS_24,
                    p: "16px 0px 0px",
                    fontWeight: Fonts.FW_500,
                }}
            >
                You have review all words.
            </Typography>

            <Typography
                component="p"
                sx={{ fontSize: Fonts.FS_15, p: "8px 0px 0px" }}
            >
                Let&apos;s update your words status
                <Button onClick={handleUpdateVIP}>update</Button>
            </Typography>

            <Button
                onClick={handleBackbutton}
                variant="contained"
                sx={{ m: 2 }}
                disabled={loading}
                startIcon={<ArrowBackIosIcon />}
            >
                Go back
            </Button>
        </Box>
    );
};

const DynamicListContent = ({ title, content, defaultShowType }) => {
    const style = {
        bubbleText: {
            color: Colors.BLACK,
            bgcolor: Colors.GRAY_2,
            px: 2,
            py: 1,
            mb: 2,
            borderRadius: "5px",
        },
    };
    const showOrder = [showTypes.HIDE, showTypes.ONLY_ONE];
    const [showType, setShowType] = useState(defaultShowType);

    const handleChangeShowType = () => {
        let index = showOrder.indexOf(showType);
        let tempt = index === showOrder.length - 1 ? 0 : index + 1;
        setShowType(showOrder[tempt]);
    };

    const renderFormType = () => {
        return (
            <Grow in={showType === "ONLY_ONE"} style={{ transformOrigin: "0 0 0" }}>
                <Box sx={{ overflowY: "auto", maxHeight: "60px" }}>
                    <Typography sx={style.bubbleText}>{content[0]}</Typography>
                </Box>
            </Grow>
        );
    };

    if (!content.length) return <div></div>;
    return (
        <Box sx={{ height: ["100px", "100px"] }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <div>
                    <Typography
                        sx={{
                            fontSize: Fonts.FS_16,
                            fontWeight: Fonts.FW_500,
                            display: "inline-block",
                        }}
                    >
                        {title}
                    </Typography>
                </div>
                {showType === "ONLY_ONE" ? (
                    <ArrowDropUpIcon onClick={handleChangeShowType} />
                ) : (
                    <ArrowDropDownIcon onClick={handleChangeShowType} />
                )}
            </Box>
            <Box sx={{ maxHeight: "100px", width: "100%" }}>{renderFormType()}</Box>
        </Box>
    );
};

const style = {
    flexCenter: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: Fonts.FS_16,
        fontWeight: Fonts.FW_600,
    },
    bubbleText: {
        color: Colors.BLACK,
        bgcolor: Colors.GRAY_3,
        px: 2,
        py: 1,
        borderRadius: "5px",
    },
};


export default React.memo(WordCard);
