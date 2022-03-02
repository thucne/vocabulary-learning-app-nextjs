import React from "react";

import { Container, Grid, Typography, IconButton, Stack, Alert } from "@mui/material";
import { ArrowForward as ArrowForwardIcon, ArrowBack as ArrowBackIcon, } from "@mui/icons-material";

import { SXs, Fonts } from '@styles';

import ScrollPages from '@tallis/react-mui-scroll-view';

const ScrollableBlock = ({ data, word }) => {

    const splitWord = word?.split(" ");
    const regex = new RegExp(splitWord.join("|"), "gi");

    return (
        <div>
            {data.length > 0 ?
                <ScrollPages {...config}>
                    {data.map((each, index) => (
                        <Typography
                            className='overflowTypography'
                            variant='caption'
                            key={`render-${index}`}
                            sx={{ py: 1 }}
                            dangerouslySetInnerHTML={{
                                __html: each
                                    ?.split(" ")
                                    ?.map((item) => {
                                        if (item?.match(regex)) {
                                            return `${item.replace(
                                                regex,
                                                (matched) =>
                                                    `<span style="color: #f44336; font-weight: bold; text-decoration: underline;">${matched}</span>`
                                            )}`;
                                        } else {
                                            return item;
                                        }
                                    })
                                    ?.join(" ")
                                    ?.replace(/\s\s+/g, " "),
                            }}
                        ></Typography>
                    ))}
                </ScrollPages> :
                <Alert severity="info">No data</Alert>
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
        mt: 0,
        '.MuiGrid-root': {
            py: 0,
            my: 0
        }
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