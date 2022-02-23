import { useRef, useEffect, useState, useCallback, useMemo } from 'react';

import {
    Grid, Typography, Box,
    IconButton, Paper, Chip,
    Badge, Tooltip, Stack,
    SvgIcon,
} from '@mui/material';

import {
    RemoveCircle as RemoveCircleIcon,
    DeleteForever as DeleteForeverIcon,
    AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';

import { Fonts, SXs, Colors } from '@styles';

const ListContent = ({ form, formField, label, handleDeleteItem }) => {
    const myRef = useRef(null);
    const [overflow, setOverflow] = useState(false);

    useEffect(() => {
        if (myRef?.current) {
            myRef.current.scrollTop = myRef.current.scrollHeight;
            if (myRef.current.clientHeight === 150) {
                setOverflow(true);
            } else {
                setOverflow(false);
            }
        }
    }, [form?.[formField]]);

    if (!form || !formField || !label || !handleDeleteItem) return <div></div>;

    const splitWord = form?.vip?.split(" ");
    const regex = new RegExp(splitWord.join("|"), 'gi');

    return (
        <Grid container>
            {form?.[formField]?.length > 0 && (
                <Grid item xs={12}>
                    <Stack
                        direction='row'
                        justifyContent='space-between'
                        sx={{ width: `calc(100% + 9px)` }}
                    >
                        <Tooltip title={`Auto-filled`}>
                            <Typography sx={styles().header}>
                                {label} ({form?.[formField]?.length}){'  '}
                                {
                                    form.auto && <SvgIcon fontSize='inherit'>
                                        <defs>
                                            <linearGradient id="Gradient1">
                                                <stop offset="0%" stopColor="#ffd54f" />
                                                <stop offset="100%" stopColor="#64b5f6" />
                                            </linearGradient>
                                        </defs>
                                        <AutoAwesomeIcon sx={{
                                            '&.MuiSvgIcon-root': {
                                                '*': { fill: `url(#Gradient1) #fff` }
                                            },
                                        }} color='inherit' >
                                        </AutoAwesomeIcon>
                                    </SvgIcon>
                                }
                            </Typography>
                        </Tooltip>
                        <Tooltip title="Delete All">
                            <IconButton
                                onClick={() => handleDeleteItem(formField, -10)}
                                sx={{
                                    ...SXs.MUI_NAV_ICON_BUTTON,
                                    borderRadius: '4px',
                                    width: 20,
                                    height: 20,
                                    fontSize: 'inherit',
                                    color: 'red'
                                }}
                            >
                                <DeleteForeverIcon fontSize='inherit' />
                            </IconButton>
                        </Tooltip>
                    </Stack>

                    <Grid container sx={styles(overflow).container}>
                        <Paper elevation={0} sx={styles().paper}>
                            <div style={styles(overflow).div} ref={myRef}>
                                {form[formField]?.map((eachItem, index) => (
                                    <Grid item xs={12} sx={styles(overflow).gridItem} key={`${index}-${label}`}>
                                        <Box sx={styles(overflow).boxItem}>
                                            <Typography
                                                style={styles(overflow).typography}
                                                className="overflowTypography"
                                                dangerouslySetInnerHTML={{
                                                    __html: eachItem
                                                        ?.split(" ")
                                                        ?.map(item => {
                                                            if (item?.match(regex)) {
                                                                return `${item.replace(regex, matched => `<span style="color: #f44336; font-weight: bold; text-decoration: underline;">${matched}</span>`)}`
                                                            } else {
                                                                return item
                                                            }
                                                        })
                                                        ?.join(" ")
                                                        ?.replace(/\s\s+/g, ' ')
                                                }}
                                            >

                                            </Typography>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    onClick={() => handleDeleteItem(formField, index)}
                                                    sx={{
                                                        ...SXs.MUI_NAV_ICON_BUTTON,
                                                        borderRadius: '4px',
                                                        width: 20,
                                                        height: 20,
                                                        fontSize: 'inherit',
                                                    }}
                                                >
                                                    <RemoveCircleIcon fontSize='inherit' />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Grid>
                                ))}
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Grid>
    )
};

const styles = (overflow) => ({
    header: {
        fontSize: Fonts.FS_15,
        fontWeight: Fonts.FW_500,
        mb: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        ...SXs.AUTO_FILLED_TEXT_COLOR
    },
    container: {
        overflow: 'hidden',
        width: `calc(100% + ${overflow ? 28 : 18}px)`,
        ml: '-8px',
    },
    div: {
        maxHeight: "150px",
        overflowY: "auto",
        width: `calc(100%)`,
    },
    paper: {
        borderRadius: '4px', overflow: 'hidden', width: '100%',
        border: `2px solid ${Colors.GREY_200}`,
    },
    gridItem: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        py: 0.5
    },
    boxItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        pl: 1
    },
    typography: {
        width: '100%',
        verticalAlign: 'middle',
        borderRadius: '4px',
        px: 1,
        fontSize: Fonts.FS_10,
    }
})

export default ListContent;