import React, { useEffect, useState } from 'react';

import {
    List, ListItem, ListItemIcon, ListItemText,
    ListSubheader, Switch, Container, Grid, Typography,
    Divider, Collapse, ToggleButton, ToggleButtonGroup,
    Slider, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

import {
    Wifi as WifiIcon,
    Bluetooth as BluetoothIcon,
    AutoAwesome as AutoAwesomeIcon,
    Numbers as NumbersIcon,
    SubdirectoryArrowRight as SubdirectoryArrowRightIcon
} from '@mui/icons-material';

import { Colors, Fonts, SXs } from '@styles';

export default function SwitchListSecondary() {
    const [checked, setChecked] = useState([]);
    const [isSet, setIsSet] = useState(false);

    useEffect(() => {
        const loop = setInterval(() => {
            if (window && !isSet) {
                setChecked(JSON.parse(localStorage.getItem('vip-settings')) || []);
                setIsSet(true);
                clearInterval(loop);
            }
        }, 100);

        return () => clearInterval(loop);
    }, [isSet]);

    const handleToggle = (value, selectionValue) => () => {
        const currentIndex = checked.findIndex(item => item?.includes(value));
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(`${value}${selectionValue ? `/${selectionValue}` : ''}`);
        } else {
            if (!selectionValue) {
                newChecked.splice(currentIndex, 1);
            } else {
                newChecked[currentIndex] = `${value}/${selectionValue}`;
            }
        }
        setChecked(newChecked);

        if (window) {
            localStorage.setItem('vip-settings', JSON.stringify(newChecked));
        }
    };

    return (
        <Container maxWidth="lg">
            <Grid container>
                <Grid item xs={12} mt={[3, 4, 5]}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: Fonts.FW_500 }}>
                        Settings
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <List
                        sx={{ width: '100%', bgcolor: 'background.paper', mt: 0 }}
                        subheader={<ListSubheader>Helper</ListSubheader>}
                    >
                        <ListItem>
                            <ListItemIcon>
                                <AutoAwesomeIcon />
                            </ListItemIcon>
                            <ListItemText id="switch-list-label-wifi" primary="Auto fill" />
                            <Switch
                                edge="end"
                                onChange={handleToggle('auto-fill')}
                                checked={checked.indexOf('auto-fill') !== -1}
                                inputProps={{
                                    'aria-labelledby': 'switch-list-label-wifi',
                                }}
                            />
                        </ListItem>
                        <AutoFillLevel
                            checked={checked}
                            handleToggle={handleToggle}
                            {...autoFillLevelsProps.examples}
                        />
                        <AutoFillLevel
                            checked={checked}
                            handleToggle={handleToggle}
                            {...autoFillLevelsProps.english}
                        />
                        <AutoFillLevel
                            checked={checked}
                            handleToggle={handleToggle}
                            {...autoFillLevelsProps.tags}
                        />
                    </List>
                </Grid>
            </Grid>
        </Container>
    );
}

const AutoFillLevel = ({ checked, handleToggle, name, values, title }) => (
    <Collapse in={checked.indexOf('auto-fill') !== -1} timeout="auto" unmountOnExit>
        <ListItem>
            <ListItemIcon sx={{ ml: 2 }}>
                <SubdirectoryArrowRightIcon />
            </ListItemIcon>
            <ListItemText id={`switch-list-label-${name}`} primary={title} />
            <FormControl>
                <InputLabel id={`demo-simple-select-${name}`}>Max</InputLabel>
                <Select
                    sx={{ width: '90px' }}
                    size='small'
                    label="Max"
                    labelId={`demo-simple-select-label-${name}`}
                    id={`demo-simple-select-${name}`}
                    value={checked.find(item => item.includes(`${name}`))?.split("/").slice(-1)[0] || 2}
                    onChange={(e) =>
                        handleToggle(`${name}`, `${e.target.value}`)()
                    }
                >
                    {values?.map((value, index) => (
                        <MenuItem value={value?.value} key={`render-${name}-${index}`}>{value?.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </ListItem>
    </Collapse>
);

const autoFillLevelsProps = {
    examples: {
        title: 'Examples',
        values: [
            { value: 0, label: 'None' },
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
            { value: 4, label: '4' },
            { value: 5, label: '5' },
            { value: 10, label: '10' },
            { value: 100, label: 'All' },
        ],
        name: 'examples'
    },
    english: {
        title: 'English',
        values: [
            { value: 0, label: 'None' },
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
            { value: 4, label: '4' },
            { value: 5, label: '5' },
            { value: 10, label: '10' },
            { value: 100, label: 'All' },
        ],
        name: 'english'
    },
    tags: {
        title: 'Tags',
        values: [
            { value: 0, label: 'None' },
            { value: 1, label: '10' },
            { value: 2, label: '20' },
            { value: 3, label: '50' },
            { value: 4, label: '100' },
            { value: 5, label: 'All' },
        ],
        name: 'tags'
    }
}

const marks = [
    {
        value: 1,
        label: '1',
    },
    {
        value: 2,
        label: '2',
    },
    {
        value: 3,
        label: '3',
    },
    {
        value: 4,
        label: '4',
    },
    {
        value: 5,
        label: '5',
    },
    {
        value: 6,
        label: '10',
    },
    {
        value: 7,
        label: 'All',
    },
];

function valuetext(value) {
    return `${marks.find((mark) => mark.value === value)?.label}`;
}

function valueLabelFormat(value) {
    return marks.findIndex((mark) => mark.value === value) + 1;
}
