import React, { useState, useMemo, useEffect, useRef } from "react";

import {
    Container, Grid, Typography, IconButton, Stack,
    Alert, Tooltip, TextField
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import {
    Add as AddIcon,
    ArrowForward as ArrowForwardIcon,
    ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

import { Fonts, SXs, Colors, Props } from "@styles";
import { IMAGE_ALT, NO_PHOTO, PROPS_1 } from "@consts";

import LoadingImage from "@components/LoadingImage";
import { useSelector } from "react-redux";

import ScrollPaper from "@tallis/react-mui-scroll-view";
// import ScrollPaper from './ScrollPaper';

import CreateNewWord from "@components/WordForm";
import { useSettings, useWindowSize, useThisToGetSizesFromRef } from "@utils";
import _, { isEqual } from "lodash";

import Link from 'next/link';

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
// import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper";

const getNumberOfWordsToBeShown = (windowSizes) => {
    const sw = windowSizes.width;
    const defaultSizes = {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536
    }

    if (sw < defaultSizes.sm) {
        return 1;
    } else if (sw < defaultSizes.md) {
        return 3;
    } else if (sw < defaultSizes.lg) {
        return 5;
    } else if (sw < defaultSizes.xl) {
        return 6;
    } else {
        return 7;
    }
}

const WordListBlock = () => {
    const containerRef = useRef(null);
    const [sizes, setSizes] = useState({ width: 0, height: 0 });
    const [searchTerm, setSearchTerm] = useState("");
    const windowSizes = useWindowSize();

    const wordListRaw = useSelector((state) =>
        state.userData?.vips?.length > 0 ? state.userData.vips : []
    );

    const subscribedWordListRaw = useSelector((state) =>
        state.userData?.subscribedVips?.length > 0 ? state.userData.subscribedVips : []
    );

    const getWordList = useMemo(() => {
        let evidences = [];
        const listWord = _.filter(_.unionWith(wordListRaw, subscribedWordListRaw, _.isEqual), word => {
            // return if any field contains the filter, deep checked
            return _.some(word, (value, key) => {

                if (!_.isEmpty(value)) {
                    const res = _.includes(JSON.stringify(value).toLowerCase(), searchTerm.toLowerCase());

                    if (res === true) {
                        const temp = {
                            id: word.id,
                            field: key !== 'vip' ? key : 'word'
                        }
                        evidences.push(temp);
                    }

                    return res;
                }
                return false;
            })
        });

        return [listWord, evidences];
    }, [wordListRaw, subscribedWordListRaw, searchTerm]);

    const [wordList = [], evidences = []] = getWordList;

    // const wordList = useMemo(() => _.unionWith(wordListRaw, subscribedWordListRaw, _.isEqual), [wordListRaw, subscribedWordListRaw]);

    const handleSearch = useMemo(() => _.debounce((e) => {
        searchWord(e?.target?.value);
    }, 500), [])

    const searchWord = (searchTerm) => {
        setSearchTerm(searchTerm);
    }

    const containerSizes = useThisToGetSizesFromRef(containerRef, PROPS_1);

    return (
        <Container maxWidth="lg" disableGutters>
            <Grid ref={containerRef} container direction="row" mt={[0, 1, 2, 3]}>
                <Grid item xs={12}>
                    <Grid container {...Props.GCRBC}>
                        <Grid item {...Props.GIRSC}>
                            <Typography
                                variant="h5"
                                component="h2"
                                sx={{ fontWeight: Fonts.FW_500, mr: 1 }}
                            >
                                Word List
                            </Typography>

                            <NewWord />
                        </Grid>
                        <Grid item {...Props.GIREC}>
                            <TextField
                                type="text"
                                size="small"
                                placeholder="Word, tag, etc."
                                label="Search"
                                sx={{ width: [150, 'auto'] }}
                                onChange={handleSearch}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Typography variant="caption" component="p" sx={{
                    mt: 1, px: 1,
                    backgroundColor: Colors.MATCHED_RESULT,
                    color: Colors.WHITE,
                    borderRadius: '4px',
                }}>
                    {_.isEmpty(searchTerm) ? '' : `Matched: ${wordList?.length}`}
                </Typography>

                <ListWord
                    wordList={wordList}
                    sizes={sizes}
                    config={config(sizes, setSizes)}
                    evidences={_.isEmpty(searchTerm) ? [] : evidences}
                    windowSizes={windowSizes}
                    containerSizes={containerSizes}
                />

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
                <AddIcon />
            </IconButton>
        </div>
    )
}

const ListWord = ({ wordList = [], sizes, evidences = [], windowSizes, containerSizes }) => {
    const numberOfWords = windowSizes.width > 0 ? getNumberOfWordsToBeShown(windowSizes) : 0;
    const eachChildRef = useRef(null);
    const childSizes = useThisToGetSizesFromRef(eachChildRef, PROPS_1);

    return (
        <Grid item xs={12} mt={2} sx={{
            px: wordList?.length === 0 ? 0 : 2,
            position: 'relative',
            '& .mySwiper': {
                width: containerSizes?.width * 0.9,
                overflowX: 'hidden'
            }
        }}>
            {/* {
                wordList?.length === 0 && <Alert severity="info">
                    No words in your list
                </Alert>
            } */}
            {
                wordList?.length === 0 && <EachChild
                    word={noList}
                    width={sizes.width}
                    noJump
                />
            }
            {/* {
                wordList?.length > 0 && <ScrollPaper {...config}>
                    {wordList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map((word, index) => (
                        <EachChild
                            key={`render-word-list-${index}`}
                            word={word}
                            width={sizes.width}
                            evidence={evidences?.find(item => item.id === word.id)}
                        />
                    ))}
                </ScrollPaper>
            } */}
            {
                wordList?.length > 0 && <Swiper
                    slidesPerView={numberOfWords}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[Pagination]}
                    autoplay={{
                        delay: 1000,
                        disableOnInteraction: false,
                    }}
                    spaceBetween={10}
                    className="mySwiper"
                >
                    {
                        wordList?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map((word, index) => (
                            <SwiperSlide
                                key={`render-word-list-${index}`}
                                ref={index === 0 ? eachChildRef : null}
                            >
                                {({ isActive }) => {
                                    return (
                                        <EachChild
                                            // key={`render-word-list-${index}`}
                                            word={word}
                                            sizes={childSizes}
                                            evidence={evidences?.find(item => item.id === word.id)}
                                        />
                                    )
                                }}
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            }
        </Grid>
    )
}

const EachChild = ({ word, sizes, evidence, noJump }) => {

    const [loading, setLoading] = useState(true);

    const userData = useSelector((state) => state.userData);

    const raw = useSettings(userData);

    const { objectFit = "contain" } = useMemo(() => raw, [raw]);

    const photo = useMemo(() => word?.illustration?.formats?.small?.url ||
        word?.illustration?.url ||
        NO_PHOTO, [word?.illustration]);

    if (_.isEmpty(word)) {
        return <div />;
    }

    return (
        <Link href={noJump ? '#' : word?.public ? `/word/public/${word?.vip}/${word?.id}` : `/word/${word?.vip}/${word?.id}`} passHref>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    cursor: "pointer",
                    maxWidth: sizes?.width,
                    overflow: "hidden",
                    // border: '1px solid blue'
                }}
            >
                <div
                    style={{
                        position: "relative",
                        width: sizes?.width,
                        height: sizes?.width,
                        overflow: "hidden",
                        borderRadius: "10px",
                    }}
                >
                    <LoadingImage
                        src={photo}
                        alt="Illustration"
                        layout="fill"
                        objectFit={objectFit}
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
                            align="center"
                        >
                            {word?.pronounce}
                        </Typography>
                    </Grid>
                )}

                {/* render evidence of search */}
                {evidence && (
                    <Grid item>
                        <Tooltip title="Matched field">
                            <Typography
                                sx={{
                                    fontWeight: Fonts.FW_500,
                                    fontSize: [Fonts.FS_13],
                                    px: 1, mt: 1,
                                    borderRadius: "4px",
                                    backgroundColor: Colors.LOGO_BLUE,
                                    color: Colors.WHITE,
                                }}
                                className="overflowTypography"
                            >
                                {evidence.field}
                            </Typography>
                        </Tooltip>
                    </Grid>
                )}
            </div>
        </Link>
    );
};

const noList = {
    vip: "Not found",
    pronounce: "/Not exist or empty list/",
}

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
        "&:hover": { filter: "brightness(1)" }
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
