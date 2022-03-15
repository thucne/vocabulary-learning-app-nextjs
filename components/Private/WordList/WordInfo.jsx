import React, { useState } from "react";

import { Checkbox, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";

import CircleIcon from "@mui/icons-material/Circle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import LoadingImage from "@components/LoadingImage";

import { IMAGE_ALT } from "@consts";
import { Colors, Fonts } from "@styles";
import InfoLabel from "./InfoLabel";
import { EditTwoTone, VisibilityTwoTone } from "@mui/icons-material";
import { generateVipLink, isInCheckedList } from "@utils";

import Link from "next/link";
import EditForm from "./EditForm";
/**
 * @author
 * @function WordInfo
 **/
const label = { inputProps: { "aria-label": "Checkbox demo" } };

function WordInfo({  word, handleCheckBox,setCurrentWord,setOpen, checkList }) {
    
  const [loading, setLoading] = useState(true);
 
  const handleOpenDialog =()=>{
        setOpen(true)
        setCurrentWord(word)
  }

  const photo =
    word?.illustration?.formats?.small?.url ||
    word?.illustration?.url ||
    IMAGE_ALT;

  return (
    <Box
      sx={{ display: "flex", height: "80px", justifyContent: "space-between" }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Checkbox
          {...label}
          checked={isInCheckedList( checkList,word.id) ? true : false}
          icon={<CircleIcon style={{ color: Colors.GRAY_3 }} />}
          checkedIcon={<CheckCircleIcon />}
          onChange={() => handleCheckBox(word.id)}
        />
        <div style={{ ...styles.imgBox }}>
          <LoadingImage
            src={photo}
            alt="Illustration"
            layout="fill"
            objectFit="contain"
            draggable={false}
            doneLoading={() => setLoading(false)}
          />
        </div>
        <Typography sx={{ ...styles.vip }}>{word.vip}</Typography>

        {!!word?.meanings?.english && (
          <InfoLabel
            content={word.meanings.english.length}
            bgColor={Colors.LOGO_BLUE}
            label="English"
          />
        )}

        {!!word?.meanings?.vietnamese && (
          <InfoLabel
            content={word.meanings.english.length}
            bgColor={Colors.LOGO_YELLOW}
            label="Vietnamese"
          />
        )}

        {!!word?.examples && (
          <InfoLabel
            content={word.examples.length}
            bgColor={Colors.RED}
            label="Examples"
          />
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={handleOpenDialog}>
          < EditTwoTone />
        </IconButton>

        <Link href={generateVipLink(word.public, word.vip, word.id)}>
          <a>
            <IconButton >
              <VisibilityTwoTone  />
            </IconButton>
          </a>
        </Link>
      </Box>

    </Box>
  );
}

const styles = {
  imgBox: {
    position: "relative",
    width: "40px",
    height: "40px",
    overflow: "hidden",
    borderRadius: "10px",
  },
  vip: {
    fontWeight: Fonts.FW_600,
    fontSize: Fonts.FS_16,
    mx: 5,
    width: "150px",
  },
};

export default React.memo(WordInfo);
