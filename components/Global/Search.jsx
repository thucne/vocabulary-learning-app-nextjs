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

const fetcher = async (...args) => await fetcherJWTIfAny(...args);

export default function CustomizedInputBase({ open = true, mobile = false }) {
    const [results, setResults] = useState([]);
    const [searchString, setSearchString] = useState('');
    const [forcedClose, setForcedClose] = useState(false);

    const paperRef = useRef(null);
    const inputRef = useRef(null);
    const resultsRef = useRef(null);
    const eachResultRef = useRef([]);

    const queryString = qs.stringify({
        max: 10,
    }, { encodeValuesOnly: true });

    const { data } = useSWR(searchString ? `${API}/api/fuzzy-search/${searchString}?${queryString}` : null, fetcher, {
        onSuccess: () => setLoading(false)
    });

    const wordResults = useMemo(() => handleFuzzyResults(_.isArray(data?.data) && !_.isEmpty(data?.data) ? data.data : []), [data]);

    const { bottom, left } = useThisToGetPositionFromRef(paperRef, {
        revalidate: 100,
        terminalCondition: ({ width }) => width > 0,
        falseCondition: ({ width }) => width === 0,
    });

    useEffect(() => eachResultRef.current = eachResultRef.current.slice(0, results.length), [results.length]);

    useEffect(() => {
        let currentInput = inputRef?.current;

        const handler = (event) => {
            if (event.ctrlKey && event.key === 'k') {
                event?.preventDefault();
                currentInput?.focus();
                setForcedClose(false);
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
            sx={{ px: 1, py: '2px', display: open ? 'flex' : 'none', alignItems: 'center', mx: 1, mb: mobile ? 1 : 0, borderRadius: '10px' }}
            variant="outlined"
            id="demo-customized-button"
            ref={paperRef}
        >
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
            }} onClick={() => inputRef?.current?.focus()}>
                Ctrl + K
            </Typography>
            <Paper variant='outlined' sx={{
                position: 'fixed',
                top: bottom + 5,
                left: left,
                display: !!results.length && !forcedClose ? 'flex' : 'none',
                width: `calc(100% - ${left * 2}px)`,
                maxWidth: 500,
                minWidth: 300,
                borderRadius: '10px',
                maxHeight: `calc(100vh - ${bottom + 35}px)`,
                overflowY: 'auto',
                overflowX: 'hidden',
            }} ref={resultsRef}>
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
                        !!wordResults?.length && <Typography variant="caption" sx={{ pt: 1, px: 1.5 }}>
                            Word
                        </Typography>
                    }
                    <MenuList sx={{ width: '100%', px: 1 }}>
                        {
                            wordResults?.slice(0, 5)?.map((result, index) => {
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
                    <MenuList sx={{ width: '100%', px: 1 }}>
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
