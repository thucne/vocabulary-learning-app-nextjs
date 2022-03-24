import React, { useState, useEffect, useRef } from 'react';

import Link from 'next/link';

import {
    Grid, Divider, Typography, Link as MuiLink,
    IconButton, Tooltip, CircularProgress
} from '@mui/material';

import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

import LoadingImage from '@components/LoadingImage';
import { Props, Fonts, Colors, SXs } from '@styles';
import { AUDIO_ALT } from '@consts';
import { getAudioUrl } from '@utils';

import parser from 'html-react-parser';

const WordSnippet = ({ vip }) => {

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

    const synonyms = !_.isEmpty(vip?.synonyms) && _.isString(vip?.synonyms) ? vip.synonyms.split(/[ ,]+/) : [];
    const antonyms = !_.isEmpty(vip?.antonyms) && _.isString(vip?.antonyms) ? vip.antonyms.split(/[ ,]+/) : [];

    const photo = vip?.illustration;
    const illustrationExist = !vip?.illustrationIsDefault;

    const noAudio = !audio || (!loadingAudio && !audioUrl);

    const splitWord = vip?.vip?.split(" ");
    const regex = new RegExp(splitWord?.join("|"), "gi");

    useEffect(() => {
        let canRun = true;
        const run = async () => {
            if (canRun) {
                setLoadingAudio(true);
                setAudioUrl("");
                if (_.isEmpty(audio)) {
                    setLoadingAudio(false);
                } else {
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
        }

        run();

        return () => canRun = false;

    }, [audio]);

    return (
        <Grid container {...Props.GCRSC}>
            <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />

                <Grid container {...Props.GCRBC}>
                    {/* main word */}
                    <Typography variant="h4" component="h1" className='overflowTypography'
                        sx={{
                            color: theme => theme.palette.publicWord3.main,
                        }}
                    >
                        {vip.vip}
                    </Typography>
                </Grid>

                {/* type2 */}
                <Grid container {...Props.GCRSC} spacing={0.5} mt={1}>
                    {
                        !!type1?.length && <Grid item {...Props.GIRCC}>
                            <Link href={`/type1/${type1}`} passHref>
                                <Tooltip title="Go to definition">
                                    <MuiLink underline='hover' sx={{
                                        fontWeight: Fonts.FW_500,
                                        fontSize: Fonts.FS_14,
                                        color: Colors.WHITE,
                                        backgroundColor: Colors.LOGO_BLUE,
                                        px: 0.5,
                                        mr: 1,
                                        borderRadius: '0.25rem',
                                    }}>
                                        {type1}
                                    </MuiLink>
                                </Tooltip>
                            </Link>
                        </Grid>
                    }
                    {
                        !!type2?.length && type2.map((item, index) => (
                            <Grid item key={`type2-${index}`} {...Props.GIRCC}>
                                <Link href={`/type2/${item.name}`} passHref>
                                    <Tooltip title="Go to definition">
                                        <MuiLink underline='hover' sx={{
                                            fontWeight: Fonts.FW_500,
                                            fontSize: Fonts.FS_14,
                                            color: (theme) => theme.palette.publicWord1.main
                                        }}>
                                            <i>{item.name}</i>
                                        </MuiLink>
                                    </Tooltip>
                                </Link>
                            </Grid>
                        ))
                    }
                </Grid>

                {/* audio */}
                <Grid container {...Props.GCRSC}>
                    <Grid item xs={12} {...Props.GIRSC} mt={1} sx={{
                        position: 'relative',
                        color: (theme) => theme.palette.mainPublicWord.main
                    }}>

                        <Typography variant="body2" sx={{ letterSpacing: '-0.5px' }}>
                            {pronounce || '/No pronunciation/'}
                        </Typography>

                        {
                            noAudio && <VolumeOffIcon 
                                sx={{
                                    fontSize: Fonts.FS_16, ml: 0.5,
                                    color: (theme) => theme.palette.mainPublicWord.main 
                                }}
                            />
                        }

                        {
                            !noAudio && (!loadingAudio ? <IconButton
                                disabled={!audio}
                                onClick={() => audioRef.current.play()}
                                sx={{ fontSize: Fonts.FS_16, height: '25px', width: '25px', ml: 0.5 }}
                            >
                                <VolumeUpRoundedIcon fontSize='inherit' sx={{ color: (theme) => theme.palette.mainPublicWord.main }} />
                            </IconButton> : <CircularProgress size={16} sx={{ ml: 0.5 }} />)
                        }

                        <audio ref={audioRef}>
                            <source src={audioUrl || AUDIO_ALT} />
                        </audio>

                    </Grid>
                </Grid>

            </Grid>

            {
                !!english?.length && <Grid item xs={12}>

                    <Divider sx={{ my: 2 }} />

                    {
                        !_.isEmpty(photo) && illustrationExist && (
                            <div style={{
                                position: "relative",
                                width: 192,
                                height: 108,
                                marginBottom: '1rem',
                                borderRadius: '4px',
                                overflow: 'hidden',
                            }}>
                                <LoadingImage
                                    src={photo}
                                    alt={`${vip.vip} illustration`}
                                    layout='fill'
                                    objectFit='contain'
                                    draggable={false}
                                />
                            </div>
                        )
                    }
                    {
                        english.map((item, index) => (
                            <Typography key={`english-${index}`} variant="body1" mt={index !== 0 ? 1 : 0} sx={{
                                fontWeight: Fonts.FW_500,
                                fontSize: Fonts.FS_18,
                                color: (theme) => theme.palette.mainPublicWord.main,
                            }}>
                                → {item?.split(" ").map((word, index) => (
                                    <Link
                                        key={`english-${index}`}
                                        href={`/word/${word
                                            ?.toLowerCase()
                                            ?.replace(/[^a-zA-Z ]/g, "")}`}
                                        passHref
                                    >
                                        <MuiLink underline='hover' color='inherit'>
                                            {word}{' '}
                                        </MuiLink>
                                    </Link>
                                ))}
                            </Typography>
                        ))
                    }
                </Grid>
            }

            {
                !!vietnamese?.length && <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    {
                        vietnamese.map((item, index) => (
                            <Typography key={`vietnamese-${index}`} variant="body1" mt={index !== 0 ? 1 : 0} sx={{
                                fontWeight: Fonts.FW_500,
                                fontSize: Fonts.FS_18,
                                color: (theme) => theme.palette.mainPublicWord.main
                            }}>
                                → {item}
                            </Typography>
                        ))
                    }
                </Grid>
            }

            {
                !!examples?.length && <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    {
                        examples.map((item, index) => (
                            <Typography key={`example-${index}`} variant="body1" mt={index !== 0 ? 1 : 0} ml={1} sx={{
                                fontWeight: Fonts.FW_400,
                                fontSize: Fonts.FS_17,
                                color: (theme) => theme.palette.mainPublicWord.main
                            }}>
                                &bull; <i>
                                    {
                                        item
                                            ?.split(/\s+/g).map((word, index) => (
                                                <Link
                                                    key={`english-${index}`}
                                                    href={`/word/${word
                                                        ?.toLowerCase()
                                                        ?.replace(/[^a-zA-Z ]/g, "")}`}
                                                    passHref
                                                >
                                                    <MuiLink underline='hover' color='inherit'>
                                                        {parser(word.replace(
                                                            regex,
                                                            (matched) =>
                                                                `<span style="color: #f44336; font-weight: bold; text-decoration: underline;">${matched}</span>`
                                                        ))}{' '}
                                                    </MuiLink>
                                                </Link>
                                            ))

                                    }
                                </i>
                            </Typography>
                        ))
                    }
                </Grid>
            }

            {
                !!synonyms?.length && <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body1" sx={{
                        fontWeight: Fonts.FW_700,
                        fontSize: Fonts.FS_14,
                        color: (theme) => theme.palette.publicWord2.main
                    }}>
                        Synonyms
                    </Typography>
                    <Grid container {...Props.GCRSC} spacing={1} mt={0.5}>
                        {
                            synonyms.map((item, index) => (
                                <Grid item key={`synonyms-${index}`} {...Props.GIRCC}>
                                    <Link href={`/word/${item}`} passHref>
                                        <MuiLink underline='hover' sx={{
                                            fontWeight: Fonts.FW_400,
                                            fontSize: Fonts.FS_14,
                                            color: (theme) => theme.palette.publicWord1.main
                                        }}>
                                            {item}
                                        </MuiLink>
                                    </Link>
                                </Grid>
                            ))
                        }
                    </Grid>
                </Grid>
            }

            {
                !!antonyms?.length && <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body1" sx={{
                        fontWeight: Fonts.FW_700,
                        fontSize: Fonts.FS_14,
                        color: (theme) => theme.palette.publicWord2.main
                    }}>
                        Antonyms
                    </Typography>
                    <Grid container {...Props.GCRSC} spacing={1} mt={0.5}>
                        {
                            antonyms.map((item, index) => (
                                <Grid item key={`antonyms-${index}`} {...Props.GIRCC}>
                                    <Link href={`#`} passHref>
                                        <MuiLink underline='hover' sx={{
                                            fontWeight: Fonts.FW_400,
                                            fontSize: Fonts.FS_14,
                                            color: (theme) => theme.palette.publicWord1.main
                                        }}>
                                            {item}
                                        </MuiLink>
                                    </Link>
                                </Grid>
                            ))
                        }
                    </Grid>
                </Grid>
            }
        </Grid>
    );
};

export default WordSnippet;