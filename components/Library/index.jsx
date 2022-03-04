import {
  Box,
  Container,
  Dialog,
  Grid,
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
import React, { useEffect, useMemo, useState } from "react";
import { Fonts, Props } from "@styles";
import { useSelector } from "react-redux";
import { getIllustrationsList } from "@utils";
import Index from "@components/LoadingImage";
import { TabPanel } from "@mui/lab";
import { InboxOutlined } from "@mui/icons-material";
import ImageSumary from "./ImageInfo/ImageSumary";
import MetaData from "./ImageInfo/MetaData";
import ImageGallery from "./ImageGallery";

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

      {!!currentImg && <ImgInfo {...commonProps} />}
    </Container>
  );
};

// popup Image info
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
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
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
    </Dialog>
  );
};

export default Library;
