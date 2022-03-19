import React, { useState, useEffect, useRef } from 'react';

import Router from 'next/router';
import Link from 'next/link';

import {
    Paper, InputBase, IconButton,
    Menu, MenuItem, Divider, Grid,
    Link as MuiLink
} from '@mui/material';

import {
    Search as SearchIcon,
    Home as HomeIcon,
    Dashboard as DashboardIcon,
    ListAlt as ListAltIcon,
    AccountCircle as AccountCircleIcon,
    Settings as SettingsIcon,
    PhotoLibrary as PhotoLibraryIcon
} from '@mui/icons-material';

import { Props, SXs, Fonts, Colors } from '@styles';
import { useThisToGetPositionFromRef } from '@utils';

import _ from 'lodash';
import Fuse from 'fuse.js';

export default function CustomizedInputBase({ open = true, mobile = false }) {
    const [results, setResults] = useState([]);
    const [focus, setFocus] = useState(0);

    const paperRef = useRef(null);

    const { bottom, left } = useThisToGetPositionFromRef(paperRef, {
        revalidate: 100,
        terminalCondition: ({ width }) => width > 0
    });

    const handleSearch = (e) => {
        e?.preventDefault();
        const result = search([], e.target.value);
        setFocus(0);
        setResults(result);
    }

    return (
        <Paper
            sx={{ p: '2px', display: open ? 'flex' : 'none', alignItems: 'center', mx: 1, mb: mobile ? 1 : 0, borderRadius: '10px' }}
            variant="outlined"
            id="demo-customized-button"
            ref={paperRef}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search"
                inputProps={{ 'aria-label': 'search google maps' }}
                onChange={handleSearch}
            />
            <IconButton aria-label="search" size="small">
                <SearchIcon />
            </IconButton>
            <Paper variant='outlined' sx={{
                position: 'fixed',
                top: bottom + 5,
                left: left,
                display: !!results.length ? 'flex' : 'none',
                width: `calc(100% - ${left * 2}px)`,
                maxWidth: 500,
                minWidth: 300,
                borderRadius: '10px'
            }}>
                <Grid container {...Props.GCRSC} py={1} spacing={1} sx={{
                    '& .MuiMenuItem-root': {
                        '& .MuiSvgIcon-root': {
                            fontSize: 18,
                            marginRight: theme => theme.spacing(1.5),
                        },
                    },
                }}>
                    {
                        results.map((result, index) => {
                            return <Grid item xs={12} {...Props.GIRSC} key={`results-${index}-search-bar`} sx={{
                                ':hover': {
                                    color: Colors.SEARCH_RESULT
                                }
                            }}>

                                <Link href={result?.item?.link || '#'} passHref>
                                    <MuiLink sx={{ width: '100%', mx: 1 }} underline='none'>
                                        <MenuItem
                                            aria-label={result?.item?.link}
                                            onClick={() => result?.item?.link && Router.push(result.item.link)}
                                            sx={{
                                                width: '100%',
                                                borderRadius: '4px',
                                                border: `1px solid transparent`,
                                                ':hover': {
                                                    border: `1px solid ${Colors.SEARCH_RESULT}`,
                                                }
                                            }}
                                        >
                                            {result?.item?.icon}
                                            {result?.item?.title}
                                        </MenuItem>
                                    </MuiLink>

                                </Link>
                            </Grid>
                        })
                    }
                </Grid>
            </Paper>
        </Paper >
    );
}



const searchData = [
    { link: '/', title: 'Home', icon: <HomeIcon />, tags: ['home', 'homepage', 'main', 'landing', 'index'] },
    { link: '/dashboard', title: 'Dashboard', icon: <DashboardIcon />, tags: ['dashboard', 'dash', 'main', 'landing', 'index', 'my dashboard'] },
    { link: '/my-account', title: 'Account', icon: <AccountCircleIcon />, tags: ['account', 'my account', 'profile', 'user', 'user profile', 'username', 'email', 'password', 'change', 'avatar', 'photo'] },
    { link: '/my-settings', title: 'Settings', icon: <SettingsIcon />, tags: ['settings', 'my settings', 'autofill', 'examples', 'meaning', 'practice set', 'number of questions', 'image fit', 'public', 'private', 'priority'] },
    { link: '/my-library', title: 'Library', icon: <PhotoLibraryIcon />, tags: ['images', 'photos', 'my', 'urls', 'illustrations', 'library', 'gallery'] },
    { link: '/my-word-list', title: 'Word List', icon: <ListAltIcon />, tags: ['edit', 'delete', 'update', 'word', 'find word', 'my words', 'word list'] }
];

const searchKeys = [
    { name: 'title', weight: 0.8 },
    { name: 'link', weight: 0.5 },
    { name: 'tags', weight: 0.5 }
];

const search = (additionalData = [], value) => {
    const fuse = new Fuse([...searchData, ...additionalData], {
        keys: searchKeys
    })

    return fuse.search(value);
}
