import React, { useState } from "react";

import { Checkbox, Typography } from "@mui/material";
import { Box } from "@mui/system";

import CircleIcon from "@mui/icons-material/Circle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import LoadingImage from "@components/LoadingImage";

import { IMAGE_ALT } from "@consts";
import { Colors, Fonts } from "@styles";
/**
 * @author
 * @function WordInfo
 **/
const label = { inputProps: { "aria-label": "Checkbox demo" } };

function WordInfo({ index, word, checked, handleCheckBox }) {
  const [loading, setLoading] = useState(true);
  const photo =
    word?.illustration?.formats?.small?.url ||
    word?.illustration?.url ||
    IMAGE_ALT;

  return (
    <Box sx={{ display: "flex", height: "80px", alignItems: "center" }}>
      <Checkbox
        {...label}
        checked={checked}
        icon={<CircleIcon style={{ color: Colors.GRAY_3 }} />}
        checkedIcon={<CheckCircleIcon />}
        onChange={() => handleCheckBox(index)}
      />
      <div
        style={{...styles.imgBox}}
      >
        <LoadingImage
          src={photo}
          alt="Illustration"
          layout="fill"
          objectFit="contain"
          draggable={false}
          doneLoading={() => setLoading(false)}
        />
      </div>
      <Typography sx={{...styles.vip}}>{word.vip}</Typography>
        -
      {!!word?.meanings?.english && (
        <Typography sx={{ mx: 5 }}>
          English({word.meanings.english.length})
        </Typography>
      )}
    -
      {!!word?.meanings?.vietnamese && (
        <Typography sx={{ mx: 5 }}>
          Vietnamese({word.meanings.vietnamese.length})
        </Typography>
      )}
    </Box>
  );
}

const styles ={
    imgBox:{
        position: "relative",
        width: "40px",
        height: "40px",
        overflow: "hidden",
        borderRadius: "10px",
    },
    vip:{
        fontWeight: Fonts.FW_600,
        fontSize: Fonts.FS_16,
        mx:5
    }
}

export default WordInfo;
