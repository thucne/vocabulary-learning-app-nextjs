import { useState, useEffect, useRef } from 'react';

import Link from 'next/link';
import Router from 'next/router';

import {
    Container, Grid, Typography, Link as MuiLink,
    Divider, IconButton, Tooltip, CircularProgress,
    Paper, Slider
} from '@mui/material';

import {
    VolumeUpRounded as VolumeUpRoundedIcon,
    Share as ShareIcon,
    LaunchRounded as LaunchRoundedIcon
} from '@mui/icons-material';

import VolumeOffIcon from '@mui/icons-material/VolumeOff';

import { Props, SXs, Fonts, Colors } from '@styles';
import { deepExtractObjectStrapi, getAudioUrl } from '@utils';
import { AUDIO_ALT } from '@consts';
import * as t from '@consts';

import LoadingImage from '@components/LoadingImage';

import _ from 'lodash';
import { useDispatch } from 'react-redux';
import parser from 'html-react-parser';

const AnyWord = ({ results = [], word }) => {

    const vips = results;

    return (
        <Container maxWidth="md">
            <Grid container {...Props.GCRSC} mt={2}>
                <Grid item xs={12}>
                    <Typography variant="caption">
                        <i>The following are the results for the term &quot;{word}&quot;.</i>
                    </Typography>
                </Grid>
                {
                    _.isArray(vips) && !_.isEmpty(vips) && vips.map((vip, index) => {
                        return <EachResult key={`results-${index}-general`} rawVip={vip} index={index} />
                    })
                }
            </Grid>
        </Container>
    )
}


const EachResult = ({ rawVip, index }) => {

    const vip = deepExtractObjectStrapi(rawVip?.item, {
        minifyPhoto: ['illustration'],
        allowNullPhoto: true
    });
    // evidence is all but item field
    const evidence = _.omit(rawVip, 'item');
    const score = evidence?.score;

    return (
        <Grid item xs={12}>
            <Grid container {...Props.GCRSC}>
                <ResultInfo vip={vip} index={index} />
                <ResultEvidence evidence={evidence} vip={vip} score={score} />
            </Grid>
        </Grid>
    )
}

const ResultInfo = ({ vip, index }) => {
    const [loadingAudio, setLoadingAudio] = useState(false);
    const [audioUrl, setAudioUrl] = useState("");
    const audioRef = useRef(null);

    const type1 = vip?.type1;
    const type2 = vip?.type2;
    const audio = vip?.audio;
    const pronounce = vip?.pronounce;
    const photo = vip?.illustration;
    const english = vip?.meanings?.english;
    const vietnamese = vip?.meanings?.vietnamese;
    const illustrationExist = !vip?.illustrationIsDefault;
    const noAudio = !audio || (!loadingAudio && !audioUrl);


    const author = vip?.author?.name;
    const authorUrl = `/user/${vip?.author?.username}`;

    const dispatch = useDispatch();

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
        <Grid item xs={12}>
            <Divider sx={{ my: 2 }} textAlign="left">
                {
                    author &&
                    <Link href={authorUrl} passHref>
                        <MuiLink underline='none' sx={{
                            backgroundColor: Colors.LOGO_YELLOW,
                            color: Colors.LOGO_RED,
                            fontSize: Fonts.FS_12,
                            fontWeight: Fonts.FW_500,
                            px: 0.5,
                            borderRadius: '4px'
                        }}>@{author}
                        </MuiLink>
                    </Link>
                }
            </Divider>

            <Grid container {...Props.GCRBC}>
                {/* main word */}
                <Grid item xs={12} {...Props.GIRBC}>
                    <Typography variant="h4" component="h1" className='overflowTypography'
                        sx={{
                            color: theme => theme.palette.publicWord3.main,
                        }}
                    >
                        {index + 1}. {vip.vip}
                        <Tooltip title="Open">
                            <IconButton sx={{ color: 'inherit' }} onClick={() => Router.push(vip?.public
                                ? `/word/public/${vip?.vip}/${vip?.id}`
                                : `/word/${vip?.vip}/${vip?.id}`
                            )}>
                                <LaunchRoundedIcon />
                            </IconButton>
                        </Tooltip>
                    </Typography>
                    <IconButton
                        size="small"
                        sx={{ color: theme => theme.palette.publicWord3.main }}
                        onClick={handleShare}
                    >
                        <ShareIcon fontSize="inherit" />
                    </IconButton>
                </Grid>

                <Grid item>
                    <Grid container {...Props.GCRSC}>
                        {
                            !!type1?.length && <Grid xs={12} item {...Props.GIRSC} mt={1}>
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
                                <Grid item xs={12} key={`type2-${index}`} {...Props.GIRSC}>
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

                <Grid item {...Props.GIRCC}>
                    {
                        !_.isEmpty(photo) && illustrationExist && (
                            <div style={{
                                position: "relative",
                                width: 96,
                                height: 54,
                                borderRadius: '4px',
                                overflow: 'hidden',
                            }}>
                                <LoadingImage
                                    src={photo}
                                    alt={`${vip.vip} illustration`}
                                    layout='fill'
                                    objectFit='contain'
                                    draggable={false}
                                    quality={100}
                                />
                            </div>
                        )
                    }
                </Grid>

                <Grid item xs={12} {...Props.GIRSC} mt={1}>
                    {
                        !_.isEmpty(english?.[0]) && <Typography variant="body1" sx={{
                            fontWeight: Fonts.FW_500,
                            fontSize: Fonts.FS_18,
                            color: (theme) => theme.palette.mainPublicWord.main,
                        }}>
                            → {english?.[0]?.split(" ").map((word, index) => (
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
                    }
                    {
                        !_.isEmpty(vietnamese?.[0]) && <Typography variant="body1" sx={{
                            fontWeight: Fonts.FW_500,
                            fontSize: Fonts.FS_18,
                            color: (theme) => theme.palette.mainPublicWord.main,
                        }}>
                            → {vietnamese?.[0]?.split(" ").map((word, index) => (
                                <Link
                                    key={`vietnamese-${index}`}
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
                    }
                </Grid>
            </Grid>

        </Grid>
    )
}

const ResultEvidence = ({ evidence = {}, vip, score }) => {

    const matches = evidence?.matches;
    const matchedPercentage = _.isNumber(score) ? `${Math.floor((1 - score) * 100)}%` : '0%';

    return (
        <Grid item xs={12} mt={1}>
            <Grid container {...Props.GCRSC} spacing={1}>
                {
                    !_.isEmpty(matches) && _.isArray(matches) && matches?.slice(0, 5)?.map((item, index) => (
                        <EachEvidence key={`evidence-${index}`} evidence={item} />
                    ))
                }
                <Grid item xs={12} {...Props.GIRBC}>
                    <Typography variant="caption" sx={{ color: theme => theme.palette.publicWord1.main }}>
                        {matchedPercentage} matched
                    </Typography>
                    <Link
                        href={
                            vip?.public
                                ? `/word/public/${vip?.vip}/${vip?.id}`
                                : `/word/${vip?.vip}/${vip?.id}`
                        }
                        passHref
                    >
                        <MuiLink underline='hover' sx={{ color: theme => theme.palette.publicWord3.main }}>
                            <i>See more</i>
                        </MuiLink>
                    </Link>
                </Grid>
            </Grid>
        </Grid>
    )
}

// replace positions in indices in value with hightlighted text
const getText = (value, indices) => {
    const underlined = indices
        .map(index => value.slice(index[0], index[1] + 1))
        .filter(item => !_.isEmpty(item));

    // replace value with highlighted text
    return underlined.reduce((acc, curr, index) => {
        return acc.replace(curr, `<u>${curr}</u>`)
    }, value);
}


const EachEvidence = ({ evidence }) => {

    const key = evidence?.key?.replace("attributes.", "")?.split(".")?.[0];
    const indices = evidence?.indices;
    const value = evidence?.value;
    const rawHighlighted = getText(value, indices);

    // split out by <u> tags
    const regex = new RegExp(/<u>(.*?)<\/u>/g);

    // split and get <u> tags
    const highlightedTags = rawHighlighted?.match(regex);

    // unhiglighted text
    const regex2 = new RegExp(highlightedTags?.join('|'), 'g');
    const unHighlighted = rawHighlighted?.split(regex2);

    // transform to <span> tags with underline, color red
    const highlightedText = highlightedTags?.map((item, index) => {
        // remove <u> tags
        const text = item?.replace(/<\/?u>/g, '');

        return `<span style="text-decoration: underline; color: ${Colors.RED}">${text}</span>`
    });

    // join back together one by one
    const highlighted = unHighlighted?.reduce((acc, curr, index) => {
        return (acc || '') + (curr || '') + (highlightedText?.[index] || '');
    }, '');

    return (
        <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 1 }}>
                <Typography variant="body1" component="h2" className='overflowTypography'
                    sx={{ color: theme => theme.palette.mainPublicWord.main }}
                >
                    <b>[{key === 'vip' ? 'word' : key}]</b> {parser(highlighted?.replaceAll(",", ", "))}
                </Typography>
            </Paper>
        </Grid>
    )
}

export default AnyWord;