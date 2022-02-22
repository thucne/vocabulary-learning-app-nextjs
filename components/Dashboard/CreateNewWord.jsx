import React, { useEffect, useState, useRef } from "react";

import Image from 'next/image';

import {
    Grid, TextField, InputLabel, Select, MenuItem,
    FormControl, Dialog, DialogActions,
    DialogContent, DialogTitle, OutlinedInput,
    ToggleButton, ToggleButtonGroup,
    Typography, Box, FormHelperText, Paper, FormLabel,
} from "@mui/material";

import {
    Send as SendIcon,
} from '@mui/icons-material';

import { LoadingButton } from "@mui/lab";
import { useTheme } from '@mui/material/styles';

import Uploader from '@components/Upload';
import LoadingImage from '@components/LoadingImage';
import ListArrayInputs from './FormComponents/ListArrayInputs';
import ListInputs from './FormComponents/ListInputs';

import { IMAGE_ALT, VIP_TYPES } from "@consts";
import { fetcherJWT } from "@actions";
import { useWindowSize, useThisToGetSizesFromRef, getJWT, useDebounce } from '@utils';
import { Fonts, SXs } from "@styles";
import { API } from '@config';

import useSWR from 'swr';

const fetcher = async (...args) => await fetcherJWT(...args);

const initForm = {
    vip: "",
    type: VIP_TYPES[0],
    examples: [],
    vnMeanings: [],
    engMeanings: [],
    pronounce: "",
    synonyms: [],
    antonyms: [],
    clasifyVocab: [],
    public: true,
    tags: [],
}

const initTempInputs = {
    example: "",
    vnMeaning: "",
    engMeaning: "",
    antonym: "",
    synonym: "",
    tag: "",
}

export default function CreateNewWord({ open = false, setOpen }) {
    const theme = useTheme();
    const windowSize = useWindowSize();

    const photoRef = useRef(null);
    const [photo, setPhoto] = useState(null);
    const [isOver10MB, setIsOver10MB] = useState(false);

    const [vocabTypes, setVocabTypes] = useState([]);

    const [form, setForm] = useState(initForm);
    const [temptInput, setTemptInput] = useState(initTempInputs);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const pronounceRef = useRef(null);
    const [shouldFetchPronouce, setShouldFetchPronouce] = useState(false);

    const handleClose = () => {
        // reset all
        setTemptInput(initTempInputs);
        setForm(initForm);
        setPhoto(null);
        setErrors({});
        setLoading(false);

        setOpen(false);
    };

    // get types
    useSWR(getJWT() ? `${API}/api/type2s` : null, fetcher, {
        onSuccess: (data) => {
            const raw = data?.data;
            const types = raw?.sort((a, b) => a?.id - b?.id).map(item => ({
                value: item?.attributes?.name,
                id: item?.id
            }));

            setVocabTypes(types);
        }
    });

    useEffect(() => {
        const loop = setInterval(() => {
            if (!photo && window) {
                setPhoto(new FormData());
                clearInterval(loop);
            }
        }, 100);

        return () => clearInterval(loop);
    }, [photo]);

    useDebounce(form.vip, () => handleFetchPronouce(), 2000);

    const handleFetchPronouce = async () => {
        if (!form.vip) {
            setErrors((state) => ({
                ...state,
                pronounce: "",
            }));
            setForm((form) => ({ ...form, pronounce: "", audio: "" }));
            return;
        }
        if (shouldFetchPronouce) {
            try {
                const res = await fetch(
                    `https://api.dictionaryapi.dev/api/v2/entries/en/${form.vip}`
                );
                const data = await res.json();

                if (!data.message) {
                    const { text, audio } = data[0].phonetics.find((item) => item.audio && item.text);
                    
                    setForm((form) => ({ ...form, pronounce: text, audio: audio }));
                    setErrors((state) => ({ ...state, pronounce: "" }));

                    pronounceRef.current.focus();
                } else {
                    setErrors((state) => ({
                        ...state,
                        pronounce: "Phonetics not found",
                    }));
                    setForm((form) => ({ ...form, pronounce: "", audio: "" }));
                }
            } catch (e) {
                setErrors((state) => ({
                    ...state,
                    pronounce: "Phonetics not found",
                }));
                setForm((form) => ({ ...form, pronounce: "", audio: "" }));
            }
        }
    };

    const photoSizes = useThisToGetSizesFromRef(
        photoRef,
        {
            revalidate: 250,
            falseCondition: (data) => data.width !== 0
        }
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        let formData = new FormData();

        // prepare object
        const data = {
            vip: form.vip,
            type1: form.type,
            type2: form.type === "vocab"
                ? form.clasifyVocab.map((item) => {
                    const findItem = vocabTypes.find(each => each.value === item);
                    return vocabTypes.indexOf(findItem)
                })
                : null,
            examples: form.examples,
            pronounce: form.pronounce,
            meanings: { english: form.engMeanings, vietnamese: form.vnMeanings },
            synonyms: form.synonyms.join(","),
            antonyms: form.antonyms.join(","),
            tags: form.tags.join(","),
            public: form.public,
        }

        formData.append("data", JSON.stringify(data));
        formData.append("files.illustration", photo?.get('illustration'));

        let temp = {};
        for (let pair of formData.entries()) {
            temp[pair[0]] = pair[1];
        }

        console.table(temp);
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

    const canSubmit = () =>
        (
            form.vip?.length
            && form.examples?.length
            && (form.vnMeanings?.length || form.engMeanings?.length)
            && form.tags?.length
            && !errors?.vip.error?.length
            && !errors?.examples?.length
            && !errors?.meanings?.length
            && !errors?.tags?.length
            && !isOver10MB
        ) ?? false;

    const checkInputCriteria = (e, name) => {
        let error = {};
        switch (name) {
            case "engMeanings", "vnMeanings":
                error = (!e.target.value?.length && !form.vnMeanings.length && !form.engMeanings.length)
                    ? "At least one meaning in Vietnamese (or English)"
                    : "";
                setErrors((state) => ({ ...state, ["meanings"]: error }));
                return;
            default:
                error = e.target.value?.length
                    ? ""
                    : "This field is required";
                setErrors((state) => ({
                    ...state,
                    [name]: error,
                }));
        }
    };

    const handleVocabTypesChange = (e) => {
        const { target: { value } } = e;
        setForm((state) => ({
            ...state,
            ["clasifyVocab"]: typeof value === "string" ? value.split(",") : value,
        }));
    };

    const listInputProps = {
        temptInput,
        handleChangeTemptInput,
        checkInputCriteria,
        clearTemptInputField,
        addToFormState
    }

    const gridForm = () => (
        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
            <Box component="form" noValidate onSubmit={handleSubmit}>
                <Grid container>

                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label="Word"
                            id="word"
                            size="small"
                            margin="dense"
                            error={errors?.vip?.length > 0}
                            helperText={errors?.vip || "A vocabulary, idiom or phrase"}
                            onChange={(e) => {
                                handleChangeValue(e, "vip");
                                checkInputCriteria(e, "vip");
                                setShouldFetchPronouce(true);
                            }}
                        />
                    </Grid>

                    <Grid item xs={6} pr={0.5}>
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
                                {VIP_TYPES.map((type, index) => (
                                    <MenuItem key={`${type}-${index}`} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>Vocab, idiom or phrase</FormHelperText>
                        </FormControl>
                    </Grid>

                    {form.type === "vocab" && (
                        <Grid item xs={6} pl={0.5}>
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
                                    {vocabTypes?.map(item => item.value)?.map((name, index) => (
                                        <MenuItem key={`${name}-type2-${index}`} value={name}>
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
                            inputRef={pronounceRef}
                            label="Pronounce"
                            id="pronounce"
                            size="small"
                            margin="dense"
                            multiline
                            error={errors?.pronounce?.length > 0}
                            helperText={errors?.pronounce || "Optional"}
                            value={form.pronounce}
                            onChange={(e) => {
                                handleChangeValue(e, "pronounce");
                                checkInputCriteria(e, "pronounce");
                            }}
                        />
                    </Grid>

                    <ListArrayInputs {...elementsListProps(form, handleDeleteItem).examples} />
                    <ListInputs {...elementsInputProps(errors, listInputProps).examples} />

                    <ListArrayInputs {...elementsListProps(form, handleDeleteItem).vietnamese} />
                    <ListInputs {...elementsInputProps(errors, listInputProps).vietnamese} />

                    <ListArrayInputs {...elementsListProps(form, handleDeleteItem).english} />
                    <ListInputs {...elementsInputProps(errors, listInputProps).english} />

                    <ListArrayInputs {...elementsListProps(form, handleDeleteItem).antonyms} />
                    <ListInputs {...elementsInputProps(errors, listInputProps).antonyms} />

                    <ListArrayInputs {...elementsListProps(form, handleDeleteItem).synonyms} />
                    <ListInputs {...elementsInputProps(errors, listInputProps).synonyms} />

                    <ListArrayInputs {...elementsListProps(form, handleDeleteItem).tags} />
                    <ListInputs {...elementsInputProps(errors, listInputProps).tags} />

                    <Grid item xs={12} mt={1} ref={photoRef}>
                        <FormControl fullWidth error={isOver10MB}>
                            <FormLabel>Illustration</FormLabel>
                            <Paper variant='outlined' sx={{
                                position: 'relative',
                                height: photoSizes?.width,
                                overflow: 'hidden',
                                borderRadius: '10px'
                            }}>
                                <Uploader
                                    containerProps={{
                                        sx: {
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            zIndex: 2,
                                            width: '100%',
                                            height: '100%',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        },
                                        container: true
                                    }}
                                    stylesImage={{
                                        style: {
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                        }
                                    }}
                                    stylesImage2={{
                                        style: {
                                            width: '100%',
                                            height: '100%',
                                            position: 'relative'
                                        }
                                    }}
                                    setData={(data, base64) => {
                                        photo?.set('illustration', data);
                                        photo?.set('photo', base64);
                                        setPhoto(photo);
                                    }}
                                    data={Boolean(photo?.get('photo')) ? photo?.get('photo') : null}
                                    CustomIcon={UploadIconIllustration}
                                    showIconUpload={Boolean(photo?.get('photo')) ? false : true}
                                    getFileSize={(data) => setIsOver10MB(Math.ceil(data / 1024 / 1024) > 10)}
                                    isFormik
                                    clickWhole
                                />
                            </Paper>
                            <FormHelperText>
                                {isOver10MB
                                    ? 'File size is over 10MB'
                                    : 'Should be in square shape. MUST smaller 10MB in size.'}
                            </FormHelperText>
                        </FormControl>
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
                fullScreen={windowSize?.width < theme.breakpoints.values.sm ? true : false}
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

                <DialogActions sx={{
                    justifyContent: 'space-between',
                }}>
                    <div>
                        <ToggleButtonGroup
                            size="small"
                            color="primary"
                            value={form?.public?.toString()}
                            exclusive
                            onChange={(e) =>
                                setForm((state) => ({
                                    ...state,
                                    ["public"]: e.target.value === "true",
                                }))
                            }
                        >
                            <ToggleButton value="false" sx={SXs.TOGGLE_BUTTON_STYLES}>Private</ToggleButton>
                            <ToggleButton value="true" sx={SXs.TOGGLE_BUTTON_STYLES}>Public</ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    <div>
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
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );
}

const UploadIconIllustration = () => {
    return <LoadingImage
        src={IMAGE_ALT}
        alt="Illustration"
        objectFit='contain'
        priority={true}
        draggable={false}
        width={200}
        height={200}
        bgColor="transparent"
    />
}

const elementsInputProps = (errors, others) => ({
    examples: {
        temptField: "example",
        formField: "examples",
        helperText: "At least one example",
        label: "Examples",
        error: errors?.examples,
        required: true,
        ...others
    },
    vietnamese: {
        temptField: "vnMeaning",
        formField: "vnMeanings",
        helperText: "At least one meaning in total (English + Vietnamese)",
        label: "Vietnamese",
        error: errors?.meanings,
        required: true,
        ...others
    },
    english: {
        temptField: "engMeaning",
        formField: "engMeanings",
        helperText: "At least one meaning in total (English + Vietnamese)",
        label: "English",
        error: errors?.meanings,
        required: true,
        ...others
    },
    antonyms: {
        temptField: "antonym",
        formField: "antonyms",
        label: "Antonyms",
        ...others
    },
    synonyms: {
        temptField: "synonym",
        formField: "synonyms",
        label: "Synonyms",
        ...others
    },
    tags: {
        temptField: "tag",
        formField: "tags",
        error: errors?.tags,
        label: "Tags",
        helperText: "At least one tag",
        ...others
    }
});

const elementsListProps = (form, handleDeleteItem) => ({
    examples: {
        formField: "examples",
        label: "Examples",
        form, handleDeleteItem
    },
    vietnamese: {
        formField: "vnMeanings",
        label: "Vietnamese",
        form, handleDeleteItem
    },
    english: {
        formField: "engMeanings",
        label: "English",
        form, handleDeleteItem
    },
    antonyms: {
        formField: "antonyms",
        label: "Antonyms",
        form, handleDeleteItem
    },
    synonyms: {
        formField: "synonyms",
        label: "Synonyms",
        form, handleDeleteItem
    },
    tags: {
        formField: "tags",
        label: "Tags",
        form, handleDeleteItem
    }
})