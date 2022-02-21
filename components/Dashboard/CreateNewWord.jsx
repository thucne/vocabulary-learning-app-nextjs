import React, { useEffect, useState } from "react";

import Image from 'next/image';

import {
    Grid, TextField, InputLabel, Select, MenuItem,
    FormControl, IconButton, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle, OutlinedInput,
    Chip, ToggleButton, ToggleButtonGroup, FormGroup,
    FormControlLabel, Button, Switch, Typography,
    Box, FormHelperText
} from "@mui/material";

import {
    RemoveCircle as RemoveCircleIcon,
    Add as AddIcon,
    Send as SendIcon
} from '@mui/icons-material';

import { LoadingButton } from "@mui/lab";

import { useWindowSize } from '@utils';
import { Fonts, SXs } from "@styles";

import { useTheme } from '@mui/material/styles';

const style = {
    width: "100%",
    bgcolor: "background.paper",
};

const vipTypes = ["vocab", "idiom", "phrase"];
const vocabTypes = ["noun", "verb", "adverb", "adjective", "other"];

export default function CreateNewWord({ open, setOpen }) {
    const theme = useTheme();
    const windowSize = useWindowSize();

    const [form, setForm] = useState({
        vip: "",
        type: vipTypes[0],
        examples: [],
        vnMeanings: [],
        engMeanings: [],
        pronounce: "",
        synonyms: [],
        antonyms: [],
        clasifyVocab: [],
        public: false,
        tags: [],
    });

    const [temptInput, setTemptInput] = useState({
        example: "",
        vnMeaning: "",
        engMeaning: "",
        antonym: "",
        synonym: "",
        tag: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = (e) => {
        e.preventDefault()
        let formData = new FormData();
        formData.append("vip", form.vip);
        formData.append("type1", form.type);
        formData.append(
            "type2",
            form.type == "vocab"
                ? form.clasifyVocab.map((item, idnex) => vocabTypes.indexOf(item))
                : [1, 2, 3, 4, 5]
        );
        formData.append("examples", form.examples);
        formData.append("pronounce", form.pronounce);
        formData.append("meanings", {
            english: form.engMeanings,
            vietnamese: form.vnMeanings,
        });
        formData.append("synonyms", form.synonyms.join(","));
        formData.append("antonyms", form.antonyms.join(","));
        formData.append("tags", form.tags.join(","));
        formData.append("public", form.public);

    };

    const handleChangeValue = (e, name) => {
        setForm((state) => ({ ...state, [name]: e.target.value }));
    };

    const handleChangeTemptInput = (e, name) => {
        setTemptInput((state) => ({ ...state, [name]: e.target.value }));
    };

    const clearTemptInputField = (name) =>
        setTemptInput((state) => ({ ...state, [name]: "" }));

    const handleDeleteItem = (field, index) => {
        setForm((state) => ({
            ...state,
            [field]: state[field].filter((item, i) => i !== index),
        }));
    };

    const addToFormState = (e, value, formField) => {
        e.preventDefault();
        if (temptInput[value]) {
            setForm((state) => ({
                ...state,
                [formField]: [...state[formField], temptInput[value]],
            }));
        }
    };
    const handleUploadImage = (e) => {
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader();

            reader.onload = function (e) {
                setForm((state) => ({ ...state, illustration: e.target.result }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const canSubmit = () =>
        (form.vip.length &&
            form.examples.length &&
            (form.vnMeanings.length || form.engMeanings) &&
            form.tags.length &&
            !errors?.vip.error &&
            !errors?.examples?.error &&
            !errors?.meanings?.error &&
            !errors?.tags?.error) ??
        false;

    const checkInputCriteria = (e, name) => {
        switch (name) {
            case "engMeanings":
                var error = {};
                if (!(e.target.value || form.vnMeanings.length)) {
                    error = {
                        error: true,
                        message: "at least one meaning in Vietnamese or English",
                    };
                }
                setErrors((state) => ({ ...state, ["meanings"]: error }));
                return;
            case "vnMeanings":
                var error = {};
                if (!(e.target.value || form.engMeanings.length)) {
                    error = {
                        error: true,
                        message: "at least one meaning in Vietnamese or English",
                    };
                }
                setErrors((state) => ({ ...state, ["meanings"]: error }));
                return;
            default:
                setErrors((state) => ({
                    ...state,
                    [name]: e.target.value
                        ? {}
                        : { error: true, message: "This is required field" },
                }));
        }
    };

    const handleVocabTypesChange = (e) => {
        const {
            target: { value },
        } = e;
        setForm((state) => ({
            ...state,
            ["clasifyVocab"]: typeof value === "string" ? value.split(",") : value,
        }));
    };

    const InputArrayField = ({
        temptField,
        formField,
        error = false,
        helperText = "Optional",
        label,
    }) => (
        <React.Fragment>
            <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "start", width: "100%" }}>
                    <TextField
                        fullWidth
                        label={label}
                        multiline
                        size="small"
                        value={temptInput[temptField]}
                        error={error}
                        helperText={helperText}
                        sx={{ marginRight: "10px" }}
                        onChange={(e) => {
                            handleChangeTemptInput(e, temptField);
                            checkInputCriteria(e, formField);
                        }}
                    />

                    <Button
                        variant="contained"
                        sx={{ height: "40px" }}
                        onClick={(e) => {
                            addToFormState(e, temptField, formField);
                            clearTemptInputField(temptField);
                        }}
                    >
                        Add
                    </Button>
                </Box>
            </Grid>
        </React.Fragment>
    );

    const ListContent = ({ formField, label }) => (
        <Grid container>
            {form[formField].length > 0 && (
                <Grid item xs={12}>
                    <Typography sx={{ fontSize: Fonts.FS_18, ml: 2, my: 3 }}>
                        List of {label}
                    </Typography>
                    <Grid
                        container
                        spacing={2}
                        sx={{ maxHeight: "150px", overflowY: "auto" }}
                    >
                        {form[formField]?.map((syn, index) => (
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                                key={index}
                            >
                                <Box
                                    sx={{
                                        pl: 5,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "100%",
                                    }}
                                >
                                    <Typography gutterBottom>{syn}</Typography>
                                    <IconButton
                                        onClick={() => {
                                            handleDeleteItem(formField, index);
                                        }}
                                    >
                                        <RemoveCircleIcon />
                                    </IconButton>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            )}
        </Grid>
    );

    const gridForm = () => (
        <Box sx={style}>
            <Box component="form" noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label="Word"
                            id="word"
                            size="small"
                            margin="dense"
                            error={errors?.vip?.error}
                            helperText={
                                errors?.vip?.message || "A vocabulary, idiom or phrase"
                            }
                            onChange={(e) => {
                                handleChangeValue(e, "vip");
                                checkInputCriteria(e, "vip");
                            }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth margin="dense" required>
                            <InputLabel id="demo-multiple-chip-label">Type</InputLabel>
                            <Select
                                size="small"
                                margin="dense"
                                id="demo-simple-select"
                                value={form.type}
                                label="Type"
                                onChange={(e) => {
                                    handleChangeValue(e, "type");
                                }}
                            >
                                {vipTypes.map((type, index) => (
                                    <MenuItem key={`${type}-${index}`} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {form.type === "vocab" && (
                        <Grid item xs={6}>
                            <FormControl fullWidth margin="dense" size="small" required>
                                <InputLabel id="demo-multiple-chip-label">
                                    Classify
                                </InputLabel>
                                <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
                                    multiple
                                    value={form.clasifyVocab}
                                    onChange={handleVocabTypesChange}
                                    label="Classify"
                                    input={
                                        <OutlinedInput
                                            id="select-multiple-chip"
                                            label="Classify"
                                        />
                                    }
                                >
                                    {vocabTypes.map((name) => (
                                        <MenuItem key={name} value={name}>
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Multi-selection</FormHelperText>
                            </FormControl>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Pronounce"
                            id="pronounce"
                            size="small"
                            margin="dense"
                            multiline
                            //   error={errors?.pronounce?.error}
                            helperText={"Optional"}
                            onChange={(e) => {
                                handleChangeValue(e, "pronounce");
                                checkInputCriteria(e, "pronounce");
                            }}
                        />
                    </Grid>

                    {ListContent({ formField: "examples", label: "Examples" })}
                    {InputArrayField({
                        temptField: "example",
                        formField: "examples",
                        helperText: "At least one example",
                        label: "Examples",
                        error: errors?.examples?.error,
                    })}

                    {ListContent({ formField: "vnMeanings", label: "Vietnamese" })}
                    {InputArrayField({
                        temptField: "vnMeaning",
                        formField: "vnMeanings",
                        helperText: "At least one meaning in Vietnamese or English",
                        label: "Vietnamese",
                        error: errors?.meanings?.error,
                    })}

                    {ListContent({ formField: "engMeanings", label: "English" })}
                    {InputArrayField({
                        temptField: "engMeaning",
                        formField: "engMeanings",
                        helperText: "At least one meaning in Vietnamese or English",
                        label: "English",
                        error: errors?.meanings?.error,
                    })}

                    {ListContent({ formField: "antonyms", label: "Antonyms" })}
                    {InputArrayField({
                        temptField: "antonym",
                        formField: "antonyms",
                        label: "Antonyms",
                    })}

                    {ListContent({ formField: "synonyms", label: "Synonyms" })}
                    {InputArrayField({
                        temptField: "synonym",
                        formField: "synonyms",
                        label: "Synonyms",
                    })}

                    {ListContent({ formField: "tags", label: "Tags" })}
                    {InputArrayField({
                        temptField: "tag",
                        formField: "tags",
                        error: errors?.tags?.error,
                        label: "Tags",
                        helperText: "At least one tag",
                    })}

                    <Grid item xs={12}>
                        <label htmlFor="image-upload">
                            <IconButton variant="contained" component="label">
                                <AddIcon disabled />
                                <input
                                    id="image-upload"
                                    hidden
                                    type="file"
                                    onChange={handleUploadImage}
                                />
                            </IconButton>
                        </label>

                        <FormGroup margin="dense">
                            <FormControlLabel
                                label="Public"
                                control={
                                    <Switch
                                        checked={form.public}
                                        onChange={(e) =>
                                            setForm((state) => ({
                                                ...state,
                                                ["public"]: e.target.checked,
                                            }))
                                        }
                                    />
                                }
                            />
                        </FormGroup>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                scroll="paper"
                maxWidth="xs"
                onSubmit={handleSubmit}
            >
                <DialogTitle id="scroll-dialog-title" sx={{
                    py: 1, display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    <Image
                        src="/logo.icon.svg"
                        width={30}
                        height={30}
                        alt="Logo"
                    />
                    <Typography
                        id="modal-modal-title"
                        align="center"
                        sx={{ fontSize: [Fonts.FS_22], ml: 1 }}
                    >
                        New Word
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>{gridForm()}</DialogContent>
                <DialogActions>
                    <LoadingButton sx={SXs.LOADING_BUTTON_STYLES} onClick={handleClose}>Cancel</LoadingButton>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        loadingPosition="start"
                        sx={SXs.LOADING_BUTTON_STYLES}
                        disabled={!canSubmit()}
                        loading={loading}
                        onClick={handleSubmit}
                        startIcon={<SendIcon />}
                    >
                        Create
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}
