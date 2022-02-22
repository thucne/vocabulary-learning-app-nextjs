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

import { useTheme } from "@mui/material/styles";

import Image from "next/image";

import { Colors, Fonts } from "@styles";
import { useWindowSize } from "@utils";

const style = {
  flexCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
/**
 * @author KhangDuy
 * @function ReviseWordModal
 **/

const dummyImage =
  "https://res.cloudinary.com/katyperrycbt/image/upload/v1645500815/djztmy2bmxvsywe1l8zx.png";
export default function WordCard({ open, setOpen, vip }) {
  const windowSize = useWindowSize();
  const theme = useTheme();
  
  const handleClose = () => {
    setOpen((state) => ({ ...state, reviseWordModal: false }));
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
      >
        <DialogContent
          sx={{ height: "100vh", width: "100vw", overflowX: "hidden" }}
        >
          <Box>
            <Image width={200} height={200} src={dummyImage} />
            <Box sx={{ ...style.flexCenter, flexDirection: "column" }}>
              <Box sx={style.flexCenter}>
                <IconButton>
                  <ArrowBackIosIcon sx={{ fontSize: Fonts.FS_16 }} />
                </IconButton>
                <Typography
                  sx={{ fontSize: Fonts.FS_18, fontWeight: Fonts.FW_600 }}
                >
                  Lucky
                </Typography>
                <IconButton>
                  <ArrowForwardIosIcon sx={{ fontSize: Fonts.FS_16 }} />
                </IconButton>
              </Box>
              <Typography sx={{ color: Colors.GRAY_5 }}>/Pronouce/</Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
