import React from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";

import { useTheme } from "@mui/material/styles";

import Image from "next/image";

import { Colors, Fonts } from "@styles";
import { useWindowSize } from "@utils";
import { textAlign } from "@mui/system";

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
    "Just follow the signs to Bradford - it'''s very straightforward",
    "Roz is straightforward and lets you know what she'''s thinking",
    "The doctor explained the operation in straightforward English",
    "She’s a straightforward, no-nonsense teacher",
  ],
  public: true,
  tags: "easy,a piece of cake",
};
export default function WordCard({ open, setOpen, vip }) {
  const windowSize = useWindowSize();
  const theme = useTheme();

  const handleClose = () => {
    setOpen(false);
  };

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
        <DialogContent sx={{ position: "relative", overflowX: "hidden" }}>
          <Box>
            <Box sx={{ ...style.flexCenter, flexDirection: "column" }}>
              <Image
                width={200}
                height={200}
                src={dummyImage}
                alt="something"
              />
              <Box sx={style.flexCenter}>
                <IconButton>
                  <ArrowBackIosIcon sx={{ fontSize: Fonts.FS_16 }} />
                </IconButton>
                <Typography
                  sx={{
                    fontSize: Fonts.FS_18,
                    fontWeight: Fonts.FW_600,
                    mx: 3,
                  }}
                >
                  Lucky
                </Typography>
                <IconButton>
                  <ArrowForwardIosIcon sx={{ fontSize: Fonts.FS_16 }} />
                </IconButton>
              </Box>
              <Typography sx={{ color: Colors.GRAY_5 }}>
                {dummyVip.pronounce}
              </Typography>
              <IconButton>
                <PlayCircleFilledWhiteIcon sx={{ fontSize: Fonts.FS_16 }} />
              </IconButton>
            </Box>

            <Box>
              <Typography sx={style.text}>Example </Typography>
              <Typography
                sx={style.bubbleText}
              >
                {dummyVip.examples[0]}
              </Typography>
            </Box>

            <Box>
              <Typography sx={style.text}>Meanings </Typography>
              <Typography
                sx={style.bubbleText}
              >
                {dummyVip.meanings.vietnamese[0]}
              </Typography>
            </Box>

            <Box sx={{textAlign:'center',mt:3}}>
                <Typography sx={style.text}>Rate this word</Typography>
                <Box>
                    <Button variant="outlined">Not Ok</Button>
                    <Button variant="contained">Ok</Button>
                </Box>
            </Box>
          </Box>

          {/* close button */}
          <IconButton
            sx={{ position: "absolute", top: 0, left: 0 }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogContent>
      </Dialog>
    </div>
  );
}
