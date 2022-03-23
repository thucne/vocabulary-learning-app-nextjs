import React, { useState, useEffect } from 'react';

import {
    Checkbox, Grid, Typography, IconButton,
    Paper
} from '@mui/material';

import { Props, SXs, Colors, Fonts } from '@styles';

const EachWord = ({ vip, selectedVips, setSelectedVips, defaultChecked }) => {
    return (
        <Paper variant='outlined' sx={{ mx: 1, my: 0.5 }}>
            <Grid container {...Props.GCRBC}>
                <Grid item>
                    <Checkbox
                        checked={selectedVips.includes(vip.id)}
                        onChange={() => {
                            setSelectedVips(vip.id)
                        }}
                    />
                </Grid>
                <Grid item>
                    <Typography >
                        {vip.id}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography >
                        {vip.vip}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default EachWord;