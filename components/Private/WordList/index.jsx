import { useState, useEffect, useMemo, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
    Container,
    Grid,
    Typography,
    CircularProgress
} from "@mui/material";

import { Fonts, Colors, Props, SXs } from "@styles";
import { deepExtractObjectStrapi, useWindowSize } from "@utils";

import EditForm from "./EditForm";
import Page from "./EachPage";

import _ from "lodash";

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

    const vips = deepExtractObjectStrapi(userData?.vips, {
        minifyPhoto: ['illustration']
    });

    const pageProps = {
        existingVips, setExistingVips,
        hasNext, setHasNext,
        minimizedGroups, setMinimizedGroups,
        checkedAllGroups, setCheckedAllGroups,
        indeterminateGroups, setIndeterminateGroups,
        sumUpGroups, setSumUpGroups,
        currentWord, setCurrentWord,
        setIsLoading
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

    useEffect(() => {
        if (!changed) {
            setNumOfPages(1);
            setHasNext(0);
            setChanged(true);
        }
    }, [vips, changed]);

    useEffect(() => {

        const debounceSet = _.debounce((isBottom) => {
            if (isBottom && (hasNext > -1) && (hasNext >= numOfPages)) {
                setIsLoading(true);
                setNumOfPages(prev => prev + 1);
            }
        }, 1000);

        const handleScroll = () => {
            // let isBottom = listRef?.current?.scrollHeight - listRef?.current?.scrollTop === listRef?.current?.clientHeight;
            let isBottom = listRef?.current?.getBoundingClientRect().bottom <= windowSizes?.height * 0.85;
            debounceSet(isBottom);
        }
        document.addEventListener('scroll', handleScroll);
        return () => document.removeEventListener('scroll', handleScroll);

    }, [hasNext, numOfPages, windowSizes]);

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

export default WordList;
