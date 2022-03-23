import { useState, useEffect, useMemo, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
    Container,
    Grid,
    Button,
    IconButton,
    Typography,
    Paper,
    TextField,
} from "@mui/material";
import { Box } from "@mui/system";

import { Fonts, Colors, Props, SXs } from "@styles";
import { groupByDate, getWordList, gruopWordByDatePeriod, deepExtractObjectStrapi, getInfiniteVips } from "@utils";

import DateLabesSection from "./DateLabelsSection";
import EditForm from "./EditForm";
import EachWord from "./EachWord";
import Page from "./EachPage";

import _ from "lodash";

const WordList = () => {
    const userData = useSelector((state) => state.userData);

    const initWordList = useMemo(() => getWordList(userData), [userData]);

    const [wordList, setWordList] = useState(initWordList);

    // represent times fecth data
    const [set, setSet] = useState(0);
    const [endOfList, setEndOfList] = useState(false);
    const [open, setOpen] = useState(false);
    const [currentWord, setCurrentWord] = useState(null);
    const [checkList, setCheckList] = useState([]);
    const listRef = useRef(null);

    const [numOfPages, setNumOfPages] = useState(0);

    const [existingVips, setExistingVips] = useState([]);
    const [hasNext, setHasNext] = useState(0);
    const [minimizedGroups, setMinimizedGroups] = useState([]);
    const [checkedAllGroups, setCheckedAllGroups] = useState([]);
    const [indeterminateGroups, setIndeterminateGroups] = useState({});
    const [sumUpGroups, setSumUpGroups] = useState([]);

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
    }

    let pages = [];

    for (let i = 0; i < numOfPages; i++) {
        pages.push(<Page
            key={`eachpage-${i}`}
            vips={vips}
            pageNumber={i}
            {...pageProps}
        />)
    }

    useEffect(() => {
        //scroll to bottom
        if (listRef.current.scrollHeight === listRef.current.clientHeight) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        } else {
            listRef.current.scrollTop =
                listRef.current.scrollHeight - listRef.current.clientHeight;
        }
    }, [userData]);

    useEffect(() => {
        const fectchWordList = getWordList(userData);
        setWordList(fectchWordList);

        setCheckList(
            Array.from(Array(fectchWordList.length), function (_, index) {
                return {
                    id: fectchWordList[index].id,
                    checked: false,
                };
            })
        );
    }, [userData]);

    const handleUpdateCheckList = (udList, value) => {
        let tempt = [...checkList];
        tempt.map((element, index) => {
            if (udList.includes(element.id)) {
                tempt[index].checked = value;
            }
        });
        setCheckList([...tempt]);
    };

    const handleCheckSingleBox = (id) => {
        let tempt = [...checkList];
        tempt.map((element, index) => {
            if (element.id === id) {
                tempt[index].checked = !element.checked;
            }
        });
        setCheckList([...tempt]);
    };

    const handleCloseDialog = () => {
        setCurrentWord(null);
        setOpen(false);
    };

    const handleScroll = () => {
        if (listRef.current.scrollBottom === 0) {
            let fetchList = getWordList(userData, set + 1);
            if (fetchList.length === 0) {
                setEndOfList(true);
                return;
            }
            setWordList((state) => [...fetchList, ...state]);
            setCheckList((state) => [
                ...Array.from(Array(fetchList.length), function (_, index) {
                    return {
                        id: fetchList[index].id,
                        checked: false,
                    };
                }),
                ...state,
            ]);
            setSet((state) => state + 1);
        }
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
                    onScroll={handleScroll}
                    {...Props.GICCC}
                >
                    {pages}
                    <Button
                        onClick={() => setNumOfPages(prev => prev + 1)}
                        disabled={!(hasNext > -1)}
                    >
                        Load more
                    </Button>
                </Grid>
            </Grid>

            {currentWord && (
                <EditForm
                    open={open}
                    handleClose={handleCloseDialog}
                    word={currentWord}
                    setCurrentWord={setCurrentWord}
                    setOpen={setOpen}
                />
            )}
        </Container>
    );
};

export default WordList;
