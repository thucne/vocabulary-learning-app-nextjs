import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";

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
import { generateRandomDate, getWordList, gruopWordByDatePeriod } from "@utils";

import DateLabesSection from "./DateLabelsSection";

const WordList = () => {
  const userData = useSelector((state) => state.userData);

  const initWordList = useMemo(() => getWordList(userData), [userData]);

  const [wordList, setWordList] = useState(initWordList);
  const [set, setSet] = useState(0);
  const [endOfList, setEndOfList] = useState(false);

  const listRef = useRef(null);

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
    setWordList(getWordList(userData));
  }, [userData]);

  const handleScroll = () => {
    if (listRef.current.scrollTop === 0) {
      let fetchList = getWordList(userData, set + 1);
      if (fetchList.length === 0) {
        setEndOfList(true);
        return;
      }
      setWordList((state) => [...fetchList, ...state]);
      setSet((state) => state + 1);
    }
  };

  return (
    <Container maxWidth="md">
      <Grid container {...Props.GCRCS}>
        <Grid item xs={12} mt={[5, 5, 3]}>
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

        <Grid item xs={12} mt={[5, 5, 3]}>
          <Grid container {...Props.GCRCC}>
            <Grid
              item
              xs={12}
              {...Props.GIRSC}
              sx={{ width: "100%", height: "500px" }}
            >
              <Box
                ref={listRef}
                onScroll={handleScroll }
                sx={{ width: "100%", height: "100%", overflowY: "auto" }}
              >
         
                {gruopWordByDatePeriod(wordList).map((wordsSection, index) => (
                  <DateLabesSection key={index} dateSegment={wordsSection} />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WordList;
