import React, { useState, useEffect } from 'react';

import {
    Grid, Paper, Typography, IconButton,
    Divider, Chip, Button
} from '@mui/material';

import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';

import { Props, SXs } from '@styles';

import EachWord from './EachWord';

const EachGroup = ({ group, pageNumber, minimizedGroups, setMinimizedGroups }) => {

    const vips = group.data;
    const label = group.date;
    const displayLabel = group.isDisplay;

    return (
        <Grid container {...Props.GCRCS}>
            {
                displayLabel && label && <Grid item xs={12} {...Props.GIRCC} mt={1}>
                    <Divider sx={{ width: '100%' }}>
                        <Button
                            size="small"
                            variant="outlined"
                            sx={{
                                ...SXs.COMMON_BUTTON_STYLES,
                                borderRadius: '10px'
                            }}
                            endIcon={!minimizedGroups.includes(label) ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
                            onClick={() => {
                                const newMinimizedGroups = minimizedGroups.includes(label) ? minimizedGroups.filter(g => g !== label) : [...minimizedGroups, label];
                                setMinimizedGroups(newMinimizedGroups);
                            }}
                        >
                            {label}
                        </Button>
                    </Divider>
                </Grid>
            }
        </Grid>
    );
};

export default EachGroup;