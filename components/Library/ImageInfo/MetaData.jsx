import React, { useMemo, useState, useRef } from "react";

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
    Box,
    Link as MuiLink
} from "@mui/material";

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

import { Fonts, SXs, Props, Colors } from "@styles";
import {
    capitalizeFirstLetter, getAllImageFormats, shortenLink,
    useThisToGetSizesFromRef, formatBytes
} from "@utils";

import { useDispatch } from 'react-redux';
import * as t from '@consts';

import Link from "next/link";

const MAX_FILENAME_LENGTH = 10;

const MetaData = (props) => {
    const { illustration, value, index } = props;

    const buttonRef = useRef(null);

    const { formatArrays, opens } = useMemo(
        () => getAllImageFormats(illustration),
        [illustration]
    );

    const [openSecsons, setOpenSecsons] = useState({ origin: true });

    const buttonSize = useThisToGetSizesFromRef(buttonRef, {
        revalidate: 1000,
        terminalCondition: ({ width }) => width !== 0,
        falseCondition: ({ width }) => width === 0,
    });

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>

                    {/* Origin  */}
                    <Box>
                        <Grid ref={buttonRef} item xs={12}>
                            <Button
                                fullWidth
                                disableRipple
                                onClick={() =>
                                    setOpenSecsons((prev) => ({
                                        ...prev,
                                        origin: !prev.origin,
                                    }))
                                }
                                sx={{
                                    ...SXs.COMMON_BUTTON_STYLES,
                                    justifyContent: "space-between",
                                    width: `calc(${buttonSize?.width + 10}px)`,
                                    ml: '-5px',
                                }}
                                endIcon={
                                    openSecsons.origin ? <ExpandLess /> : <ExpandMore />
                                }
                                size="small"
                            >
                                Origin
                            </Button>
                        </Grid>

                        <InfoExpand format={[
                            "origin",
                            illustration
                        ]} openSecsons={openSecsons} />
                        {index !== formatArrays.length - 1 && <Divider sx={{ my: 1 }} />}
                    </Box>

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
                                        width: `calc(${buttonSize?.width + 10}px)`,
                                        ml: '-5px',
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
                            {index !== formatArrays.length - 1 && <Divider sx={{ my: 1 }} />}
                        </Box>
                    ))}
                </Box>
            )}
        </div>
    );
};

const InfoExpand = ({ format, openSecsons, isBreak }) => {
    const dispatch = useDispatch();

    const infoData = [
        ["File size", `${formatBytes(format[1].size * 1024)}`],
        ["Dimensions", `${format[1].width} x ${format[1].height}`],
    ];

    const copyToClipboard = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(format[1].url).then(() => {
            dispatch({ type: t.SHOW_SNACKBAR, payload: { message: "Copied to clipboard", type: "info" } });
        }, () => {
            dispatch({ type: t.SHOW_SNACKBAR, payload: { message: "Failed to copy", type: "warning" } });
        });
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
                        <Grid item xs={3}>
                            <Typography sx={{ ...styles.keyText }}>
                                {info[0]}
                            </Typography>
                        </Grid>

                        <Grid item xs={9}>
                            <Typography
                                sx={{
                                    ...styles.valueText,
                                }}
                            >
                                {info[1]}
                            </Typography>
                        </Grid>
                    </Grid>
                ))}

                <Grid container>
                    <Grid item xs={3}>
                        <Typography sx={{ ...styles.keyText }}>URL</Typography>
                    </Grid>

                    <Grid item xs={9} {...Props.GIRBC} >
                        <Link href={format[1].url} passHref>
                            <MuiLink
                                target="_blank"
                                rel={format[1].url}
                                sx={styles.link}
                                underline="hover"
                                className="overflowTypography"
                                title="Link to image"
                            >
                                {shortenLink(format[1].url, 10)}
                            </MuiLink>
                        </Link>

                        <IconButton onClick={copyToClipboard}>
                            <ContentCopyIcon sx={{ fontSize: [Fonts.FS_12, Fonts.FS_14, Fonts.FS_16] }} />
                        </IconButton>
                    </Grid>
                </Grid>
            </Collapse>
        </Grid>
    );
};

const styles = ({
    keyText: {
        fontWeight: Fonts.FW_600,
        fontSize: [Fonts.FS_12, Fonts.FS_14],
    },
    valueText: {
        fontSize: [Fonts.FS_12, Fonts.FS_14],
    },
    link: {
        fontSize: [Fonts.FS_12, Fonts.FS_14],
    },
    info: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        mb: 2,
    },
});

export default React.memo(MetaData);
