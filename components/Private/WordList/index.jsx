import { useState, useEffect, useMemo, useRef, useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
    Container,
    Grid,
    Typography,
    CircularProgress,
    Chip,
    Stack,
    TextField,
    InputAdornment
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { Fonts, Colors, Props, SXs } from "@styles";
import { deepExtractObjectStrapi, useWindowSize, keyify } from "@utils";

import EditForm from "./EditForm";
import Page from "./EachPage";

import _ from "lodash";
import Fuse from 'fuse.js';

const WordList = () => {
    const listRef = useRef(null);
    const windowSizes = useWindowSize();
    const userData = useSelector((state) => state.userData);

    const [currentWord, setCurrentWord] = useState(null);
    const open = Boolean(currentWord);

    const [numOfPages, setNumOfPages] = useState(1);
    const [existingVips, setExistingVips] = useState([]);
    const [hasNext, setHasNext] = useState(0);
    const [minimizedGroups, setMinimizedGroups] = useState([]);
    const [checkedAllGroups, setCheckedAllGroups] = useState([]);
    const [indeterminateGroups, setIndeterminateGroups] = useState({});
    const [sumUpGroups, setSumUpGroups] = useState([]);
    const [changed, setChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [displayMode, setDisplayMode] = useState('time');

    const [searchTerm, setSearchTerm] = useState("");

    const rawVips = deepExtractObjectStrapi(userData?.vips, {
        minifyPhoto: ['illustration']
    });

    const getWordList = useMemo(() => {
        let keys = !_.isEmpty(rawVips) ? keyify(rawVips[0]) : [];
        let fuse = !_.isEmpty(rawVips) ? new Fuse(rawVips, { keys, includeScore: true }) : null;

        let listWord = fuse && !_.isEmpty(searchTerm?.trim()) ? fuse.search(searchTerm).map(each => {
            return {
                ...each.item,
                matched: Math.floor((1 - each.score) * 100),
                matchedLabel: `${Math.floor((1 - each.score) * 100)}%`
            }
        }) : rawVips;

        return listWord;
    }, [rawVips, searchTerm]);

    const vips = getWordList;

    useEffect(() => {
        if (!changed) {
            setNumOfPages(1);
            setHasNext(0);
            setChanged(true);
        }
    }, [vips, changed]);

    useEffect(() => {
        let displayMode = localStorage.getItem("vip-wordlist-displayMode");
        if (displayMode && ['date', 'time'].includes(displayMode)) {
            setDisplayMode(displayMode);
        }
    }, [])

    useEffect(() => {
        setCheckedAllGroups([]);
        setIndeterminateGroups({});
        setSumUpGroups([]);
    }, [displayMode])

    // check nếu trang chưa full thì kéo thêm trang tiếp theo
    useEffect(() => {
        const loop = setInterval(() => {
            let isBottom = listRef?.current?.getBoundingClientRect().bottom <= windowSizes?.height * 1.25;
            if (isBottom && (hasNext > -1) && (hasNext >= numOfPages)) {
                setIsLoading(true);
                setNumOfPages(prev => prev + 1);
            } else {
                clearInterval(loop);
            }
        }, 500);

        return () => clearInterval(loop);
    }, [hasNext, numOfPages, windowSizes]);

    // scroll thì kéo thêm trang mới
    useEffect(() => {

        const debounceSet = _.debounce((isBottom) => {
            if (isBottom && (hasNext > -1) && (hasNext >= numOfPages)) {
                setIsLoading(true);
                setNumOfPages(prev => prev + 1);
            }
        }, 100);

        const handleScroll = () => {
            // render trước một chút
            let isBottom = listRef?.current?.getBoundingClientRect().bottom <= windowSizes?.height * 1.25;
            // debounceSet(isBottom);

            // thử nghiệm ko debounce
            if (isBottom && (hasNext > -1) && (hasNext >= numOfPages)) {
                setIsLoading(true);
                setNumOfPages(prev => prev + 1);
            }
        }
        document.addEventListener('scroll', handleScroll);
        return () => document.removeEventListener('scroll', handleScroll);

    }, [hasNext, numOfPages, windowSizes]);

    const pageProps = {
        existingVips, setExistingVips,
        hasNext, setHasNext,
        minimizedGroups, setMinimizedGroups,
        checkedAllGroups, setCheckedAllGroups,
        indeterminateGroups, setIndeterminateGroups,
        sumUpGroups, setSumUpGroups,
        currentWord, setCurrentWord,
        setIsLoading, displayMode,
        isGroupByFieldValid: !!searchTerm?.trim()?.length,
    }

    let pages = [];

    for (let i = 0; i < numOfPages; i++) {
        pages.push(<Page
            key={`eachpage-${i}`}
            vips={vips}
            pageNumber={i}
            isLastPage={i === numOfPages - 1}
            {...pageProps}
        />)
    }


    const handleCloseDialog = () => {
        setCurrentWord(null);
        setOpen(false);
    };

    return (
        <Container maxWidth="md" disableGutters>
            <Grid container {...Props.GCRCS}>
                <Grid item xs={12} mt={[5, 5, 3]} className="pasdasdasd">
                    <Typography
                        variant="h1"
                        align="center"
                        sx={{ fontSize: Fonts.FS_27, fontWeight: Fonts.FW_400 }}
                    >
                        Word List
                    </Typography>
                    <Typography
                        variant="h2"
                        color="text.secondary"
                        align="center"
                        sx={{ fontSize: Fonts.FS_16, fontWeight: Fonts.FW_400, mt: 2 }}
                    >
                        Search, add, edit and delete words here
                    </Typography>
                </Grid>

                <Grid
                    item
                    xs={12}
                    mt={[5, 5, 3]}
                    ref={listRef}
                    {...Props.GICCC}
                >
                    <Grid container {...Props.GCRBC} px={2}>
                        <Grid item xs={12} sm={6} {...Props.GIRSC} justifyContent={['center', 'flex-start']}>
                            <Stack direction="row" spacing={1}>
                                <Typography>
                                    Group by
                                </Typography>
                                <Chip
                                    label="Time"
                                    variant={displayMode === 'time' ? 'filled' : 'outlined'}
                                    size="small"
                                    onClick={() => {
                                        setDisplayMode('time');
                                        localStorage.setItem('vip-wordlist-displayMode', 'time');
                                    }}
                                    color={displayMode === 'time' ? 'primary' : 'default'}
                                    sx={{ borderRadius: '4px' }}
                                />
                                <Chip
                                    label="Date"
                                    variant={displayMode === 'date' ? 'filled' : 'outlined'}
                                    size="small"
                                    onClick={() => {
                                        setDisplayMode('date');
                                        localStorage.setItem('vip-wordlist-displayMode', 'date');
                                    }}
                                    color={displayMode === 'date' ? 'primary' : 'default'}
                                    sx={{ borderRadius: '4px' }}
                                />
                                {
                                    !!searchTerm?.trim()?.length && <Chip
                                        label="Matched"
                                        variant={displayMode === 'matched' ? 'filled' : 'outlined'}
                                        size="small"
                                        onClick={() => {
                                            setDisplayMode('matched');
                                            localStorage.setItem('vip-wordlist-displayMode', 'matched');
                                        }}
                                        color={displayMode === 'matched' ? 'primary' : 'default'}
                                        sx={{ borderRadius: '4px' }}
                                    />
                                }
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} {...Props.GIREC} mt={[2, 0]} justifyContent={['center', 'flex-end']}>
                            <SearchWord
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                            />
                        </Grid>
                    </Grid>
                    {pages}
                    {
                        isLoading && <CircularProgress />
                    }
                </Grid>
            </Grid>

            {currentWord && (
                <EditForm
                    open={open}
                    handleClose={handleCloseDialog}
                    word={currentWord}
                    setCurrentWord={setCurrentWord}
                />
            )}
        </Container>
    );
};

const SearchWord = ({ searchTerm, setSearchTerm }) => {
    // const wordList = useMemo(() => _.unionWith(wordListRaw, subscribedWordListRaw, _.isEqual), [wordListRaw, subscribedWordListRaw]);

    const handleSearch = useMemo(() => _.debounce((e) => {
        searchWord(e?.target?.value);
    }, 250), [searchWord])

    const searchWord = useCallback((searchTerm) => {
        setSearchTerm(searchTerm);
    }, [setSearchTerm]);

    return (
        <TextField
            type="text"
            size="small"
            placeholder="Word, tag, etc."
            label="Search"
            sx={{ width: ['90%', 'auto'] }}
            onChange={handleSearch}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
        />
    )
}

export default WordList;
