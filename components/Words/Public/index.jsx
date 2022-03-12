import React, { useState, useEffect, useRef } from 'react';

import Link from 'next/link';

import {
    Container, Grid, Typography, Divider,
    Link as MuiLink, CircularProgress, IconButton,
    Chip, Tooltip
} from '@mui/material';

import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

import { Props, SXs, Fonts, Colors } from '@styles';
import { getAudioUrl } from '@utils';
import { AUDIO_ALT } from '@consts';

import parser from 'html-react-parser';

const PublicWord = ({ vip, relatedVips }) => {
    const [audioUrl, setAudioUrl] = useState("");
    const [loadingAudio, setLoadingAudio] = useState(false);

    const audioRef = useRef(null);

    const type1 = vip?.type1;
    const type2 = vip?.type2;
    const audio = vip?.audio;
    const pronounce = vip?.pronounce;

    const english = vip?.meanings?.english;
    const vietnamese = vip?.meanings?.vietnamese;

    const examples = vip?.examples;

    const splitWord = vip.vip?.split(" ");
    const regex = new RegExp(splitWord.join("|"), "gi");

    console.log(vip);

    useEffect(() => {
        let canRun = true;
        const run = async () => {
            if (canRun) {
                setLoadingAudio(true);
                setAudioUrl("");
                getAudioUrl(audio, (url) => {
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

        return () => canRun = false;

    }, [audio]);

    return (
        <Container maxWidth="md">
            <Grid container {...Props.GCRSC}>
                <Grid item xs={12} mt={2}>
                    <Typography variant="caption">
                        <i>You are viewing a public word.</i>
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={12}>

                    {/* main word */}
                    <Typography variant="h4" component="h1" className='overflowTypography'>
                        {vip.vip}
                    </Typography>

                    {/* type2 */}
                    <Grid container {...Props.GCRSC} spacing={0.5} mt={1}>
                        {
                            !!type1.length && <Grid item {...Props.GIRCC}>
                                <Link href={`/type1/${type1}`} passHref>
                                    <MuiLink underline='hover' sx={{
                                        fontWeight: Fonts.FW_500,
                                        fontSize: Fonts.FS_14,
                                        color: Colors.WHITE,
                                        backgroundColor: Colors.LOGO_BLUE,
                                        px: 0.5,
                                        borderRadius: '0.25rem',
                                    }}>
                                        <i>{type1}</i>
                                    </MuiLink>
                                </Link>
                            </Grid>
                        }
                        {
                            !!type2?.length && type2.map((item, index) => (
                                <Grid item key={`type2-${index}`} {...Props.GIRCC}>
                                    <Link href={`/type2/${item.name}`} passHref>
                                        <MuiLink underline='hover' sx={{
                                            fontWeight: Fonts.FW_500,
                                            fontSize: Fonts.FS_14,
                                            color: (theme) => theme.palette.publicWord1.main
                                        }}>
                                            <i>{item.name}</i>
                                        </MuiLink>
                                    </Link>
                                </Grid>
                            ))
                        }
                    </Grid>

                    {/* audio */}
                    <Grid container {...Props.GCRSC}>
                        <Grid item xs={12} {...Props.GIRSC} mt={1} sx={{
                            position: 'relative',
                            color: (theme) => theme.palette.publicWord2.main
                        }}>

                            <Typography variant="body2" sx={{ letterSpacing: '-0.5px' }}>
                                {pronounce}
                            </Typography>

                            {
                                !loadingAudio ? <IconButton
                                    disabled={!audio}
                                    onClick={() => audioRef.current.play()}
                                    sx={{ fontSize: Fonts.FS_16, height: '25px', width: '25px', ml: 0.5 }}
                                >
                                    <VolumeUpRoundedIcon fontSize='inherit' sx={{ color: (theme) => theme.palette.publicWord2.main }} />
                                </IconButton> : <CircularProgress size={16} sx={{ ml: 0.5 }} />
                            }

                            <audio ref={audioRef}>
                                <source src={audioUrl || AUDIO_ALT} />
                            </audio>

                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 1 }} textAlign='right'>
                        <Tooltip title="Add this word to my list" arrow>
                            <IconButton aria-label='Add this word to my list' sx={{
                                backgroundColor: Colors.LOGO_YELLOW,
                                borderRadius: "12px",
                                py: 0,
                                "&:hover": {
                                    backgroundColor: Colors.LOGO_YELLOW,
                                    filter: 'brightness(80%)'
                                },
                                "& .MuiTouchRipple-root span": {
                                    borderRadius: "12px",
                                    py: 0
                                },
                            }}>
                                <PlaylistAddIcon color='white' />
                            </IconButton>
                        </Tooltip>
                    </Divider>

                </Grid>

                {
                    !!english?.length && <Grid item xs={12}>
                        {
                            english.map((item, index) => (
                                <Typography key={`english-${index}`} variant="body1" mt={index !== 0 ? 1 : 0} sx={{
                                    fontWeight: Fonts.FW_500,
                                    fontSize: Fonts.FS_18,
                                    color: (theme) => theme.palette.publicWord2.main
                                }}>
                                    → {item}
                                </Typography>
                            ))
                        }
                        <Divider sx={{ my: 1 }} />
                    </Grid>
                }

                {
                    !!vietnamese?.length && <Grid item xs={12}>
                        {
                            vietnamese.map((item, index) => (
                                <Typography key={`vietnamese-${index}`} variant="body1" mt={index !== 0 ? 1 : 0} sx={{
                                    fontWeight: Fonts.FW_500,
                                    fontSize: Fonts.FS_18,
                                    color: (theme) => theme.palette.publicWord2.main
                                }}>
                                    → {item}
                                </Typography>
                            ))
                        }
                        <Divider sx={{ my: 1 }} />
                    </Grid>
                }

                {
                    !!examples?.length && <Grid item xs={12}>
                        {
                            examples.map((item, index) => (
                                <Typography key={`example-${index}`} variant="body1" mt={index !== 0 ? 1 : 0} ml={1} sx={{
                                    fontWeight: Fonts.FW_400,
                                    fontSize: Fonts.FS_17,
                                    color: (theme) => theme.palette.publicWord2.main
                                }}>
                                    &bull; <i>
                                        {
                                            parser(item
                                                ?.split(" ")
                                                ?.map((item) => {
                                                    if (item?.match(regex)) {
                                                        return `${item.replace(
                                                            regex,
                                                            (matched) =>
                                                                `<span style="color: #f44336; font-weight: bold; text-decoration: underline;">${matched}</span>`
                                                        )}`;
                                                    } else {
                                                        return item;
                                                    }
                                                })
                                                ?.join(" ")
                                                ?.replace(/\s\s+/g, " "))
                                        }
                                    </i>
                                </Typography>
                            ))
                        }
                        <Divider sx={{ my: 1 }} />
                    </Grid>
                }
            </Grid>
        </Container>
    );
};

export default PublicWord;