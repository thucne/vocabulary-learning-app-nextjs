import React, { useState, useEffect } from 'react';

import Router from 'next/router';

import {
    Checkbox, Grid, Typography, IconButton,
    Paper, ListItem, ListItemButton,
    Divider, Tooltip, ClickAwayListener,
    Menu, MenuItem
} from '@mui/material';

import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import EditIcon from '@mui/icons-material/Edit';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';

import { styled, alpha } from '@mui/material/styles';

import { Props, SXs, Colors, Fonts } from '@styles';
import { getAudioUrl } from '@utils';

import LoadingImage from '@components/LoadingImage';
import WordSnippet from "./WordSnippet";

import _ from 'lodash';

const EachWord = ({ vip, selectedVips, setSelectedVips, setCurrentWord }) => {
    const [expand, setExpand] = useState(false);
    const [audioUrl, setAudioUrl] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);


    const [tooltips, setTooltips] = useState({
        examples: false,
        meanings: false
    });

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

    const type1 = vip?.type1;
    const type2 = vip?.type2;

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

    const handleTooltipClose = (isMeaning) => {
        setTooltips({
            ...tooltips,
            [isMeaning ? "meanings" : "examples"]: false
        })
    };

    const handleTooltipOpen = (isMeaning) => {
        setTooltips({
            ...tooltips,
            [isMeaning ? "meanings" : "examples"]: true
        })
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Paper variant='outlined' sx={{
            mx: 1, my: 0.5, overflow: 'hidden',
            borderColor: theme => expand ? Colors.DIALOG_BLUE : theme.palette.divider,
            borderWidth: expand ? 2 : 1
        }}>
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
                                <Grid item xs={8} {...Props.GIRSE}>
                                    <Typography className='overflowTypography' sx={{
                                        fontWeight: Fonts.FW_500,
                                        color: theme => theme.palette.publicWord3.main
                                    }}>
                                        {vip.vip}
                                    </Typography>
                                    {
                                        vip.matched && <Typography variant='caption' className='overflowTypography' sx={{
                                            color: theme => theme.palette.publicWord3.main,
                                            ml: 1
                                        }}>
                                            {vip.matched}%
                                        </Typography>
                                    }
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
                                <Grid item sx={{ px: 0.5, display: ['none', 'flex'] }}>
                                    <Tooltip title="Number of meanings">
                                        <Paper sx={styles.meaningsCount} elevation={0}>
                                            <Typography className='overflowTypography'>
                                                {meaningsCount}
                                            </Typography>
                                        </Paper>
                                    </Tooltip>
                                </Grid>
                                <Grid item sx={{ px: 0.5, display: ['none', 'flex'] }}>
                                    <Tooltip title="Number of examples">
                                        <Paper sx={styles.examplesCount} elevation={0} >
                                            <Typography className='overflowTypography'>
                                                {examplesCount}
                                            </Typography>
                                        </Paper>
                                    </Tooltip>
                                </Grid>
                                <Grid item sx={{ px: 0.5 }}>
                                    <IconButton
                                        aria-label='more'
                                        onClick={e => {
                                            e.stopPropagation();
                                            handleClick(e);
                                        }}
                                        id={`demo-customized-button-${vip.id}`}
                                        aria-controls={open ? `demo-customized-menu-${vip.id}` : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                    >
                                        <MoreVertRoundedIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </ListItemButton>
            </ListItem>
            <StyledMenu
                id={`demo-customized-menu-${vip.id}`}
                MenuListProps={{
                    'aria-labelledby': `demo-customized-button-${vip.id}`,
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={() => {
                    handleClose();
                    setCurrentWord(vip);
                }}>
                    <EditIcon />
                    Edit
                </MenuItem>
                <MenuItem onClick={() => {
                    handleClose();
                    Router.push(vip?.public ? `/word/public/${vip?.vip}/${vip?.id}` : `/word/${vip?.vip}/${vip?.id}`)
                }}>
                    <LaunchRoundedIcon />
                    Open
                </MenuItem>
            </StyledMenu>
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

                    <Grid item xs={12} p={1}>
                        <WordSnippet vip={vip} />
                    </Grid>
                </Grid>
            }
        </Paper>
    );
}

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        // minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

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