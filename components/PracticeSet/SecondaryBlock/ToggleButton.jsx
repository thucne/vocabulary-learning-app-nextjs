import * as React from 'react';
import { styled } from '@mui/material/styles';

import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { SXs } from '@styles';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
        margin: theme.spacing(0.5),
        border: 0,
        '&.Mui-disabled': {
            border: 0,
        },
        '&:not(:first-of-type)': {
            borderRadius: theme.shape.borderRadius,
        },
        '&:first-of-type': {
            borderRadius: theme.shape.borderRadius,
        },
    },
}));



export default function CustomizedDividers({ value, onChange }) {
    return (
        <div style={{ marginBottom: '10px', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Paper
                elevation={0}
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    width: 'fit-content',
                    alignItems: 'center',
                    '&.MuiPaper-root': {
                        borderRadius: '8px'
                    }
                }}
            >
                <StyledToggleButtonGroup
                    size="small"
                    value={value}
                    exclusive
                    onChange={onChange}
                    aria-label="text alignment"
                >
                    <ToggleButton value={0} aria-label="examples tab" sx={SXs.TOGGLE_BUTTON_STYLES}>
                        Examples
                    </ToggleButton>
                    <ToggleButton value={1} aria-label="english tab" sx={SXs.TOGGLE_BUTTON_STYLES}>
                        English
                    </ToggleButton>
                    <ToggleButton value={2} aria-label="vietnamese tab" sx={SXs.TOGGLE_BUTTON_STYLES}>
                        Vietnamese
                    </ToggleButton>
                </StyledToggleButtonGroup>
            </Paper>
        </div>
    );
}
