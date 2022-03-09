import React, { useMemo, useState } from "react";

import Index from "@components/LoadingImage";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
    Button,
    Collapse,
    Divider,
    Grid,
    IconButton,
    ListItem,
    Tooltip,
    Typography,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import { Box } from "@mui/system";

import { Fonts, SXs, Props, Colors } from "@styles";
import { capitalizeFirstLetter, getAllImageFormats, shortenLink } from "@utils";
import Link from "next/link";

const MAX_FILENAME_LENGTH = 10;
const MetaData = (props) => {
    const { illustration, value, index } = props;
    console.log("rerendering Metadata");

    const { formatArrays, opens } = useMemo(
        () => getAllImageFormats(illustration),
        [illustration]
    );

    const [openSecsons, setOpenSecsons] = useState(opens);

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {formatArrays.map((format, index) => (
                        <Box key={index}>
                            <Grid key={index} item xs={12}>
                                <Button
                                    fullWidth
                                    disableRipple
                                    onClick={() =>
                                        setOpenSecsons((prev) => ({
                                            ...prev,
                                            [format[0]]: !prev[format[0]],
                                        }))
                                    }
                                    sx={{
                                        ...SXs.COMMON_BUTTON_STYLES,
                                        justifyContent: "space-between",
                                    }}
                                    endIcon={
                                        openSecsons[format[0]] ? <ExpandLess /> : <ExpandMore />
                                    }
                                    size="small"
                                >
                                    {capitalizeFirstLetter(format[0])}
                                </Button>
                            </Grid>

                            <InfoExpand format={format} openSecsons={openSecsons} />
                            {index !== formatArrays.length - 1 && <Divider />}
                        </Box>
                    ))}
                </Box>
            )}
        </div>
    );
};

const InfoExpand = ({ format, openSecsons, isBreak }) => {
    const infoData = [
        ["File size", `${format[1].size} kb`],
        ["Dimension", `${format[1].width}x${format[1].height}`],
    ];

    const [isCopy, setIsCopy] = useState(false);

    const copyToClipboard = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(format[1].url);
        setIsCopy(true);
    };
    return (
        <Grid item xs={12}>
            <Collapse
                in={openSecsons[format[0]]}
                sx={{ width: "100%" }}
                timeout="auto"
                unmountOnExit
            >
                {infoData.map((info, index) => (
                    <Grid container key={index} mb={1}>
                        <Grid item xs={4}>
                            <Typography sx={{ ...styles(Fonts).keyText }}>
                                {info[0]}
                            </Typography>
                        </Grid>

                        <Grid item xs={8}>
                            <Typography
                                sx={{
                                    ...styles(Fonts).valueText,
                                }}
                            >
                                {info[1]}
                            </Typography>
                        </Grid>
                    </Grid>
                ))}

                <Grid container>
                    <Grid item xs={4}>
                        <Typography sx={{ ...styles(Fonts).keyText }}>Url</Typography>
                    </Grid>

                    <Grid item xs={8}>
                        <Box
                            sx={{
                                ...styles().info,
                            }}
                        >
                            <Box sx={{ width: "80%" }}>
                                <span>
                                    <Link href={format[1].url} passHref>
                                        <a
                                            target="_blank"
                                            rel={format[1].url}
                                            style={{
                                                ...styles().link,

                                            }}
                                        >
                                            {shortenLink(format[1].url, 10)}
                                        </a>
                                    </Link>
                                </span>

                                <Box sx={{ ...styles().copyButton }}>
                                    <IconButton onClick={copyToClipboard}>
                                        <Tooltip title={isCopy ? "Copied" : "Copy"}>
                                            <LinkIcon />
                                        </Tooltip>
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Collapse>
        </Grid>
    );
};

const styles = (Fonts = {}) => ({
    keyText: {
        fontWeight: Fonts.FW_500,
        fontSize: [Fonts.FS_12, Fonts.FS_14, Fonts.FS_16],
    },
    valueText: {
        fontSize: [Fonts.FS_12, Fonts.FS_14, Fonts.FS_16],
    },
    link: {
        wordWrap: "break-word",
        color: Colors.BLUE,
        textDecoration: "underline",
        fontSize: [Fonts.FS_12, Fonts.FS_14, Fonts.FS_16],
    },
    copyButton: {
        display: "inline",
        justifyContent: "center",
        width: "20%",
    },
    info: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        mb: 2,
    },
});

export default React.memo(MetaData);
