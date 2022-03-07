import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

import {
    Container, Grid, Button, IconButton,
    Typography, Paper, TextField
} from '@mui/material';


import { useDispatch, useSelector } from 'react-redux';

import { Fonts, Colors, Props, SXs } from '@styles';

const WordList = () => {

    const userData = useSelector(state => state.userData);

    return <Container maxWidth="md">
        <Grid container {...Props.GCRCS}>
            <Grid item xs={12} mt={[5, 5, 3]}>
                <Typography variant="h1" align="center" sx={{ fontSize: Fonts.FS_27, fontWeight: Fonts.FW_400 }}>
                    Word List
                </Typography>
                <Typography variant="h2" color="text.secondary" align="center"
                    sx={{ fontSize: Fonts.FS_16, fontWeight: Fonts.FW_400, mt: 2 }}>
                    Search, add, edit and delete words here.
                </Typography>
            </Grid>

            <Grid item xs={12} mt={[5, 5, 3]}>
                <Grid container {...Props.GCRCC}>
                    <Grid item xs={12} {...Props.GIRSC}>
                        
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Container>
}

export default WordList;
