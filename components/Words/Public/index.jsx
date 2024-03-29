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
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import ShareIcon from '@mui/icons-material/Share';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

import { Props, SXs, Fonts, Colors } from '@styles';
import { getAudioUrl, useThisToGetSizesFromRef, getNRelatedVips } from '@utils';
import { AUDIO_ALT, NO_PHOTO } from '@consts';

import LoadingImage from '@components/LoadingImage';
import RandomWord from '@components/Words/RandomWord';
import UnsplashWord from '@components/Words/UnsplashWord';

import { subscribeVip, unsubscribeVip } from "@actions";
import * as t from '@consts';
import { RECAPTCHA } from '@config';

import { useSelector, useDispatch } from "react-redux";
import parser from 'html-react-parser';
import _ from 'lodash';

const PublicWord = ({ vip, relatedVips: externalRelatedVips, unsplashVip }) => {
    const [audioUrl, setAudioUrl] = useState("");
    const [loadingAudio, setLoadingAudio] = useState(false);

    const [relatedVips, setRelatedVips] = useState([]);
    const [fetchingRelatedVips, setFetchingRelatedVips] = useState(false);

    const audioRef = useRef(null);
    const gridRef = useRef(null);
    const grid2Ref = useRef(null);

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
    const illustrationExist = !vip?.illustrationIsDefault;
    const noAudio = !audio || (!loadingAudio && !audioUrl);

    const splitWord = vip?.vip?.split(" ");
    const regex = new RegExp(splitWord?.join("|"), "gi");

    let actualRelatedVips = _.isArray(relatedVips) && relatedVips?.filter(item => item?.priority < -2)?.sort((a, b) => a?.priority - b?.priority) || [];
    const moreRelatedVips = _.isArray(relatedVips) && relatedVips?.filter(item => item?.priority >= -2)?.sort((a, b) => a?.priority - b?.priority) || [];

    const ifAnyExactMatch = actualRelatedVips?.find(item => item.vip === vip?.vip);

    // make sure if there is any exact match, it will be the first item
    if (ifAnyExactMatch) {
        actualRelatedVips = [ifAnyExactMatch, ...actualRelatedVips.filter(item => item.vip !== vip?.vip)];
    }

    const gridSizes = useThisToGetSizesFromRef(gridRef, {
        revalidate: 1000,
        terminalCondition: ({ width }) => width !== 0,
        falseCondition: ({ width }) => width === 0,
    });

    const grid2Sizes = useThisToGetSizesFromRef(grid2Ref, {
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

    useEffect(() => {
        if (_.isEqual(relatedVips, [])) {
            setRelatedVips(externalRelatedVips);
        }
    }, [externalRelatedVips, relatedVips]);

    const handleSubscribe = (e) => {
        e?.preventDefault();

        const nextAction = () => {
            if (window?.adHocFetch && recaptcha === true && window.grecaptcha) {
                grecaptcha.ready(function () {
                    grecaptcha
                        .execute(`${RECAPTCHA}`, { action: "vip_authentication" })
                        .then(function (token) {
                            adHocFetch({
                                dispatch,
                                action: subscribeVip(vip?.id, token),
                                onSuccess: () => dispatch({ type: t.HIDE_CONFIRM_DIALOG }),
                                onError: (error) => console.log(error),
                                snackbarMessageOnSuccess: "Subscribed!",
                            });
                        });
                });
            }
        }

        dispatch({
            type: t.SHOW_CONFIRM_DIALOG,
            payload: {
                title: "Note",
                message: "Subscribe means you will follow this word, and note that when the publicity of this word is set to private, you will not be able to see this word anymore.",
                onNext: nextAction,
                nextText: "Subscribe",
            }
        })
    }

    const handleUnsubscribe = (e) => {
        e?.preventDefault();

        const nextAction = () => {
            if (window?.adHocFetch && recaptcha === true && window.grecaptcha) {
                grecaptcha.ready(function () {
                    grecaptcha
                        .execute(`${RECAPTCHA}`, { action: "vip_authentication" })
                        .then(function (token) {
                            adHocFetch({
                                dispatch,
                                action: unsubscribeVip(vip?.id, token),
                                onSuccess: () => dispatch({ type: t.HIDE_CONFIRM_DIALOG }),
                                onError: (error) => console.log(error),
                                snackbarMessageOnSuccess: "Unsubscribed!",
                            });
                        });
                });
            }
        }

        dispatch({
            type: t.SHOW_CONFIRM_DIALOG,
            payload: {
                title: "Warning",
                message: "Are you sure you want to unsubscribe?",
                onNext: nextAction,
                nextText: "Unsubscribe",
                type: "warning"
            }
        })
    }

    const refreshRelatedVips = async (e) => {
        e?.preventDefault();

        setFetchingRelatedVips(true);
        const newRelatedVips = await getNRelatedVips(vip, 6, true);
        setFetchingRelatedVips(false);
        setRelatedVips(newRelatedVips);

    };

    const handleShare = (e) => {
        e?.preventDefault();

        if (navigator.share) {
            navigator.share({
                title: 'WebShare API Demo',
                url: window.location.href,
            }).then(() => {
                dispatch({ type: t.SHOW_SNACKBAR, payload: { message: "Shared!" } });
            })
                .catch(console.error);
        } else {
            // copy link to clipboard
            navigator.clipboard.writeText(window.location.href)
                .then(() => dispatch({ type: t.SHOW_SNACKBAR, payload: { message: "URL copied!" } }))
                .catch(() => dispatch({ type: t.SHOW_SNACKBAR, payload: { message: "Failed to copy!", type: "error" } }));
        }
    }

    return (
        <Container maxWidth="md">
            <Grid container {...Props.GCRSC}>
                <Grid item xs={12} mt={2}>
                    <Typography variant="caption">
                        <i>
                            You are viewing a public word.
                            <Typography variant="caption">
                                &nbsp;[Author: {<MuiLink href={`/user/${vip?.author?.username}`}>{vip?.author?.name}</MuiLink>}]
                            </Typography>
                        </i>
                    </Typography>
                </Grid>

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
                        <IconButton
                            size="small"
                            sx={{ color: theme => theme.palette.publicWord3.main }}
                            onClick={handleShare}
                        >
                            <ShareIcon fontSize="inherit" />
                        </IconButton>
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

                        <Divider sx={{ my: 2 }} textAlign='right'>
                            <Tooltip title="Subscribe to this word" arrow>
                                <IconButton aria-label='Subscribe to this word' sx={{
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
                            <Tooltip title="Unsubscribe from this word" arrow>
                                <IconButton aria-label='Unsubscribe from this word' sx={{
                                    backgroundColor: Colors.LOGO_BLUE,
                                    borderRadius: "12px",
                                    py: 0,
                                    ml: 1,
                                    "&:hover": {
                                        backgroundColor: Colors.LOGO_BLUE,
                                        filter: 'brightness(80%)'
                                    },
                                    "& .MuiTouchRipple-root span": {
                                        borderRadius: "12px",
                                        py: 0
                                    },
                                }} onClick={handleUnsubscribe}>
                                    <PlaylistRemoveIcon color='white' />
                                </IconButton>
                            </Tooltip>
                        </Divider>

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
                <Divider sx={{ my: 2, width: '100%' }} />
                {
                    (!!actualRelatedVips.length || !!moreRelatedVips.length) && <Grid item xs={12} sx={{
                        bgcolor: `relatedPaper.main`,
                        p: 2,
                        borderRadius: '4px',
                        overflow: 'hidden',
                    }}>

                        <Grid container {...Props.GCRBC}>
                            <Typography variant="body1" sx={{
                                fontWeight: Fonts.FW_700,
                                fontSize: Fonts.FS_14,
                                color: (theme) => theme.palette.publicWord2.main,
                                mr: 1,
                                alignIitems: 'center',
                            }}>
                                Related Words
                                <label title="Refresh">
                                    <IconButton
                                        aria-label='Refresh'
                                        size="small"
                                        sx={{
                                            color: 'inherit',
                                            ml: 1,
                                        }}
                                        onClick={refreshRelatedVips}
                                        disabled={fetchingRelatedVips}
                                    >
                                        {
                                            fetchingRelatedVips
                                                ? <CircularProgress size="18px" sx={{ color: 'inherit' }} />
                                                : <RefreshRoundedIcon sx={{ fontSize: 'inherit' }} />
                                        }
                                    </IconButton>
                                </label>
                            </Typography>

                            <Grid item {...Props.GIRCC}>
                                {/* Chú thích */}
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'rgba(63, 81, 181, 0.52)' }} />
                                <Typography variant="caption" sx={{
                                    color: 'rgba(63, 81, 181, 0.72)',
                                    ml: 0.5,
                                    mr: 1
                                }}>
                                    Related
                                </Typography>

                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'rgba(155, 49, 77, 0.52)' }} />
                                <Typography variant="caption" sx={{
                                    color: 'rgba(155, 49, 77, 0.52)',
                                    ml: 0.5,
                                }}>
                                    More
                                </Typography>
                            </Grid>
                        </Grid>


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
                                        <Link href={`/tag/${item.name}`} passHref>
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
                    </Grid>
                }

                <Grid item xs={12} sm={6} ref={grid2Ref}>
                    <Divider sx={{ my: 2, width: '100%' }} />
                    <Grid container {...Props.GCRCC} px={[0, 1]}>
                        <RandomWord width={grid2Sizes?.width} />
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Divider sx={{ my: 2, width: '100%' }} />
                    <Grid container {...Props.GCRCC} px={[0, 1]}>
                        <UnsplashWord width={grid2Sizes?.width} unsplashVip={unsplashVip} />
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

const RelatedVip = ({ vip, gridSizes, actual = false }) => {
    return (
        <Paper sx={{
            width: _.isNumber(gridSizes?.width) ? `calc(${gridSizes.width}px - 0.5rem)` : 100,
            height: _.isNumber(gridSizes?.width) ? `calc(${gridSizes.width}px - 0.5rem)` : 100,
            background: `url(${vip?.illustration || NO_PHOTO}) center center / cover no-repeat`,
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
    backgroundColor: actual ? 'rgba(63, 81, 181, 0.72)' : 'rgba(155, 49, 77, 0.72)',
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