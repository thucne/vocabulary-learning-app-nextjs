import React, { useState, useEffect, useRef, useCallback } from 'react';

import Image from 'next/image';
import Router from 'next/router';
import Link from 'next/link';

import {
    Container, Grid, Box, Typography, IconButton,
    Stack
} from '@mui/material';
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { Fonts, Colors } from '@styles';
import { stringAvata, useThisToGetSizesFromRef, useThisToGetPositionFromRef, useWindowSize } from '@utils';
import { IMAGE_ALT } from '@consts';

import LoadingImage from '@components/LoadingImage';

const WordListBlock = ({ wordList }) => {
    const theme = useTheme();
    const myRef = useRef(null);
    const gridRef = useRef(null);
    const wordRefs = useRef([]);
    const [superLock, setSuperLock] = useState(false);

    const { width } = useThisToGetSizesFromRef(myRef, { revalidate: 100, timeout: 500 });
    const { top, height, right, left } = useThisToGetPositionFromRef(gridRef, { revalidate: 100, timeout: 500 });
    const { width: windowWidth, height: windowHeight } = useWindowSize();

    const numberOfWords = wordList?.length || 0;

    const stackLength = width * numberOfWords;

    const handleBackAction = async () => {
        // find which word is in the middle of the screen
        const halfOfScreen = windowWidth / 2;

        const wordIndex = wordRefs.current.findIndex(wordRef => {
            const { left: wordLeft } = wordRef.getBoundingClientRect();
            return (wordLeft < halfOfScreen && wordLeft > 0) ||
                (wordLeft + width > halfOfScreen && wordLeft + width < windowWidth);
        });

        // scroll left
        if (wordIndex > 0) {
            const wordRef = wordRefs.current[wordIndex - 1];
            const { left: wordLeft } = wordRef.getBoundingClientRect();

            gridRef.current.scrollTo({
                left: wordLeft + wordIndex * width - left,
                behavior: 'smooth'
            });
        }
    }


    const handleForwardAction = async () => {
        // find which word is in the middle of the screen
        const halfOfScreen = windowWidth / 2;

        const wordIndex = wordRefs.current.findIndex(wordRef => {
            const { left: wordLeft } = wordRef.getBoundingClientRect();
            return (wordLeft < halfOfScreen && wordLeft > 0) ||
                (wordLeft + width > halfOfScreen && wordLeft + width < windowWidth);
        });

        // scroll left
        if (wordIndex < wordRefs.current?.length - 1) {
            const wordRef = wordRefs.current[wordIndex + 1];
            const { left: wordLeft } = wordRef.getBoundingClientRect();

            gridRef.current.scrollTo({
                left: wordLeft + wordIndex * width - left,
                behavior: 'smooth'
            });
        }
    }

    useEffect(() => {
        const autoScroll = async () => {
            const halfOfScreen = windowWidth / 2;

            const wordIndex = wordRefs?.current?.findIndex(wordRef => {
                const { left: wordLeft } = wordRef?.getBoundingClientRect();
                return (wordLeft < halfOfScreen && wordLeft > 0) ||
                    (wordLeft + width > halfOfScreen && wordLeft + width < windowWidth);
            });

            const wordRef = wordRefs?.current?.[wordIndex];

            if (wordRef) {
                const { left: wordLeft } = wordRef?.getBoundingClientRect();

                const a = Math.abs(wordIndex * width - left);
                const b = Math.abs(wordLeft);
                const whichBigger = Math.max(a, b);
                const different = Math.round(Math.abs(a - b) * 100 / whichBigger);

                if (different > 10) {
                    gridRef?.current?.scrollTo({
                        left: wordLeft + (wordIndex * width - wordLeft),
                        behavior: 'smooth'
                    });
                }
            }

        };

        let lock = true;
        // scroll the word to the middle of the screen if it's not already in the middle
        const loop = setInterval(async () => {
            if (lock && !superLock && wordRefs.current.length > 0) {
                lock = false;
                await new Promise(async (resolve) => {
                    await autoScroll();
                    resolve();
                    // setTimeout(() => resolve(), 750);
                });
                lock = true;
            }
        }, 500);

        return () => clearInterval(loop);

    }, [wordRefs, width, left, windowWidth, superLock]);


    return (
        <Container maxWidth="lg" disableGutters>
            <Grid container direction="row" mt={[0, 1, 2, 3]}>
                <Grid item xs={12}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: Fonts.FW_500 }}>
                        Word List
                    </Typography>
                </Grid>
                <div style={{
                    position: 'absolute',
                    top: Math.round(top + height / 2),
                    left: `calc(${left}px + ${theme.spacing(3)})`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 100,
                    backgroundColor: theme.palette.scroll_button.main,
                    borderRadius: '50%',
                }}>
                    <IconButton aria-label="left" onClick={async () => {
                        setSuperLock(true);
                        await new Promise(async(resolve) => {
                            await handleBackAction();
                            resolve();
                        })
                        setSuperLock(false);
                    }}>
                        <ArrowBackIcon fontSize="large" />
                    </IconButton>
                </div>
                <div style={{
                    position: 'absolute',
                    top: Math.round(top + height / 2),
                    left: `calc(${right}px - ${theme.spacing(3)})`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 100,
                    backgroundColor: theme.palette.scroll_button.main,
                    borderRadius: '50%',
                }}>
                    <IconButton aria-label="left" onClick={async () => {
                        setSuperLock(true);
                        await new Promise(async(resolve) => {
                            await handleForwardAction();
                            resolve();
                        })
                        setSuperLock(false);
                    }}>
                        <ArrowForwardIcon fontSize="large" />
                    </IconButton>
                </div>
                <Grid
                    ref={gridRef}
                    item xs={12}
                    sx={{
                        mt: 1,
                        width: [width],
                        overflow: 'auto',
                        borderRadius: '10px',
                    }}
                    className='hideScrollBar'
                >
                    <Stack direction="row" sx={{ width: stackLength }}>
                        {wordList?.length > 0 && wordList.map((word, index) => (
                            <EachWord
                                key={`render-word-list-${index}`}
                                word={word}
                                width={width}
                                wordRefs={wordRefs}
                                index={index}
                            />
                        ))}
                    </Stack>
                    <Grid container direction='row'>
                        <Grid ref={myRef} item xs={12} sm={6} md={4} lg={3}></Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container >
    );
};

const EachWord = ({ word, width, wordRefs, index }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);

    const photo = word?.illustration?.formats?.small?.url ||
        word?.illustration?.url ||
        IMAGE_ALT;

    return <Grid
        ref={el => wordRefs.current[index] = el}
        container direction='column' alignItems='center' wrap='nowrap'
        sx={{
            p: 1,
            width,
            height: 'auto',
            '&:hover': {
                filter: 'brightness(50%)'
            }
        }}
    >
        <div style={{
            position: "relative",
            width: `calc(${width}px - ${theme.spacing(3)})`,
            height: `calc(${width}px - ${theme.spacing(3)})`,
            overflow: 'hidden',
            borderRadius: '10px'
        }}>
            <LoadingImage
                src={photo}
                alt="Illustration"
                layout='fill'
                objectFit='contain'
                priority={true}
                draggable={false}
                doneLoading={() => setLoading(false)}
            />
        </div>
        {
            !loading && <Grid item>
                <Typography
                    sx={{
                        fontWeight: Fonts.FW_500,
                        fontSize: [Fonts.FS_25],
                        mt: 2
                    }}
                    className='overflowTypography'
                >
                    {word?.vip}
                </Typography>
            </Grid>
        }
        {
            !loading && <Grid item>
                <Typography
                    sx={{
                        fontWeight: Fonts.FW_500,
                        fontSize: [Fonts.FS_15],
                    }}
                    className='overflowTypography'
                >
                    {word?.pronounce}
                </Typography>
            </Grid>
        }
    </Grid>
}

export default WordListBlock;