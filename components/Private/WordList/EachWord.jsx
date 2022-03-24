import React, { useState, useEffect } from 'react';

import {
    Checkbox, Grid, Typography, IconButton,
    Paper, Avatar, MenuItem, ListItem, ListItemButton,
    Divider,
} from '@mui/material';

import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';

import { Props, SXs, Colors, Fonts } from '@styles';
import { getAudioUrl } from '@utils';

import LoadingImage from '@components/LoadingImage';

import _ from 'lodash';

const EachWord = ({ vip, selectedVips, setSelectedVips }) => {
    const [expand, setExpand] = useState(false);
    const [audioUrl, setAudioUrl] = useState("");

    const meaningsCount = (vip?.meanings?.english?.length || 0) + (vip?.meanings?.vietnamese?.length || 0);
    const examplesCount = vip?.examples?.length || 0;

    const synonyms = !_.isEmpty(vip?.synonyms) && _.isString(vip?.synonyms) ? vip.synonyms.split(/[ ,]+/) : [];
    const antonyms = !_.isEmpty(vip?.antonyms) && _.isString(vip?.antonyms) ? vip.antonyms.split(/[ ,]+/) : [];

    const synonymsCount = synonyms.length;
    const antonymsCount = antonyms.length;

    const illustrationExist = !vip?.illustrationIsDefault;
    const subscriberCount = vip?.user?.length;
    const tagsCount = vip?.tags?.length;

    const audio = vip?.audio;

    useEffect(() => {
        const run = async () => {
            setAudioUrl("");
            if (!_.isEmpty(audio)) {
                getAudioUrl(audio, (url) => {
                    setAudioUrl(url);
                });
            }
        }
        run();
    }, [audio]);


    const handleClickExpand = (e) => {
        setExpand(prev => !prev);
    }

    const handleCheckbox = () => {
        setSelectedVips(vip.id)
    }

    return (
        <Paper variant='outlined' sx={{ mx: 1, my: 0.5, overflow: 'hidden' }}>
            <ListItem sx={{ borderRadius: '4px' }} disablePadding>
                <ListItemButton sx={{ p: 1, pl: 0, borderRadius: '4px' }} onClick={handleClickExpand}>
                    <Grid container {...Props.GCRSC}>
                        <Grid item xs="auto">
                            <Checkbox
                                checked={selectedVips.includes(vip.id)}
                                onChange={handleCheckbox}
                                onClick={e => e.stopPropagation()}
                            />
                        </Grid>
                        <Grid item xs {...Props.GIRCC}>
                            <Grid container {...Props.GCRBC}>
                                <Grid item xs={5}>
                                    <Typography className='overflow Typography' sx={{
                                        fontWeight: Fonts.FW_500,
                                        color: theme => theme.palette.publicWord3.main
                                    }}>
                                        {vip.vip}
                                    </Typography>
                                </Grid>
                                <Grid item sx={{ px: 0.5 }}>
                                    <LoadingImage
                                        src={vip.illustration}
                                        alt={vip.vip}
                                        width={45}
                                        height={45}
                                        objectFit='cover'
                                        borderRadius="50%"
                                        draggable={false}
                                    />
                                </Grid>
                                <Grid item sx={{ px: 0.5 }}>
                                    <Paper sx={styles.meaningsCount} elevation={0}>
                                        <Typography className='overflowTypography'>
                                            {meaningsCount}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item sx={{ px: 0.5 }}>
                                    <Paper sx={styles.examplesCount} elevation={0}>
                                        <Typography className='overflowTypography'>
                                            {examplesCount}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item sx={{ px: 0.5 }}>
                                    <IconButton aria-label='more' onClick={e => e.stopPropagation()}>
                                        <MoreVertRoundedIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </ListItemButton>
            </ListItem>
            {
                expand && <Grid container {...Props.GCRSC} sx={{
                    p: 1,
                    borderTop: theme => `1px solid ${theme.palette.divider}`,
                }}>
                    <Grid item xs={12} my={1} px={1}>
                        <Typography sx={{ fontWeight: Fonts.FW_500 }} className='overflowTypography'>
                            Health check
                        </Typography>
                    </Grid>
                    <Grid item xs={6} {...Props.GIRSC}>
                        <Grid container px={1}>
                            <Grid item xs>
                                <Typography className='overflowTypography' sx={{ mr: 1 }}>
                                    Pronounce
                                </Typography>
                            </Grid>
                            <Grid item xs="auto">
                                {
                                    vip.pronounce ? <CheckBoxRoundedIcon color='success' /> : <CheckBoxOutlineBlankRoundedIcon />
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} {...Props.GIRSC}>
                        <Grid container px={1}>
                            <Grid item xs>
                                <Typography className='overflowTypography' sx={{ mr: 1 }}>
                                    Example ({examplesCount})
                                </Typography>
                            </Grid>
                            <Grid item xs="auto">
                                {
                                    !!examplesCount ? <CheckBoxRoundedIcon color='success' /> : <CheckBoxOutlineBlankRoundedIcon />
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} {...Props.GIRSC}>
                        <Grid container px={1}>
                            <Grid item xs>
                                <Typography className='overflowTypography' sx={{ mr: 1 }}>
                                    Meaning ({meaningsCount})
                                </Typography>
                            </Grid>
                            <Grid item xs="auto">
                                {
                                    !!meaningsCount ? <CheckBoxRoundedIcon color='success' /> : <CheckBoxOutlineBlankRoundedIcon />
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} {...Props.GIRSC}>
                        <Grid container px={1}>
                            <Grid item xs>
                                <Typography className='overflowTypography' sx={{ mr: 1 }}>
                                    Synonym ({synonymsCount})
                                </Typography>
                            </Grid>
                            <Grid item xs="auto">
                                {
                                    !!synonymsCount ? <CheckBoxRoundedIcon color='success' /> : <CheckBoxOutlineBlankRoundedIcon />
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} {...Props.GIRSC}>
                        <Grid container px={1}>
                            <Grid item xs>
                                <Typography className='overflowTypography' sx={{ mr: 1 }}>
                                    Antonym ({antonymsCount})
                                </Typography>
                            </Grid>
                            <Grid item xs="auto">
                                {
                                    !!antonymsCount ? <CheckBoxRoundedIcon color='success' /> : <CheckBoxOutlineBlankRoundedIcon />
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} {...Props.GIRSC}>
                        <Grid container px={1}>
                            <Grid item xs>
                                <Typography className='overflowTypography' sx={{ mr: 1 }}>
                                    Illustration
                                </Typography>
                            </Grid>
                            <Grid item xs="auto">
                                {
                                    illustrationExist ? <CheckBoxRoundedIcon color='success' /> : <CheckBoxOutlineBlankRoundedIcon />
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} {...Props.GIRSC}>
                        <Grid container px={1}>
                            <Grid item xs>
                                <Typography className='overflowTypography' sx={{ mr: 1 }}>
                                    Audio
                                </Typography>
                            </Grid>
                            <Grid item xs="auto">
                                {
                                    !!audioUrl.length ? <CheckBoxRoundedIcon color='success' /> : <CheckBoxOutlineBlankRoundedIcon />
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} {...Props.GIRSC}>
                        <Grid container px={1}>
                            <Grid item xs>
                                <Typography className='overflowTypography' sx={{ mr: 1 }}>
                                    Subscriber ({subscriberCount})
                                </Typography>
                            </Grid>
                            <Grid item xs="auto">
                                {
                                    !!subscriberCount ? <CheckBoxRoundedIcon color='success' /> : <CheckBoxOutlineBlankRoundedIcon />
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} {...Props.GIRSC}>
                        <Grid container px={1}>
                            <Grid item xs>
                                <Typography className='overflowTypography' sx={{ mr: 1 }}>
                                    Tag ({tagsCount})
                                </Typography>
                            </Grid>
                            <Grid item xs="auto">
                                {
                                    !!tagsCount ? <CheckBoxRoundedIcon color='success' /> : <CheckBoxOutlineBlankRoundedIcon />
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} {...Props.GIRSC}>
                        <Grid container px={1}>
                            <Grid item xs>
                                <Typography className='overflowTypography' sx={{ mr: 1 }}>
                                    Public
                                </Typography>
                            </Grid>
                            <Grid item xs="auto">
                                {
                                    vip.public ? <CheckBoxRoundedIcon color='success' /> : <CheckBoxOutlineBlankRoundedIcon />
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            }
        </Paper>
    );
}

const styles = {
    examplesCount: {
        p: 1,
        backgroundColor: Colors.LOGO_YELLOW,
        color: Colors.WHITE,
        minWidth: 30,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    meaningsCount: {
        p: 1,
        backgroundColor: Colors.LOGO_BLUE,
        color: Colors.WHITE,
        minWidth: 30,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
}

export default EachWord;