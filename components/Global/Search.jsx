import React, { useState, useEffect, useRef, useMemo } from 'react';

import Router from 'next/router';
import Link from 'next/link';

import {
    Paper, InputBase, IconButton,
    Menu, MenuItem, Divider, Grid,
    Link as MuiLink,
    Typography, MenuList
} from '@mui/material';

import {
    Search as SearchIcon,
    Home as HomeIcon,
    Dashboard as DashboardIcon,
    ListAlt as ListAltIcon,
    AccountCircle as AccountCircleIcon,
    Settings as SettingsIcon,
    PhotoLibrary as PhotoLibraryIcon,
    Ballot as BallotIcon,
} from '@mui/icons-material';

import { Props, SXs, Fonts, Colors } from '@styles';
import {
    useThisToGetPositionFromRef, useOutsideAlerter,
    useInsideAlerter, handleFuzzyResults, fuzzyWordToSearchData, deepExtractObjectStrapi
} from '@utils';
import { fetcherJWTIfAny } from '@actions';
import { API } from '@config';

import _ from 'lodash';
import Fuse from 'fuse.js';
import qs from 'qs';
import useSWR from 'swr';
import parser from 'html-react-parser';
import { useDispatch } from 'react-redux';
import * as t from '@consts';

const fetcher = async (...args) => await fetcherJWTIfAny(...args);

export default function CustomizedInputBase({ open = true, mobile = false }) {
    const [results, setResults] = useState([]);
    const [searchString, setSearchString] = useState('');
    const [forcedClose, setForcedClose] = useState(false);

    const paperRef = useRef(null);
    const inputRef = useRef(null);
    const resultsRef = useRef(null);
    const eachResultRef = useRef([]);
    const dispatch = useDispatch();

    const queryString = qs.stringify({
        max: 10,
    }, { encodeValuesOnly: true });

    const { data } = useSWR(searchString ? `${API}/api/fuzzy-search/${searchString}?${queryString}` : null, fetcher, {
        onSuccess: () => setLoading(false)
    });

    const wordResults = useMemo(() =>
        handleFuzzyResults(_.isArray(data?.data) && !_.isEmpty(data?.data) ? data.data : [])
            ?.slice(0, 5),
        [data]);

    useEffect(() => eachResultRef.current = eachResultRef.current.slice(0, results.length), [results.length]);

    useEffect(() => {
        if (!forcedClose && !!searchString?.trim()?.length) {
            dispatch({ type: t.BLUR_SCREEN });
        } else {
            dispatch({ type: t.UNBLUR_SCREEN });
        }
    }, [forcedClose, searchString, dispatch]);

    useEffect(() => {
        let currentInput = inputRef?.current;

        const handler = (event) => {
            if (event.ctrlKey && event.key === 'k') {
                event?.preventDefault();
                setForcedClose(false);
                currentInput?.focus();
            }
            if (event.key === 'Escape') {
                setForcedClose(true);
            }
        }

        document.addEventListener('keydown', handler);

        return () => document.removeEventListener('keydown', handler);
    }, []);

    useOutsideAlerter(resultsRef, () => {
        setForcedClose(true);
    });

    useInsideAlerter(inputRef, () => {
        setForcedClose(false);
    });

    const debounceSearch = useMemo(() => _.debounce((e) => setSearchString(e.target.value), 500), []);

    const handleSearch = (e) => {
        e?.preventDefault();
        const result = searchDefault(e.target.value);
        setResults(result);
        debounceSearch(e);
    }

    return (
        <Paper
            sx={{
                px: 1, py: '2px',
                display: open ? 'flex' : 'none',
                alignItems: 'center',
                mx: 1, mb: mobile ? 1 : 0,
                borderRadius: '10px',
                position: 'relative',
            }}
            variant="outlined"
            id="demo-customized-button"
        >
            <IconButton aria-label="search" size="small" disableRipple onClick={() => {
                setForcedClose(false);
                inputRef?.current?.focus()
            }}>
                <SearchIcon />
            </IconButton>
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search"
                inputProps={{ 'aria-label': 'Search' }}
                value={searchString}
                onClick={() => {
                    setForcedClose(false);
                    inputRef?.current?.focus()
                }}
            />
            <Typography variant="caption" sx={{
                px: 1,
                borderRadius: '4px',
                backgroundColor: Colors.GREY_400,
                color: Colors.WHITE,
                fontWeight: Fonts.FW_600,
                cursor: 'pointer',
                display: mobile ? 'none' : 'flex',
            }} onClick={() => {
                setForcedClose(false);
                inputRef?.current?.focus()
            }}>
                Ctrl + K
            </Typography>

            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: !forcedClose ? 'flex' : 'none',
                backgroundColor: 'rgba(111, 126, 140, 0.2)',
                zIndex: 1,
                backdropFilter: 'blur(4px)',
                transition: 'opacity 100ms ease 0s',
            }} />

            <Paper variant='outlined' sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `90%`,
                maxWidth: 500,
                minWidth: 300,
                borderRadius: '10px',
                maxHeight: `calc(100vh - ${40}px)`,
                overflowY: 'auto',
                overflowX: 'hidden',
                display: !forcedClose ? 'flex' : 'none',
                zIndex: 2,
                flexDirection: 'column',
            }} ref={resultsRef}>
                <Grid container {...Props.GCRSC} p={1}>
                    <IconButton aria-label="search" size="small" disableRipple onClick={() => inputRef?.current?.focus()}>
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search"
                        inputProps={{ 'aria-label': 'search google maps' }}
                        onChange={handleSearch}
                        inputRef={inputRef}
                    />
                    <Typography variant="caption" sx={{
                        px: 1,
                        borderRadius: '4px',
                        backgroundColor: Colors.GREY_400,
                        color: Colors.WHITE,
                        fontWeight: Fonts.FW_600,
                        cursor: 'pointer',
                        display: mobile ? 'none' : 'flex',
                    }} onClick={() => {
                        setForcedClose(false);
                        inputRef?.current?.focus()
                    }}>
                        ESC
                    </Typography>
                </Grid>
                <Grid container {...Props.GCRSC} sx={{
                    '& .MuiMenuItem-root': {
                        '& .MuiSvgIcon-root': {
                            fontSize: 18,
                            marginRight: theme => theme.spacing(1.5),
                        },
                        '& .MuiIcon-root': {
                            fontSize: 18,
                            marginRight: theme => theme.spacing(1.5),
                        },
                    },
                }}>

                    {
                        !!!wordResults.length && !!!results.length && !!searchString?.trim()?.length && <Typography variant="caption" sx={{ p: 1.5 }}>
                            No results found for &quot;{searchString}&quot;
                        </Typography>
                    }
                    {
                        !!wordResults?.length && <Typography variant="caption" sx={{ pt: 1, px: 1.5 }}>
                            Word
                        </Typography>
                    }
                    <MenuList sx={{ width: '100%', px: 1, display: !!wordResults?.length ? 'block' : 'none' }}>
                        {
                            wordResults?.map((result, index) => {
                                const handledData = deepExtractObjectStrapi(result?.item, { minifyPhoto: ['illustration'] });
                                const displayData = fuzzyWordToSearchData({ ...handledData, hightlight: result?.highlight });

                                return <MenuItem
                                    key={`-word-results-${index}-search-bar`}
                                    aria-label={displayData?.link}
                                    onClick={() => displayData?.link && Router.push(displayData.link)}
                                    sx={{
                                        width: '100%',
                                        borderRadius: '4px',
                                        border: `1px solid transparent`,
                                        borderBottomColor: index !== wordResults.length - 1 ? `${Colors.GREY_200}` : 'transparent',
                                        ':hover': {
                                            border: `1px solid ${Colors.SEARCH_RESULT}`,
                                            color: Colors.SEARCH_RESULT
                                        },
                                        ':focus, :active': {
                                            border: `1px solid ${Colors.SEARCH_RESULT}`,
                                            color: Colors.SEARCH_RESULT
                                        },
                                        p: 0
                                    }}
                                >
                                    <Link href={displayData?.link || '/'} passHref>
                                        <MuiLink underline="none" sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: 'inherit',
                                            width: '100%',
                                            p: '6px 16px',
                                            ':hover, :active, :focus': {
                                                outline: `none`,
                                                borderRadius: '4px',
                                                color: Colors.SEARCH_RESULT,
                                            }
                                        }}>
                                            {displayData?.icon}
                                            <Grid container {...Props.GCCXS} sx={{
                                                position: 'relative',
                                                maxWidth: '100%',
                                                overflow: 'hidden',
                                            }}>
                                                <Grid item xs={12}>
                                                    <Typography className='overflowTypography'>
                                                        {parser(displayData?.title?.replace(new RegExp(`(${searchString})`, 'gi'), `<u>$1</u>`))}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography
                                                        variant="caption"
                                                        className='overflowTypography'
                                                    >
                                                        {parser(displayData?.description)}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </MuiLink>
                                    </Link>
                                </MenuItem>
                            })
                        }
                    </MenuList>

                    {
                        !!results?.length && <Typography variant="caption" sx={{ pt: 1, px: 1.5 }}>
                            Directory
                        </Typography>
                    }
                    <MenuList sx={{ width: '100%', px: 1, display: !!results?.length ? 'block' : 'none' }}>
                        {
                            results?.map((result, index) => {
                                return <MenuItem
                                    key={`results-${index}-search-bar`}
                                    aria-label={result?.item?.link}
                                    onClick={() => result?.item?.link && Router.push(result.item.link)}
                                    sx={{
                                        width: '100%',
                                        borderRadius: '4px',
                                        border: `1px solid transparent`,
                                        borderBottomColor: index !== results.length - 1 ? `${Colors.GREY_200}` : 'transparent',
                                        ':hover': {
                                            border: `1px solid ${Colors.SEARCH_RESULT}`,
                                            color: Colors.SEARCH_RESULT
                                        },
                                        ':focus, :active': {
                                            border: `1px solid ${Colors.SEARCH_RESULT}`,
                                            color: Colors.SEARCH_RESULT
                                        },
                                        p: 0
                                    }}
                                >
                                    <Link href={result?.item?.link || '/'} passHref>
                                        <MuiLink underline="none" sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: 'inherit',
                                            width: '100%',
                                            height: '100%',
                                            p: '6px 16px',
                                            ':hover, :active, :focus': {
                                                outline: `none`,
                                                borderRadius: '4px',
                                                color: Colors.SEARCH_RESULT,
                                            }
                                        }}>
                                            {result?.item?.icon}
                                            {result?.item?.title}
                                        </MuiLink>
                                    </Link>
                                </MenuItem>
                            })
                        }
                    </MenuList>
                </Grid>
            </Paper>
        </Paper >
    );
}



const searchDefaultData = [
    { link: '/', title: 'Home', icon: <HomeIcon />, tags: ['home', 'homepage', 'main', 'landing', 'index'] },
    { link: '/dashboard', title: 'Dashboard', icon: <DashboardIcon />, tags: ['dashboard', 'dash', 'main', 'landing', 'index', 'my dashboard'] },
    { link: '/my-account', title: 'Account', icon: <AccountCircleIcon />, tags: ['account', 'my account', 'profile', 'user', 'user profile', 'username', 'email', 'password', 'change', 'avatar', 'photo'] },
    { link: '/my-settings', title: 'Settings', icon: <SettingsIcon />, tags: ['settings', 'my settings', 'autofill', 'examples', 'meaning', 'practice set', 'number of questions', 'image fit', 'public', 'private', 'priority'] },
    { link: '/my-library', title: 'Library', icon: <PhotoLibraryIcon />, tags: ['images', 'photos', 'my', 'urls', 'illustrations', 'library', 'gallery'] },
    { link: '/my-word-list', title: 'Word List', icon: <BallotIcon />, tags: ['edit', 'delete', 'update', 'word', 'find word', 'my words', 'word list'] }
];

const searchKeys = [
    { name: 'title', weight: 0.8 },
    { name: 'link', weight: 0.5 },
    { name: 'tags', weight: 0.5 }
];

const searchDefault = (value) => {
    const fuse = new Fuse(searchDefaultData, {
        keys: searchKeys
    })

    return fuse.search(value);
}
