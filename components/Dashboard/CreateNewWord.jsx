import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { LoadingButton } from "@mui/lab";
import { Send as SendIcon, VideoCameraBackOutlined } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";

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
} from "@mui/material";

import { Fonts } from "@styles";
import { convertString2Array } from "@utils";

const style = {
  width: "100%",
  bgcolor: "background.paper",
};

function getStyles(type, vocabTypes, theme) {
  return {
    fontWeight:
      vocabTypes.indexOf(type) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const vipTypes = ["vocab", "idiom", "phrase"];
const vocabTypes = ["noun", "verb", "adverb", "adjective", "other"];
export default function CreateNewWord({ open, setOpen }) {
  const [form, setForm] = useState({
    vip: "",
    type: vipTypes[0],
    examples: "",
    vnMeanings: "",
    engMeanings: "",
    pronounce: "",
    synonyms:"",
    antonyms:"",
    clasifyVocab: [...vocabTypes],
    public: true,
    tags: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    console.log("asdas", form);
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    var formData = {
      vip: form.vip,
      type1: form.type,
      type2: form.type === "vocab" ? form.clasifyVocab.map(item=>vocabTypes.indexOf(item)) : null,
      examples: convertString2Array(form.examples),
      pronouce:form.pronounce,
      meanings:{
          english:convertString2Array(form.engMeanings),
            vietnamese:convertString2Array(form.vnMeanings)
      },
      synonyms:convertString2Array(form.synonyms),
      antonyms:convertString2Array(form.antonyms),
      tags:form.tags,
      public: form.public
    };
    console.log("submit", { form, formData });
  };

  const handleChangeValue = (e, name) => {
    setForm((state) => ({ ...state, [name]: e.target.value }));
  };

  const handleChangeSelectTypeValue = (e) => {
    setForm((state) => ({ ...state, type: e.target.value }));
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
      form.type.length &&
      form.tags.length &&
      !errors?.vip.error &&
      !errors?.examples?.error &&
      !errors?.meanings?.error &&
      !errors?.tags?.error &&
      !errors?.type?.error) ??
    false;

  const checkInputCriteria = (e, name) => {
    switch (name) {
      case "engMeanings":
        var error = {};
        if (!(e.target.value || form.vnMeanings)) {
          error = {
            error: true,
            message: "at least one meaning in Vietnamese or English",
          };
        }
        setErrors((state) => ({ ...state, ["meanings"]: error }));
        return;
      case "vnMeanings":
        var error = {};
        if (!(e.target.value || form.engMeanings)) {
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

  const gridForm = () => (
    <Box sx={style}>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Word"
              id="word"
              size="small"
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
            <FormControl fullWidth>
              <InputLabel id="demo-multiple-chip-label">Vip type</InputLabel>
              <Select
                size="small"
                id="demo-simple-select"
                value={form.type}
                label="Vip type"
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

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Pronounce"
              id="pronounce"
              size="small"
              error={errors?.pronounce?.error}
              helperText={errors?.pronounce?.message}
              onChange={(e) => {
                handleChangeValue(e, "pronounce");
                checkInputCriteria(e, "pronounce");
              }}
            />
          </Grid>
          {form.type === "vocab" && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-multiple-chip-label">
                  Classify vocab
                </InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={form.clasifyVocab}
                  onChange={handleVocabTypesChange}
                  fullWidth
                  label="Classify vocab"
                  input={
                    <OutlinedInput
                      id="select-multiple-chip"
                      label="Classify vocab"
                    />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {vocabTypes.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Examples"
              multiline
              size="small"
              error={errors?.examples?.error}
              helperText={errors?.examples?.message || "At least one example"}
              onChange={(e) => {
                handleChangeValue(e, "examples");
                checkInputCriteria(e, "examples");
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="VN-meanings"
              multiline
              size="small"
              error={errors?.meanings?.error}
              helperText={
                errors?.meanings?.message ||
                "At least one meaning in Vietnamese or English"
              }
              onChange={(e) => {
                handleChangeValue(e, "vnMeanings");
                checkInputCriteria(e, "vnMeanings");
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Eng-meanings"
              multiline
              size="small"
              error={errors?.meanings?.error}
              helperText={
                errors?.meanings?.message ||
                "At least one meaning in Vietnamese or English"
              }
              onChange={(e) => {
                handleChangeValue(e, "engMeanings");
                checkInputCriteria(e, "engMeanings");
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Antonyms"
              multiline
              size="small"
              onChange={(e) => {
                handleChangeValue(e, "antonyms");
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Synonyms"
              multiline
              size="small"
              onChange={(e) => {
                handleChangeValue(e, "synonyms");
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tags"
              multiline
              size="Tags"
              onChange={(e) => {
                handleChangeValue(e, "tags");
              }}
            />
          </Grid>
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

            <Button variant={form.public ? "contained" : "outlined"} onClick={()=>{
                setForm((state)=>({...state,["public"]:!state.public}))
            }}>
                Public
                </Button>
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
        maxWidth="md"
        onSubmit={handleSubmit}
      >
        <DialogTitle id="scroll-dialog-title">
          <Typography
            id="modal-modal-title"
            component="h2"
            sx={{ fontSize: [Fonts.FS_20, Fonts.FS_34] }}
          >
            Create your own word!
          </Typography>
        </DialogTitle>
        <DialogContent dividers>{gridForm()}</DialogContent>
        <DialogActions>
          <LoadingButton onClick={handleClose}>Cancel</LoadingButton>

          <LoadingButton
            type="submit"
            variant="contained"
            loadingPosition="start"
            sx={{
              "&.MuiLoadingButton-root": {
                textTransform: "none !important",
              },
            }}
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
