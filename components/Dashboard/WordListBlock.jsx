import React, { useState, useRef, useMemo, useEffect } from "react";

import { Container, Grid, Typography, IconButton, Stack } from "@mui/material";

import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { Fonts, SXs } from "@styles";
import { IMAGE_ALT } from "@consts";

import LoadingImage from "@components/LoadingImage";
import { useSelector } from "react-redux";

import ScrollPaper from "@tallis/react-mui-scroll-view";
// import ScrollPaper from './ScrollPaper';

import { isEqual, differenceWith } from "lodash";

const WordListBlock = () => {
    const theme = useTheme();
    const [sizes, setSizes] = useState({ width: 0, height: 0 });
    const [words, setWords] = useState([]);
    const wordList = useSelector((state) =>
        state.userData?.vips?.length > 0 ? state.userData.vips : []
    );

    const config = {
        mui: {
            Grid,
            Container,
            IconButton,
            Stack,
            ArrowBackIcon,
            ArrowForwardIcon,
        },
        buttonIconStyle: {
            // backgroundColor: theme.palette.scroll_button.main,
            ...SXs.MUI_NAV_ICON_BUTTON,
        },
        iconStyle: {
            fontSize: Fonts.FS_20,
        },
        getElementSizes: (data) => {
            if (JSON.stringify(sizes) !== JSON.stringify(data)) {
                setSizes(data);
            }
        },
        elementStyle: {
            // "&:hover": { filter: "brightness(1)" }
        },
        containerStyle: {
            maxWidth: "100%",
        },
        gridItemSize: {
            xs: 6,
            sm: 4,
            md: 3,
            lg: 2,
        },
        showScrollbar: true,
        React,
    };

    useEffect(() => {
        setWords((prev) => {
            if (!isEqual(prev, wordList)) {
                return wordList;
            }
            return prev;
        });
    }, [wordList]);

    // sort by updatedAt
    const memorizedWord = useMemo(
        () => words.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
        [words]
    );

    return (
        <Container maxWidth="lg" disableGutters>
            <Grid container direction="row" mt={[0, 1, 2, 3]}>
                <Grid item xs={12}>
                    <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        sx={{ fontWeight: Fonts.FW_500 }}
                    >
                        Word List
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ px: 2 }}>
                    <ScrollPaper {...config}>
                        {memorizedWord?.length > 0 &&
                            memorizedWord.map((word, index) => (
                                <EachChild
                                    key={`render-word-list-${index}`}
                                    word={word}
                                    width={sizes.width}
                                />
                            ))}
                    </ScrollPaper>
                </Grid>
            </Grid>
        </Container>
    );
};

const EachChild = ({ word, width }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);

    const photo =
        word?.illustration?.formats?.small?.url ||
        word?.illustration?.url ||
        IMAGE_ALT;

    return (
        <div
            style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
        >
            <div
                style={{
                    position: "relative",
                    width: `calc(${width}px - ${theme.spacing(3)})`,
                    height: `calc(${width}px - ${theme.spacing(3)})`,
                    overflow: "hidden",
                    borderRadius: "10px",
                }}
            >
                <LoadingImage
                    src={photo}
                    alt="Illustration"
                    layout="fill"
                    objectFit="contain"
                    priority={true}
                    draggable={false}
                    doneLoading={() => setLoading(false)}
                />
            </div>
            {!loading && (
                <Grid item>
                    <Typography
                        sx={{
                            fontWeight: Fonts.FW_500,
                            fontSize: [Fonts.FS_18],
                            mt: 2,
                        }}
                        className="overflowTypography"
                    >
                        {word?.vip}
                    </Typography>
                </Grid>
            )}
            {!loading && (
                <Grid item>
                    <Typography
                        sx={{
                            fontWeight: Fonts.FW_500,
                            fontSize: [Fonts.FS_13],
                        }}
                        className="overflowTypography"
                    >
                        {word?.pronounce}
                    </Typography>
                </Grid>
            )}
        </div>
    );
};

export default WordListBlock;
