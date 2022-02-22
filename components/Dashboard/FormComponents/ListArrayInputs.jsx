import { useRef, useEffect, useState } from 'react';

import {
    Grid, Typography, Box, IconButton,
    Divider, Paper
} from '@mui/material';

import {
    RemoveCircle as RemoveCircleIcon,
} from '@mui/icons-material';

import { Fonts, SXs } from '@styles';

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
    }, [form?.[formField]])

    if (!form || !formField || !label || !handleDeleteItem) return <div></div>;

    return (
        <Grid container>
            {form?.[formField]?.length > 0 && (
                <Grid item xs={12}>
                    <Typography sx={{ fontSize: Fonts.FS_15, fontWeight: Fonts.FW_500 }}>
                        {label}
                    </Typography>

                    <Grid container sx={styles(overflow).container}>
                        <Paper elevation={0} sx={{ borderRadius: '4px', overflow: 'hidden', width: '100%' }}>
                            <div style={styles(overflow).div} ref={myRef}>
                                {form[formField]?.map((eachItem, index) => (
                                    <Grid item xs={12} sx={styles(overflow).gridItem} key={`${index}-${label}`}>
                                        <Box sx={styles(overflow).boxItem}>
                                            <Typography sx={styles(overflow).typography} className="overflowTypography">
                                                {eachItem}
                                            </Typography>

                                            <IconButton
                                                onClick={() => handleDeleteItem(formField, index)}
                                                sx={{ ...SXs.MUI_NAV_ICON_BUTTON, borderRadius: '4px' }}
                                            >
                                                <RemoveCircleIcon />
                                            </IconButton>
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
    container: {
        overflow: 'hidden',
        width: `calc(100% + ${overflow ? 26 : 16}px)`,
        ml: '-8px',
    },
    div: {
        maxHeight: "150px",
        overflowY: "auto",
        width: `calc(100%)`,
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
    },
    typography: {
        width: '100%',
        verticalAlign: 'middle',
        textAlign: 'left',
        alignItems: 'center',
        display: 'flex',
        borderRadius: '4px',
        px: 1
    }
})

export default ListContent;