import React, { useEffect, useState } from 'react';

import { Paper, Typography, Grid, IconButton, Tooltip } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

import { Colors, Props, Fonts } from '@styles';
import { handleDictionaryData } from '@utils';

import data from "./data";
import _ from 'lodash';

const RandomWord = () => {
    const [word, setWord] = useState(data[Math.floor(Math.random() * data.length)]);

    // useEffect(() => {
    //     // shuffle the data and save to file

    //     const shuffledData = _.shuffle(data);
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
            width: 300,
            height: 300,
            borderRadius: 0,
            overflow: 'hidden',
            position: 'relative',
        }}>
            <Tooltip title="Refresh">
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
            </Tooltip>
            <Grid container {...Props.GCRCC}>
                <Grid item xs={12} {...Props.GICCC} sx={{ height: 150, backgroundColor: Colors.WOAD_YELLOW }}>
                    <Typography variant="caption">
                        WORD OF THE ... NOW
                    </Typography>
                    <Typography variant="h4" sx={{ color: Colors.BLUE_PUBLIC_WORDS, mt: 1 }} className="overflowTypography">
                        {word?.word?.toLowerCase()}
                    </Typography>
                </Grid>
                <Grid item xs={12} {...Props.GIRCC} sx={{ height: 150, px: 2, py: 1 }} className="overflowTypography">
                    <Typography sx={{ color: (theme) => theme.palette.mainPublicWord.main, fontSize: Fonts.FS_16 }}>
                        {word?.definition?.trim()?.toLowerCase()}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default RandomWord;