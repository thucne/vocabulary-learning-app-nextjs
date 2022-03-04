import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import Image from "next/image";

import {
    Button, IconButton, TextField,
    Typography, Grid, Container, Paper,
    FormControl, FormHelperText,
    ListItemButton, ListItemText,
    ListItem, InputLabel, Input, InputAdornment
} from "@mui/material";

import {
    EditRounded as EditIcon,
    CancelRounded as CancelRoundedIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Save as SaveIcon
} from '@mui/icons-material';

import { Fonts, Props, SXs } from "@styles";
import { RECAPTCHA } from "@config";
import { updateUser } from "@actions";
import {
    validateEmail, validatePassword,
    useThisToGetSizesFromRef
} from "@utils";
import * as t from '@consts';

import Uploader from "@tallis/react-dndp";
import _ from 'lodash';

const Profile = () => {

    const [photo, setPhoto] = useState(null);
    const [photoWeight, setPhotoWeight] = useState(0);

    const [editing, setEditing] = useState([]);
    const [updateForm, setUpdateForm] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const user = useSelector((state) => state?.userData);
    const recaptcha = useSelector((state) => state.recaptcha);

    const dispatch = useDispatch();

    const imageRef = useRef(null);


    useEffect(() => {
        const loop = setInterval(() => {
            if (!photo && window) {
                setPhoto(new FormData());
                clearInterval(loop);
            }
        }, 100);

        return () => clearInterval(loop);
    }, [photo]);

    useEffect(() => {
        const loop = setInterval(() => {
            if (user?.photo && !photo?.get("photo")) {
                const avatar =
                    user?.photo?.formats?.small?.url ||
                    user?.photo?.url ||
                    t.AVT_ALT;

                if (photo) {
                    photo?.set("photo", avatar);
                    setPhoto(photo);

                    clearInterval(loop);
                }
            }
        }, 200);

        return () => clearInterval(loop);
    }, [user?.photo, photo]);

    const toggleEditing = (fieldName) => {
        const newEditing = [...editing];
        const index = newEditing.indexOf(fieldName);
        if (index === -1) {
            newEditing.push(fieldName);
        } else {
            delete updateForm[fieldName];
            delete errors[fieldName];
            newEditing.splice(index, 1);
        }
        setEditing(newEditing);
    }

    const isInEditingMode = (fieldName) => {
        return editing.indexOf(fieldName) !== -1;
    }

    const setErrorByField = (fieldName, error) => {
        const newErrors = { ...errors };
        newErrors[fieldName] = error;
        setErrors(newErrors);
    }

    const handleCheckError = (fieldName, value) => {
        if (value && value.trim().length) {
            setErrorByField(fieldName, false);
        }
    }

    const resetWhole = () => {
        setUpdateForm({});
        setErrors({});
        setPhoto(new FormData());
        setEditing([]);
        setPhotoWeight(0);
        setLoading(false);
    };

    const canSubmit = !errors?.username && !errors?.email && !errors?.password && !(Math.ceil(photoWeight / 1024 / 1024) > 10);

    const imageSizes = useThisToGetSizesFromRef(imageRef, {
        revalidate: 1000,
        terminalCondition: ({ width }) => width !== 0,
        falseCondition: ({ width }) => width === 0,
    });

    const commonProps = {
        user,
        isInEditingMode,
        toggleEditing,
        updateForm,
        setUpdateForm,
        errors,
        handleCheckError
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // check if there is any error
        for (const key of Object.keys(updateForm)) {
            if (!updateForm[key] || !updateForm[key]?.trim()?.length) {
                setErrorByField(key, "Either fill this field or remove it");
                return;
            }
        }

        let formData = new FormData();

        if (photo?.get("illustration")) {
            formData.append("files.photo", photo.get("illustration"));
        }

        if (window?.adHocFetch && recaptcha === true && window.grecaptcha) {
            grecaptcha.ready(function () {
                grecaptcha
                    .execute(`${RECAPTCHA}`, { action: "vip_authentication" })
                    .then(function (token) {
                        formData.append("data", JSON.stringify({ ...updateForm, token }));
                        adHocFetch({
                            dispatch,
                            action: updateUser(formData, user.id),
                            onSuccess: (data) => {
                                resetWhole();
                            },
                            onError: (error) => console.log(error),
                            onStarting: () => setLoading(true),
                            onFinally: () => setLoading(false),
                            snackbarMessageOnSuccess: "Update infomation success!",
                        });
                    });
            });
        }
    };

    return (
        <Container maxWidth="md">
            <Grid container {...Props.GCRCS}>
                <Grid item xs={12} mt={[5, 5, 3]}>
                    <Typography variant="h1" align="center" sx={{ fontSize: Fonts.FS_27, fontWeight: Fonts.FW_400 }}>
                        Personal Account Information
                    </Typography>
                    <Typography variant="h2" color="text.secondary" align="center"
                        sx={{ fontSize: Fonts.FS_16, fontWeight: Fonts.FW_400, mt: 2 }}>
                        Some settings relate to how you use your account and how you appear to others.
                    </Typography>
                </Grid>
                <Grid item xs={12} {...Props.GIRCC} mt={5}>
                    <Paper variant="outlined" sx={{ width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
                        <Grid container {...Props.GCRCC}>
                            <Grid ref={imageRef} item xs={12} sm={6} {...Props.GICCC} sx={{ p: 2 }}>
                                <UpdatePhoto
                                    dispatch={dispatch}
                                    photo={photo}
                                    setPhoto={setPhoto}
                                    imageSizes={imageSizes}
                                    setPhotoWeight={setPhotoWeight}
                                />
                                <FormHelperText
                                    variant="filled"
                                    sx={{ textAlign: 'center' }}
                                    error={Math.ceil(photoWeight / 1024 / 1024) > 10}
                                >
                                    {Math.ceil(photoWeight / 1024 / 1024) > 10 ? `Photo size is too large - ${photoWeight / 1024 / 1024}` : 'Photo should be in square and MUST be less than 10MB.'}
                                </FormHelperText>
                            </Grid>
                            <Grid item xs={12} sm={6} {...Props.GICCC}>
                                <Grid container {...Props.GCRCC}>
                                    <FieldInput
                                        fieldName="username"
                                        firstIndex
                                        {...commonProps}
                                    />
                                    <FieldInput
                                        fieldName="email"
                                        {...commonProps}
                                    />
                                    <FieldInput
                                        fieldName="password"
                                        isPassword
                                        lastIndex
                                        {...commonProps}
                                    />
                                </Grid>
                            </Grid>

                            <Grid item xs={12} {...Props.GIRCC} my={3}>
                                <Button
                                    disabled={!canSubmit || loading}
                                    onClick={handleSubmit}
                                    startIcon={<SaveIcon />}
                                    sx={SXs.COMMON_BUTTON_STYLES}
                                    variant="contained"
                                >
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

const FieldInput = ({
    errors, setUpdateForm,
    toggleEditing, isInEditingMode,
    user, fieldName, updateForm,
    isPassword = false, handleCheckError,
    firstIndex = false,
    lastIndex = false,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <Grid item xs={12} {...Props.GICCX} mt={firstIndex ? [2, 0] : 0}>
            {
                isInEditingMode(fieldName)
                    ? <ListItem dense sx={{
                        borderTop: firstIndex ? ['0.5px solid #e6e6e6', 'none'] : '0.5px solid #e6e6e6',
                        borderBottom: lastIndex ? ['0.5px solid #e6e6e6', 'none'] : '0.5px solid #e6e6e6',
                    }}
                    >
                        {
                            !isPassword
                                ? <TextField
                                    fullWidth
                                    autoFocus
                                    type="text"
                                    label={fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                                    variant="standard"
                                    size="small"
                                    helperText={errors[fieldName] || (_.has(updateForm, fieldName) && 'Editing... Close this to cancel.')}
                                    error={!!errors[fieldName]}
                                    onChange={(e) => {
                                        setUpdateForm((state) => ({ ...state, [fieldName]: e.target.value.trim() }));
                                        handleCheckError(fieldName, e.target.value);
                                    }}
                                />
                                : <FormControl fullWidth variant="standard">
                                    <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                                    <Input
                                        id="standard-adornment-password"
                                        type={showPassword ? 'text' : 'password'}
                                        inputProps={{
                                            autoComplete: "new-password",
                                            form: {
                                                autoComplete: "new-password",
                                            },
                                        }}
                                        onChange={(e) => {
                                            setUpdateForm((state) => ({ ...state, password: e.target.value }));
                                            handleCheckError(fieldName, e.target.value);
                                        }}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    <FormHelperText>
                                        {errors?.password || (_.has(updateForm, fieldName) && 'Editing... Close this to cancel.')}
                                    </FormHelperText>
                                </FormControl>
                        }
                        <IconButton
                            aria-label="Cancel editing"
                            sx={{ ml: 1 }}
                            onClick={() => toggleEditing(fieldName)}
                        >
                            <CancelRoundedIcon />
                        </IconButton>
                    </ListItem>
                    : <ListItemButton
                        sx={{
                            borderTop: firstIndex ? ['0.5px solid #e6e6e6', 'none'] : '0.5px solid #e6e6e6',
                            borderBottom: lastIndex ? ['0.5px solid #e6e6e6', 'none'] : '0.5px solid #e6e6e6'
                        }}
                        onClick={() => toggleEditing(fieldName)}
                    >
                        <ListItemText
                            primary={fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                            secondary={user[fieldName] || "********"}
                        />
                        <EditIcon sx={{ color: theme => theme.palette.text.secondary }} />
                    </ListItemButton>
            }
        </Grid>
    )
}

const UpdatePhoto = ({ imageSizes, photo, setPhoto, setPhotoWeight, dispatch }) => (
    <div style={{
        position: "relative",
        width: Math.round(imageSizes.width * 0.8),
        height: Math.round(imageSizes.width * 0.8),
        border: '1px solid #e0e0e0',
        overflow: "hidden",
        borderRadius: '50%',
    }}>
        <Uploader
            containerProps={{
                sx: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 2,
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "flex-end",
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
            setData={(data, base64) => {
                photo?.set("illustration", data);
                photo?.set("photo", base64);
                setPhoto(photo);
            }}
            data={
                Boolean(photo?.get("photo"))
                    ? photo?.get("photo")
                    : t.AVT_ALT
            }
            showIconUpload={
                Boolean(photo?.get("photo")) ? false : true
            }
            getFileSize={(data) => setPhotoWeight(data)}
            isFormik
            clickWhole
            NextImage={Image}
            React={React}
            onError={() =>
                dispatch({
                    type: SHOW_SNACKBAR,
                    payload: {
                        message: "Only image file is allowed",
                        type: "error",
                    },
                })
            }
            helperText=" "
        />
    </div>
)

export default React.memo(Profile);
