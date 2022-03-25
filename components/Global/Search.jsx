import React, { useState, useEffect, useRef, useMemo } from 'react';

import Router from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

import {
    Paper, InputBase, IconButton,
    MenuItem, Grid,
    Link as MuiLink,
    Typography, MenuList,
    Dialog,
} from '@mui/material';

import {
    Search as SearchIcon,
    Home as HomeIcon,
    Dashboard as DashboardIcon,
    AccountCircle as AccountCircleIcon,
    Settings as SettingsIcon,
    PhotoLibrary as PhotoLibraryIcon,
    Ballot as BallotIcon,
    Article as ArticleIcon,
    ToggleOff as ToggleOffIcon,
    ArrowForwardIos as ArrowForwardIosIcon,
    SearchOffRounded as SearchOffRoundedIcon,
    KeyboardReturnRounded as KeyboardReturnRoundedIcon,
    QuestionMarkRounded as QuestionMarkRoundedIcon,
} from '@mui/icons-material';

import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PasswordIcon from '@mui/icons-material/Password';
import PolicyIcon from '@mui/icons-material/Policy';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';

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
    const [forcedClose, setForcedClose] = useState(true);
    const [hoveredItem, setHoveredItem] = useState(null);

    const inputRef = useRef(null);
    const dispatch = useDispatch();
    const wordFirstResultRef = useRef(null);
    const directoryFirstResultRef = useRef(null);
    const noExactMatchRef = useRef(null);

    const actualSearchString = searchString?.replace(/(w:|W:)/, "")?.replace(/(d:|D:)/, "");
    const isDirectorySearch = /^(d:|D:)/.test(searchString);
    const isWordSearch = /^(w:|W:)/.test(searchString);

    const queryString = qs.stringify({
        max: 10,
    }, { encodeValuesOnly: true });

    const { data, isValidating } = useSWR(!!actualSearchString?.trim()?.length
        ? `${API}/api/fuzzy-search/${actualSearchString}?${queryString}`
        : null,
        fetcher,
        {
            onSuccess: () => setLoading(false)
        });

    const wordResults = useMemo(() =>
        handleFuzzyResults(_.isArray(data?.data) && !_.isEmpty(data?.data) ? data.data : [])
            ?.slice(0, 5),
        [data]);

    useEffect(() => {
        if (!forcedClose && !!searchString?.trim()?.length) {
            dispatch({ type: t.BLUR_SCREEN });
        } else {
            dispatch({ type: t.UNBLUR_SCREEN });
        }
    }, [forcedClose, searchString, dispatch]);

    useEffect(() => {

        const handler = (event) => {
            let wordFirstResult = wordFirstResultRef?.current;
            let directoryFirstResult = directoryFirstResultRef?.current;
            let noExactMatch = noExactMatchRef?.current;

            if (event.ctrlKey && event.key === 'k') {
                event?.preventDefault();
                setForcedClose(false);
                inputRef?.current?.focus();
                if (localStorage.getItem('vip-search-prefix') && inputRef?.current) {
                    inputRef.current.value = `${localStorage.getItem('vip-search-prefix')}`;
                    setSearchString(`${localStorage.getItem('vip-search-prefix')}`);
                }
            }
            if (event.key === 'Escape') {
                setForcedClose(true);
            }
            if (event.key === 'Enter') {
                if (hoveredItem) {
                    Router.push(hoveredItem);
                } else if (noExactMatch) {
                    noExactMatch.click();
                } else if (wordFirstResult && directoryFirstResult) {
                    wordFirstResult.click();
                } else if (wordFirstResult) {
                    wordFirstResult.click();
                } else {
                    directoryFirstResult?.click();
                }
            }
        }

        document.addEventListener('keydown', handler);

        return () => document.removeEventListener('keydown', handler);
    }, [hoveredItem]);

    useEffect(() => {
        if (mobile === true && open) {
            openSearch();
        }
    }, [mobile, open]);

    const debounceSearch = useMemo(() => _.debounce((e) => {
        setSearchString(e.target.value);
        setTimeout(() => {
            if (inputRef?.current) {
                if (isDirectorySearch) {
                    localStorage.setItem('vip-search-prefix', 'd:');
                } else if (isWordSearch) {
                    localStorage.setItem('vip-search-prefix', 'w:');
                } else {
                    localStorage.removeItem('vip-search-prefix');
                }
            }
        }, 200);
    }, 500), [isDirectorySearch, isWordSearch]);

    const handleSearch = (e) => {
        e?.preventDefault();
        const result = searchDefault(e.target.value);
        setResults(result);
        debounceSearch(e);
    }

    const openSearch = (e) => {
        e?.preventDefault();
        setForcedClose(false);
        setTimeout(() => {
            inputRef?.current?.focus();
            if (localStorage.getItem('vip-search-prefix') && inputRef?.current) {
                inputRef.current.value = `${localStorage.getItem('vip-search-prefix')}`;
                setSearchString(`${localStorage.getItem('vip-search-prefix')}`);
            }
        }, 100);
    }

    const isThereExactMatch = useMemo(() => wordResults?.map(item => deepExtractObjectStrapi(item.item)).findIndex(item => item.vip === actualSearchString) > -1, [wordResults, actualSearchString]);

    return (
        <Paper
            sx={{
                px: 1, py: '2px',
                display: open ? 'flex' : 'none',
                alignItems: 'center',
                mx: 1, mb: mobile ? 1 : 0,
                borderRadius: '10px',
                position: 'relative',
                bgcolor: theme => theme.palette.mode === 'dark' && 'transparent'
            }}
            variant="outlined"
            id="demo-customized-button"
        >
            <IconButton aria-label="search" size="small" disableRipple onClick={openSearch}>
                <SearchIcon />
            </IconButton>
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search..."
                inputProps={{ 'aria-label': 'Search' }}
                value={searchString}
                onClick={openSearch}
            />
            <Typography variant="caption" sx={{
                px: 1,
                borderRadius: '4px',
                backgroundColor: Colors.GREY_400,
                color: Colors.WHITE,
                fontWeight: Fonts.FW_600,
                cursor: 'pointer',
                display: mobile ? 'none' : 'flex',
            }} onClick={openSearch}>
                Ctrl + K
            </Typography>

            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: !forcedClose ? 'flex' : 'none',
                zIndex: 1,
                backdropFilter: 'blur(4px)',
                transition: 'opacity 100ms ease 0s',
            }} />

            <Dialog
                open={!forcedClose}
                onClose={() => setForcedClose(true)}
                scroll='paper'
                fullWidth
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '10px',
                    }
                }}
            >
                <Grid container {...Props.GCRSC} p={2} sx={{
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                }}>
                    <IconButton aria-label="search" size="small" disableRipple onClick={openSearch}>
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search..."
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
                    }} onClick={openSearch}>
                        ESC
                    </Typography>
                </Grid>

                <div style={{
                    width: '100%',
                    maxWidth: 700,
                    maxHeight: 600,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    paddingBottom: '0px !important'
                }}>
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
                            !!!actualSearchString?.trim()?.length && <NoSearchString />
                        }
                        {
                            !!!wordResults.length && !!!results.length && !!actualSearchString?.trim()?.length && <Grid item xs={12} {...Props.GICCC} py={2} px={5}>
                                <SearchOffRoundedIcon sx={{ fontSize: Fonts.FS_60 }} />
                                <Typography variant="body1" sx={{ p: 1.5 }} className='overflowTypography' align='center'>
                                    No results for &quot;{actualSearchString}&quot;
                                </Typography>
                            </Grid>
                        }
                        {
                            (!!wordResults?.length && !isDirectorySearch) && <Grid item xs={12} {...Props.GIRBC} sx={{ pt: 1, px: 3 }}>
                                <Typography variant="h6">
                                    Word
                                </Typography>
                                {
                                    !isWordSearch && <Typography
                                        variant="caption" sx={{
                                            backgroundColor: Colors.LOGO_BLUE,
                                            color: Colors.WHITE,
                                            px: 1, borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => {
                                            const oldValue = inputRef?.current?.value;
                                            inputRef.current.value = `w:${oldValue}`;
                                            let temp = {
                                                target: {
                                                    value: `w:${oldValue}`
                                                }
                                            }
                                            debounceSearch(temp);
                                            localStorage.setItem('vip-search-prefix', 'w:');
                                        }}
                                    >
                                        Start with &quot;w:&quot; for words only
                                    </Typography>
                                }
                            </Grid>
                        }
                        {(!!wordResults?.length && !isDirectorySearch) && <MenuList sx={{ width: '100%', px: 1 }}>
                            {
                                !isThereExactMatch && <MenuItem
                                    aria-label={`/word/${actualSearchString}`}
                                    onClick={() => Router.push(`/word/${actualSearchString}`)}
                                    sx={{
                                        width: '100%',
                                        borderRadius: '4px',
                                        border: `1px solid transparent`,
                                        borderBottomColor: theme => theme.palette.borderSearch.main,
                                        ':focus, :active, :hover': {
                                            border: `1px solid ${Colors.SEARCH_RESULT} !important`,
                                            color: Colors.SEARCH_RESULT,
                                            '& .enter-icon-search': {
                                                opacity: 1
                                            }
                                        },
                                        py: 1,
                                        '& .enter-icon-search': {
                                            opacity: 0
                                        }
                                    }}
                                    onMouseOver={() => setHoveredItem(`/word/${actualSearchString}`)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    ref={noExactMatchRef}
                                >
                                    <KeyboardReturnRoundedIcon
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            right: '16px',
                                            transform: 'translateY(-50%)',
                                            width: 22,
                                            height: 22,
                                        }}
                                        className="enter-icon-search"
                                    />
                                    <Link href={`/word/${actualSearchString}`} passHref>
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
                                            <QuestionMarkRoundedIcon />
                                            <Grid container {...Props.GCCXS} sx={{
                                                position: 'relative',
                                                maxWidth: '100%',
                                                overflow: 'hidden',
                                            }}>
                                                <Grid item xs={12} {...Props.GIRBC}>
                                                    <Typography className='overflowTypography'>
                                                        No exact match for &quot;{actualSearchString}&quot;.
                                                        Go to page of this word instead?
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </MuiLink>
                                    </Link>
                                </MenuItem>
                            }
                            {
                                wordResults?.map((result, index) => {
                                    const handledData = deepExtractObjectStrapi(result?.item, { minifyPhoto: ['illustration'] });
                                    const displayData = fuzzyWordToSearchData({ ...handledData, hightlight: result?.highlight });
                                    const matchedPercentage = result?.matchedPercentage;

                                    return <MenuItem
                                        key={`-word-results-${index}-search-bar`}
                                        aria-label={displayData?.link}
                                        onClick={() => displayData?.link && Router.push(displayData.link)}
                                        sx={{
                                            width: '100%',
                                            borderRadius: '4px',
                                            border: `1px solid transparent`,
                                            borderBottomColor: theme => theme.palette.borderSearch.main,
                                            ':focus, :active, :hover': {
                                                border: `1px solid ${Colors.SEARCH_RESULT}`,
                                                color: Colors.SEARCH_RESULT,
                                                '& .enter-icon-search': {
                                                    opacity: 1
                                                }
                                            },
                                            py: 1,
                                            '& .enter-icon-search': {
                                                opacity: 0
                                            }
                                        }}
                                        onMouseOver={() => setHoveredItem(displayData?.link)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                        ref={index === 0 ? wordFirstResultRef : null}
                                    >
                                        <KeyboardReturnRoundedIcon
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                right: '16px',
                                                transform: 'translateY(-50%)',
                                                width: 22,
                                                height: 22,
                                            }}
                                            className="enter-icon-search"
                                        />
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
                                                    <Grid item xs={12} {...Props.GIRBC}>
                                                        <Typography className='overflowTypography'>
                                                            {parser(displayData?.title?.replace(new RegExp(`(${actualSearchString.replace(/[^a-zA-Z ]/g, "")})`, 'gi'), `<u style="color: ${Colors.SEARCH_RESULT}">$1</u>`))}
                                                        </Typography>
                                                        <Typography variant='caption' className='overflowTypography'>
                                                            [{matchedPercentage} matched]
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
                        }
                        {
                            (!!results?.length && !isWordSearch) && <Grid item xs={12} {...Props.GIRBC} sx={{ pt: 1, px: 3 }}>
                                <Typography variant="h6">
                                    Directory
                                </Typography>
                                {
                                    !isDirectorySearch && <Typography
                                        variant="caption" sx={{
                                            backgroundColor: Colors.LOGO_BLUE,
                                            color: Colors.WHITE,
                                            px: 1, borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => {
                                            const oldValue = inputRef?.current?.value;
                                            inputRef.current.value = `d:${oldValue}`;
                                            let temp = {
                                                target: {
                                                    value: `d:${oldValue}`
                                                }
                                            }
                                            debounceSearch(temp);
                                            localStorage.setItem('vip-search-prefix', 'd:');
                                        }}
                                    >
                                        Start with &quot;d:&quot; for directory only
                                    </Typography>
                                }
                            </Grid>
                        }
                        {(!!results?.length && !isWordSearch) && <MenuList sx={{ width: '100%', px: 1 }}>
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
                                            borderBottomColor: theme => theme.palette.borderSearch.main,
                                            ':focus, :active, :hover': {
                                                border: `1px solid ${Colors.SEARCH_RESULT} !important`,
                                                color: Colors.SEARCH_RESULT,
                                                '& .enter-icon-search': {
                                                    opacity: 1
                                                }
                                            },
                                            py: 1,
                                            '& .enter-icon-search': {
                                                opacity: 0
                                            }
                                        }}
                                        onMouseOver={() => setHoveredItem(result?.item?.link)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                        onFocus={() => console.log('focus')}
                                        ref={index === 0 ? directoryFirstResultRef : null}
                                    >
                                        <KeyboardReturnRoundedIcon
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                right: '16px',
                                                transform: 'translateY(-50%)',
                                                width: 22,
                                                height: 22,
                                            }}
                                            className='enter-icon-search'
                                        />
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
                        }
                    </Grid>
                </div>

                <Grid container {...Props.GCRBC} py={1} px={2} sx={{
                    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                }}>
                    <Typography variant="caption" sx={{
                        display: 'flex',
                        alignItems: 'center',
                        px: 1,
                        backgroundColor: (isWordSearch || isDirectorySearch) ? Colors.LOGO_BLUE : 'transparent',
                        color: (isWordSearch || isDirectorySearch) ? Colors.WHITE : 'inherit',
                        borderRadius: '4px',
                    }} className='overflowTypography'>
                        {
                            isValidating ? 'Searching...' : (
                                isWordSearch ? 'Word Search' : (
                                    isDirectorySearch ? 'Directory Search' : ''
                                )
                            )
                        }
                    </Typography>

                    <Typography variant="caption" sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }} className='overflowTypography'>
                        Search by&nbsp;
                        <Link href="https://www.trantrongthuc.com" passHref>
                            <MuiLink underline='none'>
                                <Image
                                    src={
                                        typeof window !== "undefined" &&
                                            (localStorage?.getItem("colorMode") || "light") === "dark" ?
                                            'https://res.cloudinary.com/katyperrycbt/image/upload/v1647778049/Add_a_heading_2_1_qvwh9n.png' :
                                            'https://res.cloudinary.com/katyperrycbt/image/upload/v1647777566/Add_a_heading_1_1_rdhdny.png'}
                                    width={105}
                                    height={30}
                                    alt='Tallis'
                                    objectFit='contain'
                                    quality={100}
                                />
                            </MuiLink>
                        </Link>
                    </Typography>
                </Grid>
            </Dialog>
        </Paper >
    );
}

const NoSearchString = () => {
    return (
        <Grid container {...Props.GCRCS} p={2} pb={2}>
            <Grid item xs={12} sm={6} {...Props.GICCC} p={1} mt={1}>
                <Grid container {...Props.GCRSS}>
                    <Grid item>
                        <ArticleIcon sx={{ mr: 1, mt: '2px' }} fontSize="small" />
                    </Grid>
                    <Grid item {...Props.GICCS}>
                        <Typography>
                            Getting started
                        </Typography>
                        {
                            links.gettingStarted.map((link, index) => (
                                <Link href={link.link} passHref key={`getting-started-${index}`}>
                                    <MuiLink underline="hover" sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '100%',
                                        height: '100%',
                                        fontWeight: Fonts.FW_500,
                                        mt: 1,
                                        ':hover': {
                                            '& .MuiSvgIcon-root': {
                                                // fontSize: 18,
                                                transition: 'all 0.1s ease-in-out',
                                                marginLeft: theme => theme.spacing(1),
                                            },
                                        }
                                    }} className="overflowTypography">
                                        {link.label} <ArrowForwardIosIcon sx={{
                                            width: '16px',
                                            height: '16px',
                                            pt: 0.6,
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                        }} />
                                    </MuiLink>
                                </Link>
                            ))
                        }
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={6} {...Props.GICCC} p={1} mt={1}>
                <Grid container {...Props.GCRSS}>
                    <Grid item>
                        <AccountCircleIcon sx={{ mr: 1, mt: '2px' }} fontSize="small" />
                    </Grid>
                    <Grid item {...Props.GICCS}>
                        <Typography>
                            Account
                        </Typography>
                        {
                            links.account.map((link, index) => (
                                <Link href={link.link} passHref key={`gAccount-${index}`}>
                                    <MuiLink underline="hover" sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '100%',
                                        height: '100%',
                                        fontWeight: Fonts.FW_500,
                                        mt: 1,
                                        ':hover': {
                                            '& .MuiSvgIcon-root': {
                                                // fontSize: 18,
                                                transition: 'all 0.1s ease-in-out',
                                                marginLeft: theme => theme.spacing(1),
                                            },
                                        }
                                    }} className="overflowTypography">
                                        {link.label} <ArrowForwardIosIcon sx={{
                                            width: '16px',
                                            height: '16px',
                                            pt: 0.6,
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                        }} />
                                    </MuiLink>
                                </Link>
                            ))
                        }
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={6} {...Props.GICCC} p={1} mt={1}>
                <Grid container {...Props.GCRSS}>
                    <Grid item>
                        <SettingsIcon sx={{ mr: 1, mt: '2px' }} fontSize="small" />
                    </Grid>
                    <Grid item {...Props.GICCS}>
                        <Typography>
                            Settings
                        </Typography>
                        {
                            links.settings.map((link, index) => (
                                <Link href={link.link} passHref key={`sSettings-${index}`}>
                                    <MuiLink underline="hover" sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '100%',
                                        height: '100%',
                                        fontWeight: Fonts.FW_500,
                                        mt: 1,
                                        ':hover': {
                                            '& .MuiSvgIcon-root': {
                                                // fontSize: 18,
                                                transition: 'all 0.1s ease-in-out',
                                                marginLeft: theme => theme.spacing(1),
                                            },
                                        }
                                    }} className="overflowTypography">
                                        {link.label} <ArrowForwardIosIcon sx={{
                                            width: '16px',
                                            height: '16px',
                                            pt: 0.6,
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                        }} />
                                    </MuiLink>
                                </Link>
                            ))
                        }
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={6} {...Props.GICCC} p={1} mt={1}>
                <Grid container {...Props.GCRSS}>
                    <Grid item>
                        <ToggleOffIcon sx={{ mr: 1, mt: '2px' }} fontSize="small" />
                    </Grid>
                    <Grid item {...Props.GICCS}>
                        <Typography>
                            And more
                        </Typography>
                        {
                            links.more.map((link, index) => (
                                <Link href={link.link} passHref key={`more-${index}`}>
                                    <MuiLink underline="hover" sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '100%',
                                        height: '100%',
                                        fontWeight: Fonts.FW_500,
                                        mt: 1,
                                        ':hover': {
                                            '& .MuiSvgIcon-root': {
                                                // fontSize: 18,
                                                transition: 'all 0.1s ease-in-out',
                                                marginLeft: theme => theme.spacing(1),
                                            },
                                        }
                                    }} className="overflowTypography">
                                        {link.label} <ArrowForwardIosIcon sx={{
                                            width: '16px',
                                            height: '16px',
                                            pt: 0.6,
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                        }} />
                                    </MuiLink>
                                </Link>
                            ))
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}


const links = {
    gettingStarted: [
        { label: 'How to get started', link: '/getting-started' },
        { label: 'Documentation', link: '/documentation' },
    ],
    account: [
        { label: 'Account', link: '/my-account' },
        { label: 'Log in', link: '/login' },
        { label: 'Sign Up', link: '/signup' },
    ],
    settings: [
        { label: 'Settings', link: '/my-settings' },
    ],
    more: [
        { label: 'About', link: '/about' },
        { label: 'Contact', link: '/contact' },
        { label: 'Privacy Policy', link: '/privacy-policy' },
        { label: 'Terms of Service', link: '/terms-of-service' },
    ]
}


const searchDefaultData = [
    { link: '/', title: 'Home', icon: <HomeIcon />, tags: ['home', 'homepage', 'main', 'landing', 'index'] },
    { link: '/dashboard', title: 'Dashboard', icon: <DashboardIcon />, tags: ['dashboard', 'dash', 'main', 'landing', 'index', 'my dashboard'] },
    { link: '/my-account', title: 'Account', icon: <AccountCircleIcon />, tags: ['account', 'my account', 'profile', 'user', 'user profile', 'username', 'email', 'password', 'change', 'avatar', 'photo'] },
    { link: '/my-settings', title: 'Settings', icon: <SettingsIcon />, tags: ['settings', 'my settings', 'autofill', 'examples', 'meaning', 'practice set', 'number of questions', 'image fit', 'public', 'private', 'priority'] },
    { link: '/my-library', title: 'Library', icon: <PhotoLibraryIcon />, tags: ['images', 'photos', 'my', 'urls', 'illustrations', 'library', 'gallery'] },
    { link: '/my-word-list', title: 'Word List', icon: <BallotIcon />, tags: ['edit', 'delete', 'update', 'word', 'find word', 'my words', 'word list'] },
    { link: '/login', title: 'Log in', icon: <LoginIcon />, tags: ['login', 'signin', 'signup', 'account', 'user', 'auth'] },
    { link: '/signup', title: 'Sign up', icon: <VpnKeyRoundedIcon />, tags: ['signup', 'register', 'account', 'user', 'auth', 'create account'] },
    { link: '/forgot-password', title: 'Forgot password', icon: <VpnKeyRoundedIcon />, tags: ['forgot password', 'reset password', 'account', 'user', 'auth', 'reset password'] },
    { link: '/my-account', title: 'Change password', icon: <PasswordIcon />, tags: ['change password', 'update password'] },
    { link: '/privacy-policy', title: 'Privacy Policy', icon: <PolicyIcon />, tags: ['privacy policy', 'terms of service', 'terms', 'service', 'policy'] },
    { link: '/terms-of-service', title: 'Terms of Service', icon: <DensityMediumIcon />, tags: ['terms of service', 'terms', 'service', 'policy'] },

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

    return fuse.search(value?.replace(/(w:|W:)/, "")?.replace(/(d:|D:)/, ""));
}

