import { useState } from 'react';

import {
    Box, Typography
} from '@mui/material';

import { SXs } from '@styles';

import ToggleButtons from './ToggleButton';
import ScrollableBlock from './ScrollableBlock';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

const SecondaryBlock = ({ data }) => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        if (newValue !== null) {
            setValue(newValue);
        }
    };

    return <Box sx={{ width: '100%' }}>

        <ToggleButtons value={value} onChange={handleChange} />

        <TabPanel value={value} index={0}>
            <ScrollableBlock data={data?.examples} />
        </TabPanel>

        <TabPanel value={value} index={1}>
            <ScrollableBlock data={data?.meanings?.english} />
        </TabPanel>

        <TabPanel value={value} index={2}>
            <ScrollableBlock data={data?.meanings?.vietnamese} />
        </TabPanel>

    </Box>
}

export default SecondaryBlock;
