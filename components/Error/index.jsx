import { motion } from "framer-motion";
import Link from "next/link";
// material
import { styled } from "@mui/system";
import { Box, Button, Typography, Container } from "@mui/material";
// components
import { MotionContainer, varBounceIn } from "./animate";
import Page from "./Page";

import { SXs } from '@styles';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
    display: "flex",
    minHeight: "100%",
    alignItems: "center",
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

export default function PageError({
    title,
    errorMessage,
    message,
    illustration,
    redirectTo,
}) {
    return (
        <RootStyle title={title}>
            <Container className="noselect">
                <MotionContainer initial="initial" open>
                    <Box sx={{ maxWidth: 480, margin: "auto", textAlign: "center" }}>
                        <motion.div variants={varBounceIn}>
                            <Typography variant="h3" paragraph>
                                {errorMessage}
                            </Typography>
                        </motion.div>

                        <motion.div variants={varBounceIn}>
                            <Typography sx={{ color: "text.secondary" }}>
                                {message}
                            </Typography>
                        </motion.div>

                        <motion.div variants={varBounceIn}>
                            <Box
                                component="img"
                                src={illustration}
                                sx={{ height: 260, mx: "auto", my: { xs: 5, sm: 5 } }}
                            />
                        </motion.div>

                        <Link href={redirectTo.link} passHref>
                            <Button variant="outlined" sx={SXs.COMMON_BUTTON_STYLES}>{redirectTo.title}</Button>
                        </Link>
                    </Box>
                </MotionContainer>
            </Container>
        </RootStyle>
    );
}
