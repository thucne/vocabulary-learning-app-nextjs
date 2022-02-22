import React, { useEffect, useState, useRef } from "react";

import Image from "next/image";

import {
  Grid,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  OutlinedInput,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  FormGroup,
  FormControlLabel,
  Button,
  Switch,
  Typography,
  Box,
  FormHelperText,
  Paper,
  FormLabel,
  Icon,
} from "@mui/material";

import {
  RemoveCircle as RemoveCircleIcon,
  Add as AddIcon,
  Send as SendIcon,
} from "@mui/icons-material";

import { LoadingButton } from "@mui/lab";

import {
  useWindowSize,
  useThisToGetSizesFromRef,
  useDebounce,
  useFocus,
} from "@utils";
import { Fonts, SXs } from "@styles";

import { useTheme } from "@mui/material/styles";

import Uploader from "@components/Upload";
import LoadingImage from "@components/LoadingImage";
import { IMAGE_ALT } from "@consts";

const style = {
  width: "100%",
  bgcolor: "background.paper",
};

const vipTypes = ["vocab", "idiom", "phrase"];
const vocabTypes = ["noun", "verb", "adverb", "adjective", "other"];

export default function CreateNewWord({ open, setOpen }) {
  const theme = useTheme();
  const windowSize = useWindowSize();
  const photoRef = useRef(null);
  const pronounceRef = useRef(null);
  const [photo, setPhoto] = useState("");
  const photoSizes = useThisToGetSizesFromRef(photoRef, {
    revalidate: 100,
    falseCondition: (data) => data.width !== 0,
  });

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
    audio: "",
  });

  const [temptInput, setTemptInput] = useState({
    example: "",
    vnMeaning: "",
    engMeaning: "",
    antonym: "",
    tag: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useDebounce(form.vip, () => handleFetchPronouce(), 2000);

  const handleFetchPronouce = async () => {
    if (form.vip.length > 0) {
      try {
        const res = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${form.vip}`
        );
        const data = await res.json();

        if (!data.message) {
          const { text, audio } = data[0].phonetics.find((item) => item.audio);
          setForm({ ...form, pronounce: text, audio: audio });
          pronounceRef.current.focus();
        } else {
          setErrors((state) => ({
            ...state,
            pronouce: { error: true, message: "Phonetic not found" },
          }));
          setForm({ ...form, pronounce: "", audio: "" });
        }
      } catch (error) {
        throw error;
      }
    }
  };

  const handleClose = () =>
    setOpen((state) => ({ ...state, newWordModal: false }));

  const handleSubmit = (e) => {
    e.preventDefault();
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

  const inputArrayField = ({
    temptField,
    formField,
    error = false,
    helperText = "Optional",
    label,
    required,
  }) => (
    <React.Fragment>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              width: "100%",
            }}
          >
            <TextField
              required={required}
              fullWidth
              label={label}
              inputRef={pronounceFocus}
              multiline
              size="small"
              margin="dense"
              value={temptInput[temptField]}
              error={error}
              sx={{ marginRight: "10px" }}
              onChange={(e) => {
                handleChangeTemptInput(e, temptField);
                checkInputCriteria(e, formField);
              }}
            />
            <Button
              variant="outlined"
              sx={{ mt: "8px", height: "40px", ...SXs.COMMON_BUTTON_STYLES }}
              onClick={(e) => {
                addToFormState(e, temptField, formField);
                clearTemptInputField(temptField);
              }}
            >
              Add
            </Button>
          </Box>
          <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
      </Grid>
    </React.Fragment>
  );

  const listContent = ({ formField, label }) => (
    <Grid container>
      {form[formField].length > 0 && (
        <Grid item xs={12}>
          <Typography sx={{ fontSize: Fonts.FS_15, fontWeight: Fonts.FW_500 }}>
            {label}
          </Typography>
          <Grid
            container
            sx={{
              borderRadius: "10px",
              overflow: "hidden",
              width: `calc(100% + 8px)`,
            }}
          >
            <div
              style={{
                maxHeight: "150px",
                overflowY: "auto",
                width: `calc(100%)`,
              }}
            >
              {form[formField]?.map((syn, index) => (
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    py: 0.5,
                  }}
                  key={`${index}-${label}`}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Typography
                      sx={{
                        width: "100%",
                        verticalAlign: "middle",
                        textAlign: "left",
                        alignItems: "center",
                        display: "flex",
                        borderRadius: "4px",
                        pl: 1,
                      }}
                    >
                      {syn}
                    </Typography>
                    <IconButton
                      onClick={() => {
                        handleDeleteItem(formField, index);
                      }}
                      sx={{
                        ...SXs.MUI_NAV_ICON_BUTTON,
                        borderRadius: "4px",
                      }}
                    >
                      <RemoveCircleIcon />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </div>
          </Grid>
        </Grid>
      )}
    </Grid>
  );

  const gridForm = () => (
    <Box sx={style}>
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
                {vipTypes.map((type, index) => (
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
                <InputLabel id="demo-multiple-chip-label">Classify</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={form.clasifyVocab}
                  onChange={handleVocabTypesChange}
                  label="Classify"
                  input={
                    <OutlinedInput id="select-multiple-chip" label="Classify" />
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
              inputRef={pronounceRef}
              margin="dense"
              multiline
              value={form.pronounce}
              error={errors?.pronouce?.error}
              helperText={errors.pronouce?.message || "Optional"}
              onChange={(e) => {
                handleChangeValue(e, "pronounce");
                checkInputCriteria(e, "pronounce");
              }}
            />
          </Grid>

          {listContent({ formField: "examples", label: "Examples" })}
          {inputArrayField({
            temptField: "example",
            formField: "examples",
            helperText: "At least one example",
            label: "Examples",
            error: errors?.examples?.error,
            required: true,
          })}

          {listContent({ formField: "vnMeanings", label: "Vietnamese" })}
          {inputArrayField({
            temptField: "vnMeaning",
            formField: "vnMeanings",
            helperText: "At least one Vietnamese or English meaning",
            label: "Vietnamese",
            error: errors?.meanings?.error,
            required: true,
          })}

          {listContent({ formField: "engMeanings", label: "English" })}
          {inputArrayField({
            temptField: "engMeaning",
            formField: "engMeanings",
            helperText: "At least one Vietnamese or English meaning",
            label: "English",
            error: errors?.meanings?.error,
            required: true,
          })}

          {listContent({ formField: "antonyms", label: "Antonyms" })}
          {inputArrayField({
            temptField: "antonym",
            formField: "antonyms",
            label: "Antonyms",
          })}

          {listContent({ formField: "synonyms", label: "Synonyms" })}
          {inputArrayField({
            temptField: "synonym",
            formField: "synonyms",
            label: "Synonyms",
          })}

          {listContent({ formField: "tags", label: "Tags" })}
          {inputArrayField({
            temptField: "tag",
            formField: "tags",
            error: errors?.tags?.error,
            label: "Tags",
            helperText: "At least one tag",
          })}

          <Grid item xs={12} mt={1} ref={photoRef}>
            <FormControl fullWidth>
              <FormLabel>Illustration</FormLabel>
              <Paper
                variant="outlined"
                sx={{
                  position: "relative",
                  height: photoSizes?.width,
                  overflow: "hidden",
                  borderRadius: "10px",
                }}
              >
                <Uploader
                  styles={{
                    sx: {
                      position: "absolute",
                      top: 0,
                      left: 0,
                      zIndex: 2,
                      width: "100%",
                      height: "100%",
                      cursor: "pointer",
                      "&:hover": {
                        filter: photo && "brightness(0.5)",
                      },
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    },
                    container: true,
                  }}
                  stylesImage={{
                    style: {
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    },
                  }}
                  stylesImage2={{
                    style: {
                      width: "100%",
                      height: "100%",
                      position: "relative",
                    },
                  }}
                  setData={setPhoto}
                  data={photo}
                  CustomIcon={UploadIconIllustration}
                  clickWhole
                  showIconUpload={photo?.length === 0}
                />
              </Paper>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            {/* <label htmlFor="image-upload">
                            <IconButton variant="contained" component="label">
                                <AddIcon disabled />
                                <input
                                    id="image-upload"
                                    hidden
                                    type="file"
                                    onChange={handleUploadImage}
                                />
                            </IconButton>
                        </label> */}

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
        fullScreen={
          windowSize?.width < theme.breakpoints.values.sm ? true : false
        }
        onSubmit={handleSubmit}
      >
        <DialogTitle
          id="scroll-dialog-title"
          sx={{
            py: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image src="/logo.icon.svg" width={30} height={30} alt="Logo" />
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
          <LoadingButton sx={SXs.LOADING_BUTTON_STYLES} onClick={handleClose}>
            Cancel
          </LoadingButton>
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

const UploadIconIllustration = () => {
  return (
    <LoadingImage
      src={IMAGE_ALT}
      alt="Illustration"
      objectFit="contain"
      priority={true}
      draggable={false}
      width={200}
      height={200}
      bgColor="transparent"
    />
  );
};
