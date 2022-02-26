import React, { useEffect, useRef, useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import Grow from "@mui/material/Grow";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import DoneIcon from "@mui/icons-material/Done";

import { useTheme } from "@mui/material/styles";

import Image from "next/image";

import { Colors, Fonts } from "@styles";
import { useWindowSize } from "@utils";

import { RECAPTCHA } from "@config";

import { useDispatch, useSelector } from "react-redux";
import { updateVIP } from "@actions";

const dummyImage =
    "https://res.cloudinary.com/katyperrycbt/image/upload/v1645500815/djztmy2bmxvsywe1l8zx.png";

const showTypes = {
    ONLY_ONE: "ONLY_ONE",
    ALL: "ALL",
    HIDE: "HIDE",
};

const WordCard = ({ open, setOpen, wordList }) => {
    const windowSize = useWindowSize();
    const theme = useTheme();
    const audioRef = React.createRef(null);

    const dispatch = useDispatch();
    const recaptcha = useSelector((state) => state.recaptcha);

    const [loading, setLoading] = useState(false);
    const [wordIndex, setWordIndex] = useState(0);
    const [learnStatus, setLearnStatus] = useState([]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleFowardbutton = () => {
        let nextIndex = wordIndex === wordList.length - 1 ? 0 : wordIndex + 1;
        setWordIndex(nextIndex);
    };

    const handleBackbutton = () => {
        let prevIndex = wordIndex === 0 ? wordList.length - 1 : wordIndex - 1;
        setWordIndex(prevIndex);
    };

    const handleUpdateVIP = (data, callback) => {
        let formData = new FormData();
        if (window?.adHocFetch && recaptcha === true && window.grecaptcha) {
            grecaptcha.ready(function () {
                grecaptcha
                    .execute(`${RECAPTCHA}`, { action: "vip_authentication" })
                    .then(function (token) {
                        formData.append("data", JSON.stringify({ ...data, token }));
                        adHocFetch({
                            dispatch,
                            action: updateVIP(formData, wordList[wordIndex].id),
                            onSuccess: (res) => callback(),
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
                lastReview: lastReviewDate.toISOString(),
            },
        ]);
    };
    const handleOkRate = () => {
        let updatedField = {
            lastReview: Date.now(),
            lastReviewOK: true,
        };
        //Update review field
        handleUpdateVIP(updatedField, handleFowardbutton);

        // add to learn status
        adToLearnStatus(updatedField);
    };

    const handleNotOkRate = () => {
        let updatedField = {
            lastReview: Date.now(),
            lastReviewOK: false,
        };
        //Update review field
        handleUpdateVIP(updatedField, handleFowardbutton);

        // add to learn status
        adToLearnStatus(updatedField);
    };
    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll="paper"
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                fullScreen={
                    windowSize?.width < theme.breakpoints.values.sm ? true : false
                }
                maxWidth="sm"
            >
                <DialogContent
                    sx={{
                        position: "relative",
                        overflowX: "hidden",
                        width: ["full", "565px"],
                        height: ["100%", "680px"],
                    }}
                >
                    <Box>
                        <Box sx={{ ...style.flexCenter, flexDirection: "column" }}>
                            <Image
                                width={200}
                                height={200}
                                src={
                                    wordList[wordIndex]?.illustration?.formats?.small?.url ??
                                    dummyImage
                                }
                                alt="something"
                            />
                            <Box sx={style.flexCenter}>
                                <IconButton onClick={handleBackbutton}>
                                    <ArrowBackIosIcon sx={{ fontSize: Fonts.FS_16 }} />
                                </IconButton>

                                <Typography
                                    sx={{
                                        fontSize: Fonts.FS_18,
                                        fontWeight: Fonts.FW_600,
                                        mx: 3,
                                    }}
                                >
                                    {wordList[wordIndex].vip}
                                </Typography>

                                <IconButton onClick={handleFowardbutton}>
                                    <ArrowForwardIosIcon sx={{ fontSize: Fonts.FS_16 }} />
                                </IconButton>
                            </Box>

                            <Box sx={{ height: "20px" }}>
                                <Typography sx={{ color: Colors.GRAY_5 }}>
                                    {wordList[wordIndex].pronounce}
                                </Typography>
                            </Box>

                            {/* Audio  Section*/}
                            <IconButton
                                disabled={!wordList[wordIndex].audio}
                                onClick={() => audioRef.current.play()}
                            >
                                <PlayCircleFilledWhiteIcon sx={{ fontSize: Fonts.FS_16 }} />
                            </IconButton>
                            <audio ref={audioRef}>
                                <source src={wordList[wordIndex].audio} type="audio/mpeg" />
                            </audio>
                        </Box>

                        {/* Meaningis & example section */}
                        <Box sx={{ height: ["220px", "200px"] }}>
                            <DynamicListContent
                                {...listContentProps(wordList[wordIndex], showTypes.ONLY_ONE)
                                    .example}
                            />
                            <DynamicListContent
                                {...listContentProps(wordList[wordIndex], showTypes.HIDE)
                                    .english}
                            />

                            <DynamicListContent
                                {...listContentProps(wordList[wordIndex], showTypes.HIDE)
                                    .vietnamese}
                            />
                        </Box>

                        {/* Rating section */}
                        <Box sx={{ textAlign: "center", mt: 3 }}>
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
                    </Box>

                    {/* close button */}
                    <IconButton
                        sx={{ position: "absolute", top: 10, left: 10 }}
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogContent>
            </Dialog>
        </div>
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
                <Box sx={{ overflowY: "auto", maxHeight: "80px" }}>
                    <Typography sx={style.bubbleText}>{content[0]}</Typography>
                </Box>
            </Grow>
        );
    };

    if (!content.length) return <div></div>;
    return (
        <Box sx={{ height: "100px" }}>
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

const listContentProps = (form, showType) => ({
    vietnamese: {
        title: "Vietnamese Meanings",
        content: form.meanings.vietnamese,
        defaultShowType: showType,
    },
    english: {
        title: "English Meanings",
        content: form.meanings.english,
        defaultShowType: showType,
    },
    example: {
        title: "Example",
        content: form.examples,
        defaultShowType: showType,
    },
});

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
