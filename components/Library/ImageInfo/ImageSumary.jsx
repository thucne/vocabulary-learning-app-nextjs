import React, { useState } from 'react'

import Link from 'next/link'

import Index from "@components/LoadingImage";
import { Divider, Grid, ListItem, Typography, Link as MuiLink, IconButton } from "@mui/material";

import { ContentCopy as ContentCopyIcon } from "@mui/icons-material";

import { Box } from "@mui/system";
import { Fonts, Props } from "@styles";
import * as t from '@consts';
import { shortenLink, formatBytes } from '@utils';

import { useDispatch } from 'react-redux';
import moment from 'moment';

const ImageSumary = (props) => {

    const { illustration, value, index } = props;

    const infoData = [
        ["Name", illustration.name],
        ["Format", illustration.ext],
        ["File size", `${formatBytes(illustration.size * 1024)}`],
        [
            "Dimensions",
            `${illustration.width} x ${illustration.height}`,
            { break: true },
        ],
        ["Uploaded", moment(illustration.updatedAt).format("MMM DD, YYYY hh:mm a")],
        ["Created", moment(illustration.createdAt).format("MMM DD, YYYY hh:mm a"), true],
    ];

    const photo = illustration?.formats?.small?.url || illustration?.formats?.medium?.url || illustration?.formats?.large?.url || illustration.url;

    const dispatch = useDispatch();

    const copyToClipboard = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(illustration.url).then(() => {
            dispatch({ type: t.SHOW_SNACKBAR, payload: { message: "Copied to clipboard", type: "info" } });
        }, () => {
            dispatch({ type: t.SHOW_SNACKBAR, payload: { message: "Failed to copy", type: "warning" } });
        });
    };

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <div style={{ ...styles.image }}>
                        <Index
                            src={photo}
                            layout="fill"
                            objectFit="contain"
                            className="transparentBg"
                            bgColor="transparent"
                        />
                    </div>

                    {infoData.map((info, index) => (
                        <Box key={index}>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={4}>
                                        <Typography sx={{ ...styles.textKey }}>
                                            {info[0]}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={8}>
                                        <Typography sx={{ ...styles.textValue }}>
                                            {info[1]}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            {info[2] && <Divider />}
                        </Box>
                    ))}

                    <Box>
                        <ListItem>
                            <Grid container>
                                <Grid item xs={4}>
                                    <Typography sx={{ ...styles.textKey }}>
                                        URL
                                    </Typography>
                                </Grid>

                                <Grid item xs={8}>
                                    <Link href={illustration.url} passHref>
                                        <MuiLink
                                            target="_blank"
                                            rel={illustration.url}
                                            sx={styles.textValue}
                                            underline="hover"
                                            className="overflowTypography"
                                            title="Link to image"
                                        >
                                            {shortenLink(illustration.url, 10)}
                                        </MuiLink>
                                    </Link>

                                    <IconButton onClick={copyToClipboard}>
                                        <ContentCopyIcon sx={{ fontSize: [Fonts.FS_12, Fonts.FS_14, Fonts.FS_16] }} />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </ListItem>
                    </Box>
                </Box>
            )}
        </div>
    );
};

const styles = ({
    textKey: {
        fontWeight: Fonts.FW_800,
        fontSize: [Fonts.FS_12, Fonts.FS_14, Fonts.FS_16],
    },
    textValue: {
        fontSize: [Fonts.FS_12, Fonts.FS_14, Fonts.FS_16],
    },
    image: {
        position: "relative",
        height: "200px",
        width: "100%",
        marginBottom: "20px",
    },
});

export default React.memo(ImageSumary);
