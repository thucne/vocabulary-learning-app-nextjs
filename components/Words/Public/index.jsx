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

import { styled } from '@mui/system';

import { Props, SXs, Fonts, Colors } from '@styles';
import { getAudioUrl, getPastelColor, useThisToGetSizesFromRef } from '@utils';
import { AUDIO_ALT } from '@consts';
import LoadingImage from '@components/LoadingImage';

import parser from 'html-react-parser';
import _ from 'lodash';

const PublicWord = ({ vip, relatedVips }) => {
    const [audioUrl, setAudioUrl] = useState("");
    const [loadingAudio, setLoadingAudio] = useState(false);
    const bgColor = getPastelColor();

    const audioRef = useRef(null);
    const gridRef = useRef(null);

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

    const actualRelatedVips = relatedVips?.filter(item => item?.priority < 0) || [];
    const moreRelatedVips = relatedVips?.filter(item => item?.priority >= 0) || [];

    const gridSizes = useThisToGetSizesFromRef(gridRef, {
        revalidate: 1000,
        terminalCondition: ({ width }) => width !== 0,
        falseCondition: ({ width }) => width === 0,
    });

    console.log(actualRelatedVips, moreRelatedVips);

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
                    <Divider sx={{ my: 2 }} />
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

                    <Divider sx={{ my: 2 }} textAlign='right'>
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
                                        bgColor={bgColor}
                                    />
                                </div>
                            )
                        }
                        {
                            english.map((item, index) => (
                                <Typography key={`english-${index}`} variant="body1" mt={index !== 0 ? 1 : 0} sx={{
                                    fontWeight: Fonts.FW_500,
                                    fontSize: Fonts.FS_18,
                                    color: (theme) => theme.palette.publicWord2.main,
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
                                    color: (theme) => theme.palette.publicWord2.main
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
                        <Grid container {...Props.GCRSC} spacing={2}>
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
                        <Grid container {...Props.GCRSC} spacing={2}>
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
                    !!tags?.length && <Grid item xs={12}>
                        <Typography variant="body1" sx={{
                            fontWeight: Fonts.FW_700,
                            fontSize: Fonts.FS_14,
                            color: (theme) => theme.palette.publicWord2.main
                        }}>
                            Keywords
                        </Typography>
                        <Grid container {...Props.GCRSC} spacing={2}>
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

                {
                    (!!actualRelatedVips.length || !!moreRelatedVips.length) && <Grid item xs={12} sx={{
                        backgroundColor: `${Colors.LOGO_YELLOW}50`,
                        p: 2,
                        borderRadius: '4px',
                        overflow: 'hidden',
                    }}>
                        <Typography variant="body1" sx={{
                            fontWeight: Fonts.FW_700,
                            fontSize: Fonts.FS_14,
                            color: (theme) => theme.palette.publicWord2.main,
                            mb: 1
                        }}>
                            Related Words
                        </Typography>
                        {
                            !!actualRelatedVips.length && <Grid
                                container
                                columns={[12, 12, 12]}
                                spacing={1}
                                {...Props.GCRSC}
                            >
                                {
                                    actualRelatedVips.map((item, index) => (
                                        <Grid ref={gridRef} item xs={4} sm={2} key={`related-vip-${index}`}>
                                            <RelatedVip vip={item} gridSizes={gridSizes} actual={true} />
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        }
                    </Grid>
                }
            </Grid>
        </Container>
    );
};

const DarkBackGround = ({ actual }) => <div style={{
    backgroundColor: actual ? 'rgba(63, 81, 181, 0.52)' : 'rgba(155, 49, 77, 0.52)',
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1
}}>
</div>;

const RelatedVip = ({ vip, gridSizes, actual = false }) => {
    return (
        <Paper sx={{
            width: _.isNumber(gridSizes?.width) ? `calc(${gridSizes.width}px - 0.5rem)` : 100,
            height: _.isNumber(gridSizes?.width) ? `calc(${gridSizes.width}px - 0.5rem)` : 100,
            borderRadius: '4px',
            position: 'relative',
            overflow: 'hidden',
            background: `url(${vip?.illustration}) center center / cover no-repeat`,
            color: Colors.WHITE,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
        }}>
            <DarkBackGround actual={actual} />
            <Link href={!vip?.public ? `/word/${encodeURIComponent(vip?.vip)}/${vip?.id}` : `/word/public/${encodeURIComponent(vip?.vip)}/${vip?.id}`} passHref>
                <IconButton sx={{
                    color: Colors.WHITE,
                    fontSize: Fonts.FS_14,
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
                }}>
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

export default PublicWord;