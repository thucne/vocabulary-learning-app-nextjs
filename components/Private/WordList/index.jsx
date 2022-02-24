import React, { useEffect, useState, useMemo } from 'react';

import {
    List, ListItem, ListItemIcon, ListItemText,
    ListSubheader, Switch, Container, Grid, Typography,
    Divider, Collapse, ToggleButton, ToggleButtonGroup,
    Slider, FormControl, InputLabel, Select, MenuItem,
    IconButton, Tooltip, Paper, TextField, Stack
} from '@mui/material';

import {
    AutoAwesome as AutoAwesomeIcon,
    SubdirectoryArrowRight as SubdirectoryArrowRightIcon,
    Refresh as RefreshIcon,
    Public as PublicIcon,
    Lock as LockIcon,
    AutoStories as AutoStoriesIcon,
    Timelapse as TimelapseIcon,
    LowPriority as LowPriorityIcon
} from '@mui/icons-material';

import { Colors, Fonts, SXs } from '@styles';
import { toggleSettings } from '@utils';

import { debounce } from "lodash";

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

    const handleReset = () => {
        window && localStorage.setItem('vip-settings', JSON.stringify([]));
        setChecked([]);
    };

    return (
        <Container maxWidth="lg">
            <Grid container>
                <Grid item xs={12} mt={[3, 4, 5]}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: Fonts.FW_500 }}>
                        Settings
                        <Tooltip title="Reset settings">
                            <IconButton sx={{ ...SXs.MUI_NAV_ICON_BUTTON, ml: 2 }} onClick={handleReset}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                </Grid>

                <Grid item xs={12} sm={6} md={4} my={1} px={[0, 0.5]}>
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

                <Grid item xs={12} sm={6} md={4} my={1} px={[0, 0.5]}>
                    <Paper variant='outlined' sx={gridSX}>
                        <List
                            sx={{ width: '100%', mt: 0 }}
                            subheader={<ListHeadings
                                title="Publicity"
                            />}
                        >
                            <ListItem>
                                <ListItemIcon>
                                    {(isExist('public-words')[0] ? isExist('public-words')[1] === 'true' : true) ? <PublicIcon /> : <LockIcon />}
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

                <Grid item xs={12} sm={6} md={4} my={1} px={[0, 0.5]}>
                    <Paper variant='outlined' sx={gridSX}>
                        <List
                            sx={{ width: '100%', mt: 0 }}
                            subheader={<ListHeadings
                                title="Practice"
                                subtitle="Set level of practice"
                            />}
                        >
                            <PractiseInputNumber
                                handleChange={handleChange}
                                isExist={isExist}
                                name="word-eachtime"
                                title="Words per practice"
                                subtitle="(10-50)"
                                Icon={AutoStoriesIcon}
                                min={10}
                                max={50}
                                defaultValue={20}
                            />
                            <PractiseInputNumber
                                handleChange={handleChange}
                                isExist={isExist}
                                name="practise-eachday"
                                title="Practice per day"
                                subtitle="(1-50)"
                                Icon={TimelapseIcon}
                                min={1}
                                max={50}
                                defaultValue={1}
                            />
                            <AutoFillLevel
                                handleChange={handleChange}
                                isExist={isExist}
                                {...autoFillLevelsProps.lastReview}
                            />
                            <AutoFillLevel
                                handleChange={handleChange}
                                isExist={isExist}
                                {...autoFillLevelsProps.lastReviewOK}
                            />
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

const PractiseInputNumber = ({ Icon, name, title, subtitle, handleChange, isExist, max, min, defaultValue }) => {

    const debounceFixValue = useMemo(() => debounce((e) => {

        if (Number(e.target.value) > max) {
            e.target.value = max;
        }
        if (Number(e.target.value) < min) {
            e.target.value = min;
        }

        handleChange(`${name}`, `${e.target.value}`)();

    }, 500), [max, min, handleChange, name]);

    return (
        <ListItem>
            <ListItemIcon>
                <Icon />
            </ListItemIcon>
            <ListItemText
                id={`switch-list-label-${name}`}
                primary={title}
                secondary={subtitle}
            />
            <TextField
                sx={{ width: '90px' }}
                size="small"
                id={`outlined-number-${name}`}
                label="Max"
                type="number"
                value={isExist(name)[0] ? Number(isExist(name)[1]) : defaultValue}
                onChange={(e) => {
                    debounceFixValue(e);
                    handleChange(`${name}`, `${e.target.value}`)()
                }}
            />
        </ListItem>
    )
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

const AutoFillLevel = ({ handleChange, name, values, title, isExist, Icon, noGutter, label, defaultValue, subtitle }) => (
    <Collapse in={isExist('auto-fill')[0] ? isExist('auto-fill')[1] === 'true' : true} timeout="auto" unmountOnExit>
        <ListItem>
            <ListItemIcon sx={{ ml: noGutter ? 0 : 2 }}>
                {Icon ? <Icon /> : <SubdirectoryArrowRightIcon />}
            </ListItemIcon>
            <Grid container direction='row' alignItems='center'>
                <Grid item xs={8}>
                    <ListItemText
                        id={`switch-list-label-${name}`}
                        primary={title}
                        secondary={subtitle}
                        secondaryTypographyProps={{ align: 'justify' }}
                        sx={{pr: 1}}
                    />
                </Grid>
                <Grid item xs={4}>
                    <FormControl>
                        <InputLabel id={`demo-simple-select-${name}`}>{label || 'Max'}</InputLabel>
                        <Select
                            sx={{ width: '90px' }}
                            size='small'
                            label={label || "Max"}
                            labelId={`demo-simple-select-label-${name}`}
                            id={`demo-simple-select-${name}`}
                            value={isExist(`${name}`)[0] ? isExist(`${name}`)[1] : (defaultValue ? defaultValue : values[1].value)}
                            onChange={(e) =>
                                handleChange(`${name}`, `${e.target.value}`)()
                            }
                        >
                            {values?.map((value, index) => (
                                <MenuItem value={value?.value} key={`render-${name}-${index}`}>{value?.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
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
    },
    lastReview: {
        title: 'Last review - date',
        values: [
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
            { value: 4, label: '4' },
            { value: 5, label: '5' },
            { value: 6, label: '6' },
            { value: 7, label: '7' },
            { value: 8, label: '8' },
            { value: 9, label: '9' },
            { value: 10, label: '10' },
        ],
        name: 'date-priority',
        subtitle: 'The bigger the number, the higher chance for the word to be selected when the last review date is far in the past.',
        Icon: LowPriorityIcon,
        noGutter: true,
        defaultValue: 1,
        label: "Factor"
    },
    lastReviewOK: {
        title: 'Last review - result',
        values: [
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
            { value: 4, label: '4' },
            { value: 5, label: '5' },
            { value: 6, label: '6' },
            { value: 7, label: '7' },
            { value: 8, label: '8' },
            { value: 9, label: '9' },
            { value: 10, label: '10' },
        ],
        name: 'result-priority',
        subtitle: 'The bigger the number, the higher chance for the word to be selected when the last review is not OK.',
        Icon: LowPriorityIcon,
        noGutter: true,
        defaultValue: 5,
        label: "Factor"
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
