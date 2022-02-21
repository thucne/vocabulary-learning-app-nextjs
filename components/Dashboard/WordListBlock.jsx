import React, { useState, useRef, useMemo, useEffect } from 'react';

import {
    Container, Grid,
    Typography, IconButton, Stack
} from '@mui/material';

import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { Fonts } from '@styles';
import { IMAGE_ALT } from '@consts';

import LoadingImage from '@components/LoadingImage';
import { useSelector } from 'react-redux';
import ScrollPaper from 'react-mui-scroll-pages';

const WordListBlock = () => {
    const theme = useTheme();
    const [sizes, setSizes] = useState({ width: 0, height: 0 });
    const [words, setWords] = useState([]);
    const wordList = useSelector(state => state.userData?.vips?.length > 0 ? state.userData.vips : []);

    const config = {
        mui: {
            Grid,
            Container,
            IconButton,
            Stack,
            ArrowBackIcon,
            ArrowForwardIcon,
        },
        buttonStyle: {
            backgroundColor: theme.palette.scroll_button.main,
        },
        getElementSizes: (data) => {
            if (JSON.stringify(sizes) !== JSON.stringify(data)) {
                setSizes(data);
            }
        },
        elementStyle: {
            // "&:hover": { filter: "brightness(1)" }
        },
        React,
    }

    useEffect(() => {
        if (JSON.stringify(wordList) !== JSON.stringify(words)) {
            setWords(wordList);
        }
    }, [wordList, words]);

    return (
        <Container maxWidth="lg" disableGutters>
            <Grid container direction="row" mt={[0, 1, 2, 3]} sx={{ position: 'relative' }}>
                <Grid item xs={12}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: Fonts.FW_500 }}>
                        Word List
                    </Typography>
                </Grid>
                <ScrollPaper {...config}>
                    {words?.length > 0 && words.map((word, index) => (
                        <EachChild
                            key={`render-word-list-${index}`}
                            word={word}
                            width={sizes.width}
                        />
                    ))}
                </ScrollPaper>
            </Grid>
        </Container >
    );
};

const EachChild = ({ word, width }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);

    const photo = word?.illustration?.formats?.small?.url ||
        word?.illustration?.url ||
        IMAGE_ALT;

    return <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
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
    </div>
}

export default WordListBlock;