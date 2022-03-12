import React, { useState, useEffect, useRef } from 'react';

import Link from 'next/link';
import Router from 'next/router';

import {
    Container, Grid, Typography, Divider,
    Link as MuiLink, CircularProgress, IconButton,
    Chip, Tooltip, Paper, Stack
} from '@mui/material';

import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';

import { Props, SXs, Fonts, Colors } from '@styles';
import { getAudioUrl, useThisToGetSizesFromRef } from '@utils';
import { AUDIO_ALT } from '@consts';
import LoadingImage from '@components/LoadingImage';
import { subscribeVip } from "@actions";
import * as t from '@consts';
import { RECAPTCHA } from '@config';

import { useSelector, useDispatch } from "react-redux";
import parser from 'html-react-parser';
import _ from 'lodash';

const PublicWord = ({ vip, relatedVips }) => {
    const [audioUrl, setAudioUrl] = useState("");
    const [loadingAudio, setLoadingAudio] = useState(false);

    const audioRef = useRef(null);
    const gridRef = useRef(null);

    const dispatch = useDispatch();
    const recaptcha = useSelector(state => state.recaptcha);

    const type1 = vip?.type1;
    const type2 = vip?.type2;
    const audio = vip?.audio;
    const pronounce = vip?.pronounce;

    const english = vip?.meanings?.english;
    const vietnamese = vip?.meanings?.vietnamese;

    const examples = vip?.examples;

    const synonyms = !_.isEmpty(vip?.synonyms) && _.isString(vip?.synonyms) ? vip.synonyms.split(/[ ,]+/) : [];
    const antonyms = !_.isEmpty(vip?.antonyms) && _.isString(vip?.antonyms) ? vip.antonyms.split(/[ ,]+/) : [];

    const tags = vip?.tags;

    const photo = vip?.illustration;

    const splitWord = vip.vip?.split(" ");
    const regex = new RegExp(splitWord.join("|"), "gi");

    const actualRelatedVips = relatedVips?.filter(item => item?.priority < -2) || [];
    const moreRelatedVips = relatedVips?.filter(item => item?.priority >= -2) || [];

    const gridSizes = useThisToGetSizesFromRef(gridRef, {
        revalidate: 1000,
        terminalCondition: ({ width }) => width !== 0,
        falseCondition: ({ width }) => width === 0,
    });

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

    const handleSubscribe = (e) => {
        e?.preventDefault();

        if (window?.adHocFetch && recaptcha === true && window.grecaptcha) {
            grecaptcha.ready(function () {
                grecaptcha
                    .execute(`${RECAPTCHA}`, { action: "vip_authentication" })
                    .then(function (token) {
                        adHocFetch({
                            dispatch,
                            action: subscribeVip(vip?.id, token),
                            onSuccess: (data) => console.log(data),
                            onError: (error) => console.log(error),
                            snackbarMessageOnSuccess: "Update infomation success!",
                        });
                    });
            });
        }
    }

    return (
        <Container maxWidth="md">
            <Grid container {...Props.GCRSC}>
                <Grid item xs={12} mt={2}>
                    <Typography variant="caption">
                        <i>You are viewing a public word.</i>
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                </Grid>

                <Grid item xs={12}>

                    {/* main word */}
                    <Typography variant="h4" component="h1" className='overflowTypography'
                        sx={{
                            color: theme => theme.palette.publicWord3.main,
                        }}
                    >
                        {vip.vip}
                    </Typography>

                    {/* type2 */}
                    <Grid container {...Props.GCRSC} spacing={0.5} mt={1}>
                        {
                            !!type1.length && <Grid item {...Props.GIRCC}>
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
                                {pronounce}
                            </Typography>

                            {
                                !loadingAudio ? <IconButton
                                    disabled={!audio}
                                    onClick={() => audioRef.current.play()}
                                    sx={{ fontSize: Fonts.FS_16, height: '25px', width: '25px', ml: 0.5 }}
                                >
                                    <VolumeUpRoundedIcon fontSize='inherit' sx={{ color: (theme) => theme.palette.mainPublicWord.main }} />
                                </IconButton> : <CircularProgress size={16} sx={{ ml: 0.5 }} />
                            }

                            <audio ref={audioRef}>
                                <source src={audioUrl || AUDIO_ALT} />
                            </audio>

                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} textAlign='right'>
                        <Tooltip title="Add this word to my word list" arrow>
                            <IconButton aria-label='Add this word to my word list' sx={{
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
                            }} onClick={handleSubscribe}>
                                <PlaylistAddIcon color='white' />
                            </IconButton>
                        </Tooltip>
                    </Divider>

                </Grid>

                {
                    !!english?.length && <Grid item xs={12}>
                        {
                            !_.isEmpty(photo) && (
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
                                    → {item}
                                </Typography>
                            ))
                        }
                        <Divider sx={{ my: 2 }} />
                    </Grid>
                }

                {
                    !!vietnamese?.length && <Grid item xs={12}>
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
                        <Divider sx={{ my: 2 }} />
                    </Grid>
                }

                {
                    !!examples?.length && <Grid item xs={12}>
                        {
                            examples.map((item, index) => (
                                <Typography key={`example-${index}`} variant="body1" mt={index !== 0 ? 1 : 0} ml={1} sx={{
                                    fontWeight: Fonts.FW_400,
                                    fontSize: Fonts.FS_17,
                                    color: (theme) => theme.palette.mainPublicWord.main
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
                        <Divider sx={{ my: 2 }} />
                    </Grid>
                }

                {
                    !!synonyms?.length && <Grid item xs={12}>
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
                        <Divider sx={{ my: 2 }} />
                    </Grid>
                }

                {
                    !!antonyms?.length && <Grid item xs={12}>
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
                        <Divider sx={{ my: 2 }} />
                    </Grid>
                }

                {
                    (!!actualRelatedVips.length || !!moreRelatedVips.length) && <Grid item xs={12} sx={{
                        bgcolor: `relatedPaper.main`,
                        p: 2,
                        borderRadius: '4px',
                        overflow: 'hidden',
                    }}>
                        <Typography variant="body1" sx={{
                            fontWeight: Fonts.FW_700,
                            fontSize: Fonts.FS_14,
                            color: (theme) => theme.palette.publicWord2.main,
                            mb: 1, mr: 1,
                            display: 'inline'
                        }}>
                            Related Words
                        </Typography>

                        {/* Chú thích */}
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'rgba(63, 81, 181, 0.52)', display: 'inline-block', margin: '0px 5px' }} />
                        <Typography variant="caption" sx={{
                            fontSize: Fonts.FS_10,
                            color: 'rgba(63, 81, 181, 0.52)',
                            mb: 1,
                            display: 'inline'
                        }}>
                            Related
                        </Typography>

                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'rgba(155, 49, 77, 0.52)', display: 'inline-block', margin: '0px 5px' }} />
                        <Typography variant="caption" sx={{
                            fontSize: Fonts.FS_10,
                            color: 'rgba(63, 81, 181, 0.52)',
                            mb: 1,
                            display: 'inline'
                        }}>
                            More
                        </Typography>


                        <Grid container spacing={1} {...Props.GCRSC} mt={1}>
                            {

                                !!actualRelatedVips.length && actualRelatedVips.map((item, index) => (
                                    <Grid ref={gridRef} item xs={4} sm={2} key={`actual-related-vip-${index}`}>
                                        <RelatedVip vip={item} gridSizes={gridSizes} actual={true} />
                                    </Grid>
                                ))
                            }
                            {
                                !!moreRelatedVips.length && moreRelatedVips.map((item, index) => (
                                    <Grid ref={gridRef} item xs={4} sm={2} key={`more-related-vip-${index}`}>
                                        <RelatedVip vip={item} gridSizes={gridSizes} />
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Grid>
                }

                {
                    !!tags?.length && <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body1" sx={{
                            fontWeight: Fonts.FW_700,
                            fontSize: Fonts.FS_14,
                            color: (theme) => theme.palette.publicWord2.main
                        }}>
                            Keywords
                        </Typography>
                        <Grid container {...Props.GCRSC} spacing={1} mt={0.5}>
                            {
                                tags.map((item, index) => (
                                    <Grid item key={`tag-${index}`} {...Props.GIRCC}>
                                        <Link href={`/tag/${item.id}`} passHref>
                                            <MuiLink underline='hover' sx={{
                                                fontWeight: Fonts.FW_400,
                                                fontSize: Fonts.FS_14,
                                                color: (theme) => theme.palette.publicWord1.main
                                            }}>
                                                {item.name}
                                            </MuiLink>
                                        </Link>
                                    </Grid>
                                ))
                            }
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                    </Grid>
                }
            </Grid>
        </Container>
    );
};

const RelatedVip = ({ vip, gridSizes, actual = false }) => {
    return (
        <Paper sx={{
            width: _.isNumber(gridSizes?.width) ? `calc(${gridSizes.width}px - 0.5rem)` : 100,
            height: _.isNumber(gridSizes?.width) ? `calc(${gridSizes.width}px - 0.5rem)` : 100,
            background: `url(${vip?.illustration}) center center / cover no-repeat`,
            ...styles.relatedWords
        }}>
            <DarkBackGround actual={actual} />
            <Link href={!vip?.public ? `/word/${encodeURIComponent(vip?.vip)}/${vip?.id}` : `/word/public/${encodeURIComponent(vip?.vip)}/${vip?.id}`} passHref>
                <IconButton sx={styles.openInNew}>
                    <OpenInNewRoundedIcon color='inherit' fontSize="inherit" />
                </IconButton>
            </Link>
            <Typography
                variant="body1"
                className="overflowTypography"
                sx={{ zIndex: 1 }}>
                {vip?.vip}
            </Typography>
        </Paper>
    )
}

const DarkBackGround = ({ actual }) => <div style={{
    backgroundColor: actual ? 'rgba(63, 81, 181, 0.52)' : 'rgba(155, 49, 77, 0.52)',
    ...styles.darkBG
}} />;


const styles = {
    openInNew: {
        color: Colors.WHITE,
        fontSize: Fonts.FS_20,
        border: '1px solid rgba(255, 255, 255, 0.5)',
        borderRadius: '4px',
        zIndex: 1,
        "& .MuiTouchRipple-root span": {
            borderRadius: "4px",
        },
        position: 'absolute',
        right: '5px',
        top: '5px',
        p: 0.5
    },
    relatedWords: {
        borderRadius: '4px',
        position: 'relative',
        overflow: 'hidden',
        color: Colors.WHITE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    darkBG: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 1
    }
}

export default PublicWord;