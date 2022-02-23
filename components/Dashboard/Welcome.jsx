import React, { useEffect, useState } from "react";

import {
  Container,
  Grid,
  Box,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { Colors, Fonts } from "@styles";
import CachedIcon from "@mui/icons-material/Cached";
import AddIcon from "@mui/icons-material/Add";

import CreateNewWord from "./CreateNewWord";
import { useSelector } from "react-redux";
import WordCard from "./WordCard";

const Welcome = (props) => {
  const [openNewWordForm, setOpenNewWordForm] = useState(false);
  const [openReviseWordModal, setOpenReviseWordModal] = useState(false);

  const User = useSelector((state) => state.userData);


  return (
    <Container maxWidth="lg" disableGutters>
      <Grid container direction="row" mt={[0, 1, 2, 3]}>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Typography
              component="h1"
              sx={{
                fontSize: Fonts.FS_24,
                p: "16px 0px 0px",
                fontWeight: Fonts.FW_500,
              }}
            >
              Welcome back, Lucy! We missed you 👋 {User?.name}
            </Typography>
            <Typography
              component="p"
              sx={{ fontSize: Fonts.FS_15, p: "8px 0px 0px" }}
            >
              It look like you haven&#96;t been revised your words today.{" "}
              <Button onClick={() => setOpenReviseWordModal(true)}>
                Let&#96;s check it out!
              </Button>
            </Typography>
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: ["flex-start", "flex-end"],
              padding: "10px 0",
            }}
          >
            <IconButton>
              <CachedIcon sx={{ color: Colors.LOGO_BLUE }} />
            </IconButton>
            <IconButton onClick={() => setOpenNewWordForm(true)}>
              <AddIcon sx={{ color: Colors.LOGO_BLUE }} />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      <CreateNewWord open={openNewWordForm} setOpen={setOpenNewWordForm} />
      <WordCard open={openReviseWordModal} setOpen={setOpenReviseWordModal} />
    </Container>
  );
};

export default React.memo(Welcome);
