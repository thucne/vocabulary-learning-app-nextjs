import React from "react";

import {
    Box,
    Dialog,
    IconButton,
    Tab,
    Tabs,
} from "@mui/material";

import { CloseOutlined } from "@mui/icons-material";

import { SXs } from '@styles';

import ImageSumary from "./ImageSumary";
import MetaData from "./MetaData";

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
                        centered
                    >
                        <Tab label="Summary" {...a11yProps(0)} sx={SXs.BASE_BUTTON_STYLES} />
                        <Tab label="Formats" {...a11yProps(1)} sx={SXs.BASE_BUTTON_STYLES} />
                    </Tabs>
                    <IconButton sx={{
                        ...styles.closeButton,
                        ...SXs.MUI_NAV_ICON_BUTTON,
                        width: '30px',
                        height: '30px',
                        fontSize: '25px',
                        borderRadius: '5px',
                    }} onClick={handleClose}>
                        <CloseOutlined />
                    </IconButton>
                </Box>

                <ImageSumary value={value} index={0} illustration={illustration} />
                <MetaData value={value} index={1} illustration={illustration} />
            </Box>
        </Dialog>
    );
};

const styles = {
    closeButton: {
        position: "absolute",
        top: '50%',
        right: '24px',
        transform: 'translateY(-50%)',
    },
    tabBar: {
        borderBottom: 1,
        borderColor: "divider",
        position: "relative",
    },
};

export default ImgInfo;