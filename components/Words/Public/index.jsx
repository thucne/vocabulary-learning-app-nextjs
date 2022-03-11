import React from 'react';

import Link from 'next/link';

import {
    Container, Grid, Typography, Divider,
    Link as MuiLink
} from '@mui/material';

import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';

import { Props, SXs, Fonts, Colors } from '@styles';

const PublicWord = ({ vip, relatedVips }) => {

    return (
        <Container maxWidth="md">
            <Grid container {...Props.GCRSC}>
                <Grid item xs={12} mt={2}>
                    <Typography variant="caption">
                        <i>You are viewing a public word.</i>
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h4" component="h1" className='overflowTypography'>
                        {vip.vip}
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    );
};

export default PublicWord;