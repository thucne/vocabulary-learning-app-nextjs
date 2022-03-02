import React from "react";

import { Container, Grid, Typography, IconButton, Stack, Alert } from "@mui/material";
import { ArrowForward as ArrowForwardIcon, ArrowBack as ArrowBackIcon, } from "@mui/icons-material";

import { SXs, Fonts } from '@styles';

import ScrollPages from '@tallis/react-mui-scroll-view';

const ScrollableBlock = ({ data }) => {
    return (
        <div>
            {
                data.length > 0 && <ScrollPages {...config}>
                    {data.map((item, index) => (
                        <Typography className='overflowTypography' variant='caption' key={`render-${index}`}>{item}</Typography>
                    ))}
                </ScrollPages>
            }
        </div>
    );
};

const config = {
    mui: {
        Grid,
        Container,
        IconButton,
        Stack,
        ArrowBackIcon,
        ArrowForwardIcon,
    },
    buttonIconStyle: {
        display: 'none'
    },
    iconStyle: {
        fontSize: Fonts.FS_20,
    },
    elementStyle: {
        // "&:hover": { filter: "brightness(1)" }
    },
    containerStyle: {
        maxWidth: "100%",
        maxHeight: '100px',
        overflow: 'auto',
    },
    gridItemSize: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
    },
    showScrollbar: true,
    React,
};

export default ScrollableBlock;