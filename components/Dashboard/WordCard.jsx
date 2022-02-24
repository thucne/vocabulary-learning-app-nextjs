import React, { useEffect, useRef, useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";

import { useTheme } from "@mui/material/styles";

import Image from "next/image";

import { Colors, Fonts } from "@styles";
import { useWindowSize } from "@utils";

import { motion } from "framer-motion";

const style = {
  flexCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: Fonts.FS_16,
    fontWeight: Fonts.FW_600,
  },
  bubbleText: {
    color: Colors.BLACK,
    bgcolor: Colors.GRAY_3,
    px: 2,
    py: 1,
    borderRadius: "5px",
  },
};
/**
 * @author KhangDuy
 * @function ReviseWordModal
 **/

const dummyImage =
  "https://res.cloudinary.com/katyperrycbt/image/upload/v1645500815/djztmy2bmxvsywe1l8zx.png";

const dummyVip = {
  vip: "straightforward",
  type1: "vocab",
  type2: [5],
  meanings: {
    english: [
      "easy to understand or simple",
      "(of a person) honest and not likely to hide their opinions",
      "easy to understand; clear",
      "honest and without unnecessary politeness",
    ],
    vietnamese: ["dễ hiểu", "thẳng thắn"],
  },
  pronounce: "/ˌstreɪtˈfɔːr.wɚd/",
  synonyms: ["uncomplicated", "simple", "easy", "painless", "child'''s play"],
  antonyms: ["complicated", "difficult"],
  examples: [
    "Just follow the signs to Bradford - it'''s very straightforward asd asdasd a adadssa",
    "Roz is straightforward and lets you know what she'''s thinking",
    "The doctor explained the operation in straightforward English",
    "She’s a straightforward, no-nonsense teacher",
  ],
  public: true,
  tags: "easy,a piece of cake",
};

const showTypes = {
  ONLY_ONE: "ONLY_ONE",
  ALL: "ALL",
  HIDE: "HIDE",
};

const WordCard = ({ open, setOpen, word }) => {
  const windowSize = useWindowSize();
  const theme = useTheme();
  const audioRef = useRef(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleFowardbutton = () => {};

  const handleBackbutton = () => {};

  const handleNotOkRate = () => {
    console.log("Not Ok");
  };

  const handleOkRate = () => {
    console.log("OK");
  };

  if (!word) return <div></div>;
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullScreen={
          windowSize?.width < theme.breakpoints.values.sm ? true : false
        }
        maxWidth="sm"
      >
        <DialogContent
          sx={{ position: "relative", overflowX: "hidden", width: "565px" }}
        >
          <Box>
            <Box sx={{ ...style.flexCenter, flexDirection: "column" }}>
              <Image
                width={200}
                height={200}
                src={word?.illustration ?? dummyImage}
                alt="something"
              />
              <Box sx={style.flexCenter}>
                <IconButton onClick={handleBackbutton}>
                  <ArrowBackIosIcon sx={{ fontSize: Fonts.FS_16 }} />
                </IconButton>
                <Typography
                  sx={{
                    fontSize: Fonts.FS_18,
                    fontWeight: Fonts.FW_600,
                    mx: 3,
                  }}
                >
                  {word.vip}
                </Typography>
                <IconButton onClick={handleFowardbutton}>
                  <ArrowForwardIosIcon sx={{ fontSize: Fonts.FS_16 }} />
                </IconButton>
              </Box>

              <Typography sx={{ color: Colors.GRAY_5 }}>
                {word.pronounce}
              </Typography>

              {/* Audio  Section*/}
              <IconButton
                  disabled={!word.audio}
                onClick={() => audioRef.current.play()}
              >
                <PlayCircleFilledWhiteIcon sx={{ fontSize: Fonts.FS_16 }} />
              </IconButton>
              <audio ref={audioRef}>
                <source src={word.audio} type="audio/mpeg" />
              </audio>
            </Box>

            {/* Meaningis & example section */}
            <Box>
              <DynamicListContent
                {...listContentProps(word, showTypes.ONLY_ONE).example}
              />
              <DynamicListContent
                {...listContentProps(word, showTypes.HIDE).english}
              />

              <DynamicListContent
                {...listContentProps(word, showTypes.HIDE).vietnamese}
              />
            </Box>

            {/* Rating section */}
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography sx={style.text}>Rate this word</Typography>
              <Box>
                <Button variant="outlined" sx={{ m: 2 }}>
                  Not Ok
                </Button>
                <Button variant="contained" sx={{ m: 2 }}>
                  Ok
                </Button>
              </Box>
            </Box>
          </Box>

          {/* close button */}
          <IconButton
            sx={{ position: "absolute", top: 10, left: 10 }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const DynamicListContent = ({ title, content, defaultShowType }) => {
  const style = {
    bubbleText: {
      color: Colors.BLACK,
      bgcolor: Colors.GRAY_2,
      px: 2,
      py: 1,
      mb: 2,
      borderRadius: "5px",
    },
  };
  const showOrder = [showTypes.HIDE, showTypes.ONLY_ONE];
  const [showType, setShowType] = useState(defaultShowType);

  const handleChangeShowType = () => {
    let index = showOrder.indexOf(showType);
    let tempt = index === showOrder.length - 1 ? 0 : index + 1;
    setShowType(showOrder[tempt]);
  };

  const renderFormType = () => {
    switch (showType) {
      case "ONLY_ONE":
        return <Typography sx={style.bubbleText}>{content[0]}</Typography>;

      case "ALL":
        return (
          <div>
            {content?.map((item, index) => (
              <Typography sx={style.bubbleText} key={index}>
                {item}
              </Typography>
            ))}
          </div>
        );

      case "HIDE":
        return <div></div>;
    }
  };
  if (!content.length) return <div></div>;
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <div>
          <Typography
            sx={{
              fontSize: Fonts.FS_18,
              fontWeight: Fonts.FW_600,
              display: "inline-block",
            }}
          >
            {title}
          </Typography>
        </div>
        {showType === "ONLY_ONE" ? (
          <ArrowDropUpIcon onClick={handleChangeShowType} />
        ) : (
          <ArrowDropDownIcon onClick={handleChangeShowType} />
        )}
      </Box>
      <Box sx={{ maxHeight: "150px", overflowY: "auto", width: "100%" }}>
        {renderFormType()}
      </Box>
    </React.Fragment>
  );
};

const listContentProps = (form, showType) => ({
  vietnamese: {
    title: "Vietnamese Meanings",
    content: form.meanings.vietnamese,
    defaultShowType: showType,
  },
  english: {
    title: "English Meanings",
    content: form.meanings.english,
    defaultShowType: showType,
  },
  example: {
    title: "Example",
    content: form.examples,
    defaultShowType: showType,
  },
});

export default React.memo(WordCard);
