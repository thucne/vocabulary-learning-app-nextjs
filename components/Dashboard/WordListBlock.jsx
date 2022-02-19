import React from 'react';

import {
    Container, Grid, Box, Typography, IconButton,
} from '@mui/material';

import SwipeableViews from 'react-swipeable-views';

import { Fonts, Colors } from '@styles';
import { stringAvatar } from '@utils';

const WordListBlock = ({ wordList }) => {

    console.log(wordList)

    return (
        <Container maxWidth="lg" disableGutters>
            <Grid container direction="row" mt={[0, 1, 2, 3]}>
                <Grid item xs={12}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: Fonts.FW_500 }}>
                        Word List
                    </Typography>
                </Grid>
                <Grid item xs={12}>

                </Grid>
            </Grid>
        </Container>
    );
};

export default WordListBlock;