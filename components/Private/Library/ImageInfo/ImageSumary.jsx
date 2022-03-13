import React, { useState } from 'react'

import Link from 'next/link';

import LoadingImage from "@components/LoadingImage";
import { Divider, Grid, ListItem, Typography, Link as MuiLink, IconButton } from "@mui/material";

import {
    ContentCopy as ContentCopyIcon,
    OpenInNew as OpenInNewIcon,
    Image as ImageIcon,
    OpenInFull as OpenInFullIcon,
    ArrowCircleRightOutlined as ArrowCircleRightOutlinedIcon,
} from "@mui/icons-material";

import { Box } from "@mui/system";
import { Fonts, Props } from "@styles";
import * as t from '@consts';
import { shortenLink, formatBytes } from '@utils';

import { useDispatch } from 'react-redux';
import moment from 'moment';

const ImageSumary = (props) => {

    const { illustration, value, index } = props;

    const infoData = [
        ["Illustration", illustration.word, true, true],
        ["Name", illustration.name],
        ["Format", illustration.ext, false, false, true],
        ["File size", `${formatBytes(illustration.size * 1024)}`],
        [
            "Dimensions",
            `${illustration.width} x ${illustration.height}`,
            true,
        ],
        ["Uploaded", moment(illustration.updatedAt).format("MMM DD, YYYY hh:mm a")],
        ["Created", moment(illustration.createdAt).format("MMM DD, YYYY hh:mm a"), true],
    ];

    const photo = illustration?.formats?.small?.url || illustration?.formats?.medium?.url || illustration?.formats?.large?.url || illustration?.url;

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
                        <LoadingImage
                            src={photo}
                            layout="fill"
                            objectFit="contain"
                            // className="transparentBg"
                            className="transparentCheckerboardPattern"
                            bgColor="transparent"
                            draggable={false}
                            quality={100}
                            alt="Image"
                        />
                    </div>

                    {infoData.map((info, index) => (
                        <Box key={index}>
                            <ListItem sx={{ px: 0 }}>
                                <Grid container>
                                    <Grid item xs={3} {...Props.GIRSC}>
                                        <Typography sx={{ ...styles.textKey }}>
                                            {info[0]}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={9} {...Props.GIRSC}>
                                        {
                                            info[3] ?
                                                <Link href={!illustration.public ? `/word/${encodeURIComponent(info[1])}/${illustration.vipId}` : `/word/public/${encodeURIComponent(info[1])}/${illustration.vipId}`} passHref>
                                                    <MuiLink
                                                        rel={!illustration.public ? `/word/${encodeURIComponent(info[1])}/${illustration.vipId}` : `/word/public/${encodeURIComponent(info[1])}/${illustration.vipId}`}
                                                        sx={styles.textValue}
                                                        underline="hover"
                                                        className="overflowTypography"
                                                        title={`Open "${info[1]}"`}
                                                    >
                                                        {info[1]}&nbsp;<ArrowCircleRightOutlinedIcon sx={{ fontSize: [Fonts.FS_12, Fonts.FS_14] }} />
                                                    </MuiLink>
                                                </Link> :
                                                <Typography sx={{ ...styles.textValue }}>
                                                    {info[4] && <><ImageIcon fontSize="small" />&nbsp;</>}{info[1]}
                                                </Typography>
                                        }
                                    </Grid>
                                </Grid>
                            </ListItem>
                            {info[2] && <Divider />}
                        </Box>
                    ))}

                    <Box>
                        <ListItem sx={{ px: 0 }}>
                            <Grid container>
                                <Grid item xs={3} {...Props.GIRSC}>
                                    <Typography sx={{ ...styles.textKey }}>
                                        URL
                                    </Typography>
                                </Grid>

                                <Grid item xs={9}  {...Props.GIRBC}>
                                    <Link href={illustration.url} passHref>
                                        <MuiLink
                                            target="_blank"
                                            rel={illustration.url}
                                            sx={styles.textValue}
                                            underline="hover"
                                            className="overflowTypography"
                                            title="Open image in new tab"
                                        >
                                            {shortenLink(illustration.url, 10)}&nbsp;<OpenInNewIcon sx={{ fontSize: [Fonts.FS_12, Fonts.FS_14] }} />
                                        </MuiLink>
                                    </Link>

                                    <IconButton onClick={copyToClipboard}>
                                        <ContentCopyIcon sx={{ fontSize: [Fonts.FS_12, Fonts.FS_14] }} />
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
        fontWeight: Fonts.FW_600,
        fontSize: [Fonts.FS_12, Fonts.FS_14],
    },
    textValue: {
        fontSize: [Fonts.FS_12, Fonts.FS_14],
        display: 'flex',
        alignItems: 'center',
    },
    image: {
        position: "relative",
        height: "200px",
        width: "100%",
        marginBottom: "20px",
    },
});

export default React.memo(ImageSumary);
