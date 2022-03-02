import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Image from "next/image";

import { Button, IconButton, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import ReplayIcon from "@mui/icons-material/Replay";

import { Fonts } from "@styles";
import { RECAPTCHA } from "@config";
import { updateUser } from "@actions";
import { validateEmail, validatePassword } from "@utils";
import { set } from "lodash";
import Index from "@components/LoadingImage";
const Profile =() => {
  const user = useSelector((state) => state?.userData);
  const recaptcha = useSelector((state) => state.recaptcha);

  const dispatch = useDispatch();

  const [userData, setUserData] = useState({});
  const [isUpdatingField, setIsUpdatingField] = useState({
    username: false,
    email: false,
    password: false,
  });

  const [updateForm, setUpdateForm] = useState({});
  const [updatePhoto, setUpdatePhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setUserData({ ...initTempInputs });
  }, [user]);

//   useEffect(() => {
//     console.log("updateform", updateForm.photo);
//     console.log("userform", userData.photo);
//   });

  const initTempInputs = {
    username: user?.username,
    email: user?.email,
    password: "",
    photo: user?.photo ?? "",
  };

  const resetWhole = () => {
    setIsUpdatingField({
      username: false,
      email: false,
      password: false,
    });
    setUpdateForm({});
    setUserData({ ...initTempInputs });
    setErrors({});
  };

  const checkInputCriteria = (e, field) => {
    switch (field) {
      case "email":
        var error = {};
        if (!validateEmail(e.target.value)) {
          error = { msg: "Invalid email" };
        }
        if (!e.target.value) error = { msg: "Email is required" };
        setErrors((state) => ({
          ...state,
          ["email"]: error,
        }));
        return;
      case "password":
        var error = {};

        if (!validatePassword(e.target.value)) {
          error = {
            msg: "At least 8 characters, 1 uppercase and 1 number",
          };
        }
        if (!e.target.value) error = { msg: "Password is required" };
        setErrors((state) => ({
          ...state,
          ["password"]: error,
        }));
        return;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let formData = new FormData();

    if (updateForm.photo) formData.append("files.photo", updateForm.photo);

    //exclude photo from formData
    let temptObj ={}
    for (let [key, value] of Object.entries(updateForm)) {
        if (key !== "photo") 
            temptObj[key] = value;
    }

    if (window?.adHocFetch && recaptcha === true && window.grecaptcha) {
      grecaptcha.ready(function () {
        grecaptcha
          .execute(`${RECAPTCHA}`, { action: "vip_authentication" })
          .then(function (token) {
            formData.append("data", JSON.stringify({ ...temptObj, token }));
            console.log("token",{token})
            // adHocFetch({
            //   dispatch,
            //   action: updateUser(formData, user.id),
            //   onSuccess: (data) => {console.log(data);resetWhole()},
            //   onError: (error) => console.log(error),
            //   onStarting: () => setLoading(true),
            //   onFinally: () => setLoading(false),
            //   snackbarMessageOnSuccess: "Update infomation success!",
            // });
          });
      });
    }
  };

  const handleToggleUpdateField = (field) => {
    setIsUpdatingField({
      ...isUpdatingField,
      [field]: !isUpdatingField[field],
    });

    if (field === "password") {
      setErrors((state) => ({
        ...state,
        ["password"]: { msg: "Password is required" },
      }));
    }
    setUpdateForm((state) => ({ ...state, [field]: userData[field] }));
  };

  const checkCanSubmit = () => {
    return (
      (updateForm?.username?.length > 0 ||
        updateForm?.email?.length > 0 ||
        updateForm?.password?.length > 0 ||
        updateForm?.photo?.length >0) &&
      !errors?.email?.msg &&
      !errors?.password?.msg
    );
  };

  const handleChange = (e, field) => {
    setUpdateForm((state) => ({ ...state, [field]: e.target.value }));
    checkInputCriteria(e, field);
  };

  const handleUploadPhoto = (e) => {
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();

      reader.onload = function (e) {
        setUpdateForm((state) => ({ ...state, photo: e.target.result }));
        setUserData((state) => ({ ...state, photo: e.target.result }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          p: [2, 4, 6, 10],
          height: "560px",
          flexDirection: ["column", "column", "row"],
        }}
      >
        <Box
          sx={{
            ...styles.flexColumn,
            flexBasis: "30%",
            alignItems: "center",
            height: "100%",
          }}
        >
        <label htmlFor="upload-img">
        <Image
            src={
              userData.photo ||
              "https://res.cloudinary.com/katyperrycbt/image/upload/v1646137393/e5d9fwaou6rswyztralh.png"
            }
            width={150}
            height={150}
            objectFit="cover"
            alt="profile-image"
          />
        </label>
          <input type="file" id="upload-img" hidden onChange={handleUploadPhoto}/>
        </Box>
        <Box
          sx={{
            ...styles.flexColumn,
            flexBasis: "70%",
          }}
        >
          <UpdateForm
            {...inputProps(
              userData,
              handleToggleUpdateField,
              isUpdatingField,
              updateForm,
              handleChange,
              errors
            ).username}
          />

          <UpdateForm
            {...inputProps(
              userData,
              handleToggleUpdateField,
              isUpdatingField,
              updateForm,
              handleChange,
              errors
            ).email}
          />

          <UpdateForm
            {...inputProps(
              userData,
              handleToggleUpdateField,
              isUpdatingField,
              updateForm,
              handleChange,
              errors
            ).password}
          />
        </Box>
      </Box>

      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Button disabled={!checkCanSubmit()} onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
}

const UpdateForm = ({
  value,
  toggleField,
  field,
  isUpdatingField,
  inputValue,
  handleChange,
  error,
}) => {
  return (
    <React.Fragment>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Box>
          <Typography sx={{ fontSize: Fonts.FS_14, fontWeight: Fonts.FW_600 }}>
            {field}
          </Typography>
          <Box sx={{ height: "60px", mb: 2 }}>
            {!isUpdatingField ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "400px",
                }}
              >
                <Typography>{value?.length ? value : "***********"}</Typography>
                <IconButton onClick={() => toggleField(field)}>
                  <EditIcon />
                </IconButton>
              </Box>
            ) : (
              <TextField
                sx={{ width: "400px" }}
                label={field}
                autoComplete="off"
                id={field ?? ""}
                size="small"
                margin="dense"
                error={error?.msg ? true : false}
                helperText={error?.msg ?? ""}
                //   type={field=="password"?"password":"text"}
                value={inputValue}
                onChange={(e) => handleChange(e, field)}
              />
            )}
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
};


export default React.memo(Profile)
const styles ={
    flexColumn:{
        display: "flex",
        flexDirection: "column",
        alignItem: "center",
        justifyContent: "center",
    },
    flexRow:{
        display: "flex",
        alignItem: "center",
        justifyContent: "center",
    }
}
const inputProps = (
  userData,
  handleToggleUpdateField,
  isUpdatingField,
  updateForm,
  handleChange,
  errors
) => ({
  username: {
    field: "username",
    value: userData.username,
    toggleField: handleToggleUpdateField,
    isUpdatingField: isUpdatingField.username,
    inputValue: updateForm?.username,
    handleChange: handleChange,
    error: errors?.username,
  },
  email: {
    field: "email",
    value: userData.email,
    toggleField: handleToggleUpdateField,
    isUpdatingField: isUpdatingField.email,
    inputValue: updateForm?.email,
    handleChange: handleChange,
    error: errors?.email,
  },
  password: {
    field: "password",
    value: "",
    toggleField: handleToggleUpdateField,
    isUpdatingField: isUpdatingField.password,
    inputValue: updateForm?.password,
    handleChange: handleChange,
    error: errors?.password,
  },
});


