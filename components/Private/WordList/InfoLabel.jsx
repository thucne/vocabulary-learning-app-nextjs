import { Tooltip, Typography } from "@mui/material";
import { Colors, Fonts } from "@styles";
import React from "react";

/**
 * @author
 * @function InfoLabel
 **/



function InfoLabel({ content, bgColor,label }) {
  return (
    <React.Fragment>
      <Tooltip title={label} arrow>
        <Typography
          sx={styles(bgColor).toolTip}
        >
          {content}
        </Typography>
      </Tooltip>
    </React.Fragment>
  );
}

const styles=(bgColor) =>({
  toolTip: {
    px: 1.5,
    py: 0.5,
    borderRadius: "3px",
    fontSize: Fonts.FS_12,
    fontWeight: Fonts.FW_600,
    cursor: "pointer",
    mr: 3,
    backgroundColor: bgColor,
  }
});
export default InfoLabel;
