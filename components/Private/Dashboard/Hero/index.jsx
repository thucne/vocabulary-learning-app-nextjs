import React, { useState } from "react";

import {
    Container,
    Grid,
    Box,
    Typography,
    IconButton,
    Button,
} from "@mui/material";

import CachedIcon from "@mui/icons-material/Cached";

import { useSelector } from "react-redux";

import WordCard from "@components/PracticeSet";
import { Colors, Fonts, SXs } from "@styles";
import { useSettings, checkPractiseStatus } from '@utils';

const Welcome = () => {
    const [openReviseWordModal, setOpenReviseWordModal] = useState(false);

    const userData = useSelector((state) => state.userData);
    const settings = useSettings(userData);
    const status = checkPractiseStatus(userData);
    const { practicesPerDay = 1 } = settings;

    const wordList = userData?.vips ? userData.vips : [];

    const getText = () => {
        if (wordList.length === 0) {
            return "No words to practice, please add some words.";
        } else if (status === practicesPerDay) {
            return `You have completed practices today. Wanna practice again? YES, why not?!`;
        } else if (status === 0) {
            return `It seems you haven't practiced today. Let's get started!`;
        } else if (status > 0 && status < practicesPerDay) {
            return `Well-done! You have completed ${status} practices today. Keep up the good work!`;
        } else if (status > practicesPerDay) {
            return `You have completed ${practicesPerDay} practices today, more than the times you set. Wonderful!`;
        } else {
            return "Let's practice today!";
        }
    }

    return (
        <Container maxWidth="lg" disableGutters>
            <Grid container direction="row" mt={[0, 1, 2, 3]}>
                <Grid
                    item
                    xs={12}
                    sm={9}
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
                            {getText()}&nbsp;&nbsp;&nbsp;
                            <Button
                                disabled={!wordList?.length}
                                onClick={() => setOpenReviseWordModal(true)}
                                sx={{
                                    ...SXs.MUI_NAV_BUTTON,
                                }}
                            >
                                Practice now
                            </Button>
                        </Typography>
                    </Box>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={3}
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
            {
                wordList?.length > 0 && (
                    <WordCard
                        open={openReviseWordModal}
                        setOpen={setOpenReviseWordModal}
                        wordList={wordList}
                        settings={settings}
                    />
                )
            }
        </Container>
    );
};

export default React.memo(Welcome);
