import React, { useState, useRef, useMemo, useEffect, useCallback } from "react";

import { Container, Grid, Typography, IconButton, Stack, Alert } from "@mui/material";

import { useTheme } from "@mui/material/styles";

import {
    Add as AddIcon,
    ArrowForward as ArrowForwardIcon,
    ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

import { Fonts, SXs, Colors } from "@styles";
import { IMAGE_ALT } from "@consts";

import LoadingImage from "@components/LoadingImage";
import { useSelector } from "react-redux";

import ScrollPaper from "@tallis/react-mui-scroll-view";
// import ScrollPaper from './ScrollPaper';

import CreateNewWord from "../../WordForm";

import { isEqual } from "lodash";

const WordListBlock = () => {
    const [sizes, setSizes] = useState({ width: 0, height: 0 });

    const wordList = useSelector((state) =>
        state.userData?.vips?.length > 0 ? state.userData.vips : []
    );

    return (
        <Container maxWidth="lg" disableGutters>
            <Grid container direction="row" mt={[0, 1, 2, 3]}>
                <Grid item xs={12} sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <Typography
                        variant="h5"
                        component="h2"
                        sx={{ fontWeight: Fonts.FW_500 }}
                    >
                        Word List
                    </Typography>

                    <NewWord />

                </Grid>

                <ListWord wordList={wordList} sizes={sizes} config={config(sizes, setSizes)} />

            </Grid>
        </Container>
    );
};

const NewWord = () => { 
    const [open, setOpen] = useState(false);
    return (
        <div>
            <CreateNewWord open={open} setOpen={setOpen} />
            <IconButton onClick={() => setOpen(true)} sx={SXs.MUI_NAV_ICON_BUTTON}>
                <AddIcon sx={{ color: Colors.LOGO_BLUE }} />
            </IconButton>
        </div>
    )
}

const ListWord = ({ wordList, config, sizes }) => {
    return (
        <Grid item xs={12} mt={2} sx={{ px: wordList?.length === 0 ? 0 : 2 }}>
            {
                wordList?.length === 0 && <Alert severity="info">
                    No words in your list
                </Alert>
            }
            {
                wordList?.length > 0 && <ScrollPaper {...config}>
                    {wordList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map((word, index) => (
                        <EachChild
                            key={`render-word-list-${index}`}
                            word={word}
                            width={sizes.width}
                        />
                    ))}
                </ScrollPaper>
            }
        </Grid>
    )
}

const EachChild = ({ word, width }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);

    useEffect(() => { console.log('change') }, [])

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

const config = (sizes, setSizes) => ({
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
        if (!isEqual(sizes, data)) {
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
});

export default WordListBlock;
