import { Container, Grid, Box, Typography, IconButton } from "@mui/material";
import React, { useRef } from "react";
import { Colors, Fonts } from "@styles";
import CachedIcon from "@mui/icons-material/Cached";
import AddIcon from "@mui/icons-material/Add";
import CreateNewWord from "./CreateNewWord";
/**
 * @author
 * @function
 **/

export default function Welcome(props) {
    const createNewWordModalRef = useRef(null)

  return (
    <React.Fragment>
      <Container maxWidth="lg" >
        <Grid container direction="row">
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              display: "flex",
              justifyContent: "star",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
              }}
            >
              <Typography
                component="h1"
                sx={{
                  fontSize: Fonts.FS_24,
                  p: "16px 0px 0px",
                  fontWeight: Fonts.FW_500,
                }}
              >
                Analytics Dashboard
              </Typography>
              <Typography
                component="p"
                sx={{ fontSize: Fonts.FS_15, p: "8px 0px 0px" }}
              >
                Welcome back, Lucy! We missed you
              </Typography>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: ["star", "end", "", ""],
                padding: "10px 0",
              }}
            >
              <IconButton>
                <CachedIcon sx={{ color: Colors.LOGO_BLUE }} />
              </IconButton>
              <IconButton onClick={createNewWordModalRef.current}>
                <AddIcon sx={{ color: Colors.LOGO_BLUE }} />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <CreateNewWord modalRef={createNewWordModalRef}/>
    </React.Fragment>
  );
}
