import React, { useEffect, useState } from "react";

import {
    Container,
    Grid,
    Box,
    Typography,
    IconButton,
    Button,
} from "@mui/material";

import CachedIcon from "@mui/icons-material/Cached";

import WordCard from "@components/PracticeSet";
import { getLastReviewWord, useSettings } from "@utils";
import { Colors, Fonts, SXs } from "@styles";

import { useSelector } from "react-redux";

const Welcome = () => {
    const [openReviseWordModal, setOpenReviseWordModal] = useState(false);

    const userData = useSelector((state) => state.userData);
    const settings = useSettings(userData);

    const reviewList = userData?.vips ? getLastReviewWord([...userData.vips]) : []

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
                            Welcome back, {userData?.name}! We missed you 👋
                        </Typography>
                        <Typography
                            component="p"
                            sx={{ fontSize: Fonts.FS_15, p: "8px 0px 0px" }}
                        >
                            It look like you haven&apos;t been revised your words today.
                            <Button
                                disabled={!reviewList?.length}
                                onClick={() => setOpenReviseWordModal(true)}
                                sx={{
                                    ...SXs.COMMON_BUTTON_STYLES,
                                    ml: 1
                                }}
                            >
                                Let&apos;s check it out!
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
                        <IconButton sx={SXs.MUI_NAV_ICON_BUTTON} onClick={() => { }}>
                            <CachedIcon sx={{ color: Colors.LOGO_BLUE }} />
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>
            {reviewList?.length > 0 && (
                <WordCard
                    open={openReviseWordModal}
                    setOpen={setOpenReviseWordModal}
                    wordList={reviewList}

                />
            )}
        </Container>
    );
};

export default React.memo(Welcome);
