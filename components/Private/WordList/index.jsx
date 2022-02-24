import React, { useEffect, useState } from 'react';

import {
    List, ListItem, ListItemIcon, ListItemText,
    ListSubheader, Switch, Container, Grid, Typography,
    Divider, Collapse, ToggleButton, ToggleButtonGroup,
    Slider, FormControl, InputLabel, Select, MenuItem,
    IconButton, Tooltip, Paper
} from '@mui/material';

import {
    Wifi as WifiIcon,
    Bluetooth as BluetoothIcon,
    AutoAwesome as AutoAwesomeIcon,
    Numbers as NumbersIcon,
    SubdirectoryArrowRight as SubdirectoryArrowRightIcon,
    Refresh as RefreshIcon,
    Public as PublicIcon,
    Lock as LockIcon,
} from '@mui/icons-material';

import { Colors, Fonts, SXs } from '@styles';
import { toggleSettings } from '@utils';

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

    const handleChange = (value, selectionValue) => () => toggleSettings(value, selectionValue, checked, setChecked);

    const getItem = (name) => checked?.find(item => item.includes(`${name}`))

    const isExist = (name) => {
        const temp = getItem(name);
        const isTheirASlash = temp?.includes('/');
        return [temp !== undefined, isTheirASlash ? temp.split("/").slice(-1)[0] : temp];
    };

    return (
        <Container maxWidth="lg">
            <Grid container>
                <Grid item xs={12} mt={[3, 4, 5]}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: Fonts.FW_500 }}>
                        Settings
                        <Tooltip title="Reset settings">
                            <IconButton sx={{ ...SXs.MUI_NAV_ICON_BUTTON, ml: 2 }}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6} md={4} my={1}>
                    <Paper variant='outlined' sx={gridSX}>
                        <List
                            sx={{ width: '100%', mt: 0 }}
                            subheader={<ListHeadings
                                title="Helper"
                                subtitle="This will help you fill out most of the fields. Note that sometimes it will fail."
                            />}
                        >
                            <ListItem>
                                <ListItemIcon>
                                    <AutoAwesomeIcon />
                                </ListItemIcon>
                                <ListItemText id="switch-list-label-wifi" primary="Auto fill" />
                                <Switch
                                    edge="end"
                                    onChange={(e, value) => handleChange('auto-fill', `${value.toString()}`)()}
                                    checked={isExist('auto-fill')[0] ? isExist('auto-fill')[1] === 'true' : true}
                                    inputProps={{
                                        'aria-labelledby': 'switch-list-label-wifi',
                                    }}
                                />
                            </ListItem>
                            <AutoFillLevel
                                handleChange={handleChange}
                                isExist={isExist}
                                {...autoFillLevelsProps.examples}
                            />
                            <AutoFillLevel
                                handleChange={handleChange}
                                isExist={isExist}
                                {...autoFillLevelsProps.english}
                            />
                            <AutoFillLevel
                                handleChange={handleChange}
                                isExist={isExist}
                                {...autoFillLevelsProps.tags}
                            />
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4} my={1}>
                    <Paper variant='outlined' sx={gridSX}>
                        <List
                            sx={{ width: '100%', mt: 0 }}
                            subheader={<ListHeadings
                                title="Publicity"
                            />}
                        >
                            <ListItem>
                                <ListItemIcon>
                                    {isExist('public-words')[1] === 'true' ? <PublicIcon /> : <LockIcon />}
                                </ListItemIcon>
                                <ListItemText id="switch-list-label-wifi" primary="Make future words public" />
                                <Switch
                                    edge="end"
                                    onChange={(e, value) => handleChange('public-words', `${value.toString()}`)()}
                                    checked={isExist('public-words')[0] ? isExist('public-words')[1] === 'true' : true}
                                    inputProps={{
                                        'aria-labelledby': 'switch-list-label-public-words',
                                    }}
                                />
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

const ListHeadings = ({ title, subtitle }) => [
    <Typography sx={{ ml: 2, mt: 2 }} variant="h6" component="div" key={`heading-list-${title}`}>
        {title}
    </Typography>,
    <ListSubheader sx={{
        bgcolor: theme => theme.palette.paper_grey.main,
        lineHeight: 'normal',
        my: 1
    }} key={`sub-heading-list-${title}`}>
        {subtitle}
    </ListSubheader>
]

const AutoFillLevel = ({ handleChange, name, values, title, isExist }) => (
    <Collapse in={isExist('auto-fill')[0] ? isExist('auto-fill')[1] === 'true' : true} timeout="auto" unmountOnExit>
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
                    value={isExist(`${name}`)[0] ? isExist(`${name}`)[1] : 2}
                    onChange={(e) =>
                        handleChange(`${name}`, `${e.target.value}`)()
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

const gridSX = {
    overflow: 'hidden',
    bgcolor: theme => theme.palette.paper_grey.main,
    borderRadius: '10px',
    ':hover': {
        boxShadow: theme => theme.shadows[3]
    }
}

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
