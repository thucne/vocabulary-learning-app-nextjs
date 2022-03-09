import React, { useEffect, useMemo, useState } from "react";

import { useSelector } from "react-redux";

import {
    Box,
    Container,
    Dialog,
    Grid,
    IconButton,
    ImageList,
    ImageListItem,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";

import { getIllustrationsList } from "@utils";

import ImageSumary from "./ImageInfo/ImageSumary";
import MetaData from "./ImageInfo/MetaData";
import ImageGallery from "./ImageGallery";
import { CloseOutlined } from "@mui/icons-material";

const Library = () => {
    const user = useSelector((state) => state?.userData);
    const [currentImg, setCurrentImg] = useState(null);

    const illustrationsList = useMemo(() => getIllustrationsList(user), [user]);
    const handleClose = () => setCurrentImg(null);

    const commonProps = {
        currentImg,
        handleClose,
    };

    return (
        <Container maxWidth="full">
            <ImageGallery
                illustrationsList={illustrationsList}
                setCurrentImg={setCurrentImg}
            />

            {/* // popup Image info */}
            {!!currentImg && <ImgInfo {...commonProps} />}
        </Container>
    );
};

const ImgInfo = ({ currentImg: illustration, handleClose }) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            "aria-controls": `simple-tabpanel-${index}`,
        };
    }

    return (
        <Dialog maxWidth="xs" fullWidth open={!!illustration} onClose={handleClose}>
            <Box sx={{ width: "100%" }}>
                <Box sx={{ ...styles.tabBar }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                    >
                        <Tab label="Summary" {...a11yProps(0)} />
                        <Tab label="MetaData" {...a11yProps(1)} />
                    </Tabs>
                </Box>

                <ImageSumary value={value} index={0} illustration={illustration} />
                <MetaData value={value} index={1} illustration={illustration} />
            </Box>

            <IconButton sx={{ ...styles.closeButton }} onClick={handleClose}>
                <CloseOutlined />
            </IconButton>
        </Dialog>
    );
};

const styles = {
    closeButton: {
        position: "absolute",
        top: 5,
        right: 5,
        cursor: "pointer",
    },
    tabBar: {
        borderBottom: 1,
        borderColor: "divider",
    },
};
export default React.memo(Library);
