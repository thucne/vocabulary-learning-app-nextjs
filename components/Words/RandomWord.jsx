import React, { useEffect, useState } from 'react';

import { Paper, Typography, Grid, IconButton, Tooltip } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

import { Colors, Props, Fonts } from '@styles';

import data from "./data";
import _ from 'lodash';

const RandomWord = ({ width = 300 }) => {
    const [word, setWord] = useState(data[Math.floor(Math.random() * data.length)]);

    // useEffect(() => {
    //     // shuffle the data and save to file

    //     const shuffledData = _.shuffle(test);
    //     const shuffledDataString = JSON.stringify(shuffledData);

    //     // save to file
    //     const newBlob = new Blob([shuffledDataString], { type: 'application/json' });

    //     const dataURL = window.URL.createObjectURL(newBlob);
    //     const link = document.createElement('a');
    //     link.href = dataURL;
    //     link.download = 'shuffledData.json';
    //     link.click();
    // },[])

    const handleRefresh = () => setWord(data[Math.floor(Math.random() * data.length)]);

    return (
        <Paper sx={{
            width: width,
            height: width,
            maxWidth: 300,
            maxHeight: 300,
            borderRadius: '4px',
            overflow: 'hidden',
            position: 'relative',
        }}>
            <label title="Refresh">
                <IconButton
                    onClick={handleRefresh}
                    sx={{
                        color: Colors.BLUE_PUBLIC_WORDS,
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        zIndex: 1,
                    }}
                    size="small"
                >
                    <RefreshRoundedIcon fontSize="inherit" />
                </IconButton>
            </label>
            <Grid container {...Props.GCRCC}>
                <Grid item xs={12} {...Props.GICCC} sx={{ height: width / 2, maxHeight: 150, backgroundColor: Colors.WOAD_YELLOW, px: 2, py: 1 }}>
                    <Typography variant="caption">
                        TRICKY WORD
                    </Typography>
                    <Typography variant="h4" sx={{ color: Colors.BLUE_PUBLIC_WORDS, mt: 1 }} className="overflowTypography">
                        {word?.word?.toLowerCase()}
                    </Typography>
                </Grid>
                <Grid item xs={12} {...Props.GIRCC} sx={{ height: width / 2, maxHeight: 150, px: 2, py: 1 }} className="overflowTypography">
                    <Typography sx={{ color: (theme) => theme.palette.mainPublicWord.main, fontSize: Fonts.FS_16 }} align="center">
                        {word?.definition?.trim()?.toLowerCase()}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default RandomWord;