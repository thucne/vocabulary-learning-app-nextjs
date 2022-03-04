import React, { useEffect, useState, useMemo, useRef } from "react";

import {
    List, ListItem, ListItemIcon, ListItemText, ListSubheader,
    Switch, Container, Grid, Typography, Divider,
    Collapse, FormControl, InputLabel, Select,
    MenuItem, IconButton, Tooltip, Paper,
    TextField, Alert
} from "@mui/material";

import {
    AutoAwesome as AutoAwesomeIcon,
    SubdirectoryArrowRight as SubdirectoryArrowRightIcon,
    Refresh as RefreshIcon,
    Public as PublicIcon,
    Lock as LockIcon,
    AutoStories as AutoStoriesIcon,
    Timelapse as TimelapseIcon,
    LowPriority as LowPriorityIcon,
    Crop as CropIcon
} from "@mui/icons-material";

import { Colors, Fonts, SXs, Props } from "@styles";
import { toggleSettings, useSettings, defaultSettings } from "@utils";
import { updateSettings } from '@actions';
import { RECAPTCHA } from "@config";
import * as t from '@consts';

import { debounce } from "lodash";
import { useSelector, useDispatch } from "react-redux";

import LoadingImage from '@components/LoadingImage';

export default function SwitchListSecondary() {
    const dispatch = useDispatch();
    const elRefs = useRef([]);

    const userData = useSelector((state) => state?.userData);

    const checked = useSettings(userData, true);
    const handledChecked = useSettings(userData);

    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        setSyncing(false);
        if (elRefs?.current[0] && elRefs?.current[1]) {
            elRefs.current[0].value = handledChecked.wordsPerPractice;
            elRefs.current[1].value = handledChecked.practicesPerDay;
        }
    }, [checked, handledChecked.practicesPerDay, handledChecked.wordsPerPractice]);

    const callBackFunction = (dataToUpdate) => {
        if (window && window.adHocFetch && window.grecaptcha && !syncing) {
            grecaptcha.ready(function () {
                grecaptcha
                    .execute(`${RECAPTCHA}`, { action: "vip_authentication" })
                    .then(function (token) {

                        const formData = new FormData();

                        let prepareObject = {
                            token,
                            settings: dataToUpdate,
                        }

                        formData.append("data", JSON.stringify(prepareObject));

                        adHocFetch({
                            dispatch,
                            action: updateSettings(JSON.parse(localStorage.getItem("vip-user"))?.id, formData),
                            snackbarMessageOnSuccess: "Update successfully!",
                            onFinally: () => setSyncing(true),
                        })

                    });
            });
        }
        if (syncing) {
            dispatch({ type: t.SHOW_SNACKBAR, payload: { message: "Syncing... Please wait", type: "info" } })
        }
    }

    const handleChange = (value, selectionValue) => async () =>
        await toggleSettings(value, selectionValue, checked, callBackFunction);

    const getItem = (name) => checked?.find((item) => item.includes(`${name}`));

    const isExist = (name) => {
        const temp = getItem(name);
        const isTheirASlash = temp?.includes("/");
        return [
            temp !== undefined,
            isTheirASlash ? temp.split("/").slice(-1)[0] : temp,
        ];
    };

    const handleReset = () => {
        callBackFunction([]);
    };

    return (
        <Container maxWidth="lg">
            <Grid container>
                <Grid item xs={12} sm={6} mt={[3, 4, 5]}>
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: Fonts.FW_500 }}
                    >
                        Settings
                        <Tooltip title="Reset settings">
                            <IconButton
                                sx={{ ...SXs.MUI_NAV_ICON_BUTTON, ml: 2 }}
                                onClick={handleReset}
                            >
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} mt={[3, 4, 5]} display={[syncing ? "block" : "none", "block"]}>
                    <Alert variant="outlined" severity="info" sx={{
                        opacity: syncing ? 1 : 0,
                        '&.MuiPaper-root': { borderRadius: '10px' }
                    }}>
                        Syncing... Please wait to see the changes
                    </Alert>
                </Grid>
                <Divider sx={{ my: 2, width: '100%' }} />

                <Grid item xs={12} sm={6} md={4} my={1} px={[0, 0.5]}>
                    <Paper variant="outlined" sx={gridSX}>
                        <List
                            sx={{ width: "100%", mt: 0 }}
                            subheader={
                                <ListHeadings
                                    title="Helper"
                                    subtitle="This will help you fill out most of the fields. Note that sometimes it will fail."
                                />
                            }
                        >
                            <ListItem>
                                <ListItemIcon>
                                    <AutoAwesomeIcon />
                                </ListItemIcon>
                                <ListItemText id="switch-list-label-wifi" primary="Auto fill" />
                                <Switch
                                    edge="end"
                                    onChange={(e, value) =>
                                        handleChange("autoFill", `${value.toString()}`)()
                                    }
                                    checked={
                                        isExist("autoFill")[0]
                                            ? isExist("autoFill")[1] === "true"
                                            : true
                                    }
                                    inputProps={{
                                        "aria-labelledby": "switch-list-label-wifi",
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
                        </List>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={4} my={1} px={[0, 0.5]}>
                    <Paper variant="outlined" sx={gridSX}>
                        <List
                            sx={{ width: "100%", mt: 0 }}
                            subheader={
                                <ListHeadings
                                    title="Practice"
                                    subtitle="Set level of practice"
                                />
                            }
                        >
                            <PractiseInputNumber
                                handleChange={handleChange}
                                isExist={isExist}
                                name="wordsPerPractice"
                                title="Words per practice"
                                subtitle="(10-50)"
                                Icon={AutoStoriesIcon}
                                min={10}
                                max={50}
                                defaultValue={defaultSettings?.wordsPerPractice}
                                elRefs={elRefs}
                                index={0}
                            />
                            <PractiseInputNumber
                                handleChange={handleChange}
                                isExist={isExist}
                                name="practicesPerDay"
                                title="Practice per day"
                                subtitle="(1-50)"
                                Icon={TimelapseIcon}
                                min={1}
                                max={50}
                                defaultValue={defaultSettings?.practicesPerDay}
                                elRefs={elRefs}
                                index={1}
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

                <Grid item xs={12} sm={6} md={4} my={1} px={[0, 0.5]}>
                    <Paper variant="outlined" sx={gridSX}>
                        <List
                            sx={{ width: "100%", mt: 0 }}
                            subheader={<ListHeadings title="Publicity" />}
                        >
                            <ListItem>
                                <ListItemIcon>
                                    {(
                                        isExist("publicWords")[0]
                                            ? isExist("publicWords")[1] === "true"
                                            : true
                                    ) ? (
                                        <PublicIcon />
                                    ) : (
                                        <LockIcon />
                                    )}
                                </ListItemIcon>
                                <ListItemText
                                    id="switch-list-label-wifi"
                                    primary="Make future words public"
                                />
                                <Switch
                                    edge="end"
                                    onChange={(e, value) =>
                                        handleChange("publicWords", `${value.toString()}`)()
                                    }
                                    checked={
                                        isExist("publicWords")[0]
                                            ? isExist("publicWords")[1] === "true"
                                            : true
                                    }
                                    inputProps={{
                                        "aria-labelledby": "switch-list-label-publicWords",
                                    }}
                                />
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={4} my={1} px={[0, 0.5]}>
                    <Paper variant="outlined" sx={gridSX}>
                        <List subheader={<ListHeadings title="Advanced" />}>
                            <AutoFillLevel
                                handleChange={handleChange}
                                isExist={isExist}
                                {...autoFillLevelsProps.objectFit}
                            />
                            <Grid container {...Props.GCRCC}>
                                <Grid item xs={4} {...Props.GICCC}>
                                    <div style={{ position: "relative", width: 75, height: 75 }}>
                                        <LoadingImage
                                            src="https://res.cloudinary.com/katyperrycbt/image/upload/v1646400989/Screenshot_21_j4fwwg.webp"
                                            alt="Contain Fit"
                                            layout="fill"
                                            draggable={false}
                                            quality={100}
                                        />
                                    </div>
                                    <Typography variant="caption">Contain</Typography>
                                </Grid>
                                <Grid item xs={4} {...Props.GICCC}>
                                    <div style={{ position: "relative", width: 75, height: 75 }}>
                                        <LoadingImage
                                            src="https://res.cloudinary.com/katyperrycbt/image/upload/v1646400989/Screenshot_22_jqyuyn.webp"
                                            alt="Cover Fit"
                                            width={100}
                                            height={100}
                                            draggable={false}
                                            quality={100}
                                        />
                                    </div>
                                    <Typography variant="caption">Cover</Typography>
                                </Grid>
                                <Grid item xs={4} {...Props.GICCC}>
                                    <div style={{ position: "relative", width: 75, height: 75 }}>
                                        <LoadingImage
                                            src="https://res.cloudinary.com/katyperrycbt/image/upload/v1646400989/Screenshot_23_msdluj.webp"
                                            alt="Fill Fit"
                                            width={100}
                                            height={100}
                                            draggable={false}
                                            quality={100}
                                        />
                                    </div>
                                    <Typography variant="caption">Fill</Typography>
                                </Grid>
                            </Grid>
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

const PractiseInputNumber = ({
    Icon,
    name,
    title,
    subtitle,
    handleChange,
    isExist,
    max,
    min,
    defaultValue,
    elRefs,
    index
}) => {
    const debounceFixValue = useMemo(
        () =>
            debounce((e) => {
                if (Number(e.target.value) > max) {
                    e.target.value = max;
                }
                if (Number(e.target.value) < min) {
                    e.target.value = min;
                }

                handleChange(`${name}`, `${e.target.value}`)();
            }, 500),
        [max, min, handleChange, name]
    );

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
                sx={{ maxWidth: "90px" }}
                fullWidth
                size="small"
                id={`outlined-number-${name}`}
                label="Max"
                type="number"
                defaultValue={defaultValue}
                onChange={(e) => {
                    debounceFixValue(e);
                    // handleChange(`${name}`, `${e.target.value}`)();
                }}
                inputRef={elRefs?.current ? el => elRefs.current[index] = el : null}
            />
        </ListItem>
    );
};

const ListHeadings = ({ title, subtitle }) => [
    <Typography
        sx={{ ml: 2, mt: 2 }}
        variant="h6"
        component="div"
        key={`heading-list-${title}`}
    >
        {title}
    </Typography>,
    <ListSubheader
        sx={{
            bgcolor: (theme) => theme.palette.paper_grey.main,
            lineHeight: "normal",
            my: 1,
        }}
        key={`sub-heading-list-${title}`}
    >
        {subtitle}
    </ListSubheader>,
];

const AutoFillLevel = ({
    handleChange,
    name,
    values,
    title,
    isExist,
    Icon,
    noGutter,
    label,
    defaultValue,
    subtitle,
}) => (
    <Collapse
        in={isExist("autoFill")[0] ? isExist("autoFill")[1] === "true" : true}
        timeout="auto"
        unmountOnExit
    >
        <ListItem>
            <ListItemIcon sx={{ pl: noGutter ? 0 : 2 }}>
                {Icon ? <Icon /> : <SubdirectoryArrowRightIcon />}
            </ListItemIcon>
            <Grid container direction="row" alignItems="center">
                <Grid item xs={8}>
                    <ListItemText
                        id={`switch-list-label-${name}`}
                        primary={title}
                        secondary={subtitle}
                        secondaryTypographyProps={{ align: "justify" }}
                        sx={{ pr: 1, width: "100%" }}
                    />
                </Grid>
                <Grid item xs={4} display="flex" justifyContent="flex-end">
                    <FormControl fullWidth sx={{ maxWidth: "90px" }}>
                        <InputLabel id={`demo-simple-select-${name}`}>
                            {label || "Max"}
                        </InputLabel>
                        <Select
                            size="small"
                            label={label || "Max"}
                            labelId={`demo-simple-select-label-${name}`}
                            id={`demo-simple-select-${name}`}
                            value={
                                isExist(`${name}`)[0]
                                    ? isExist(`${name}`)[1]
                                    : defaultValue
                                        ? defaultValue
                                        : values[1].value
                            }
                            onChange={(e) => handleChange(`${name}`, `${e.target.value}`)()}
                        >
                            {values?.map((value, index) => (
                                <MenuItem value={value?.value} key={`render-${name}-${index}`}>
                                    {value?.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </ListItem>
    </Collapse>
);

const gridSX = {
    overflow: "hidden",
    bgcolor: (theme) => theme.palette.paper_grey.main,
    borderRadius: "10px",
    ":hover": {
        boxShadow: (theme) => theme.shadows[3],
    },
};

const autoFillLevelsProps = {
    examples: {
        title: "Examples",
        values: [
            { value: 0, label: "None" },
            { value: 1, label: "1" },
            { value: 2, label: "2" },
            { value: 3, label: "3" },
            { value: 4, label: "4" },
            { value: 5, label: "5" },
            { value: 10, label: "10" },
            { value: 100, label: "All" },
        ],
        name: "examples",
    },
    english: {
        title: "English",
        values: [
            { value: 0, label: "None" },
            { value: 1, label: "1" },
            { value: 2, label: "2" },
            { value: 3, label: "3" },
            { value: 4, label: "4" },
            { value: 5, label: "5" },
            { value: 10, label: "10" },
            { value: 100, label: "All" },
        ],
        name: "english",
    },
    lastReview: {
        title: "Last review - date",
        values: [
            { value: 1, label: "1" },
            { value: 2, label: "2" },
            { value: 3, label: "3" },
            { value: 4, label: "4" },
            { value: 5, label: "5" },
            { value: 6, label: "6" },
            { value: 7, label: "7" },
            { value: 8, label: "8" },
            { value: 9, label: "9" },
            { value: 10, label: "10" },
        ],
        name: "lastReview",
        subtitle:
            "The bigger the number, the higher chance for the word to be selected when the last review date is far in the past.",
        Icon: LowPriorityIcon,
        noGutter: true,
        defaultValue: 1,
        label: "Factor",
    },
    lastReviewOK: {
        title: "Last review - result",
        values: [
            { value: 1, label: "1" },
            { value: 2, label: "2" },
            { value: 3, label: "3" },
            { value: 4, label: "4" },
            { value: 5, label: "5" },
            { value: 6, label: "6" },
            { value: 7, label: "7" },
            { value: 8, label: "8" },
            { value: 9, label: "9" },
            { value: 10, label: "10" },
        ],
        name: "lastReviewOK",
        subtitle:
            "The bigger the number, the higher chance for the word to be selected when the last review is not OK.",
        Icon: LowPriorityIcon,
        noGutter: true,
        defaultValue: 5,
        label: "Factor",
    },
    objectFit: {
        title: "Image fit",
        values: [
            { value: "fill", label: "Fill" },
            { value: "contain", label: "Contain" },
            { value: "cover", label: "Cover" },
        ],
        name: "objectFit",
        subtitle: "How the image will be displayed in the grid.",
        Icon: CropIcon,
        defaultValue: "contain",
        label: "Fit"
    }
};
