import { Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Colors, Fonts } from "@styles";
import React from "react";

/**
 * @author
 * @function InfoLabel
 **/



function InfoLabel({ content, bgColor,label }) {
  return (
    <React.Fragment>
      <Box className="tooltip">
      <Tooltip title={label} arrow>
        <Typography
          sx={styles(bgColor).toolTip}
        >
          {content}
        </Typography>
      </Tooltip>
      </Box>
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
    mr: [1,1,3],
    backgroundColor: bgColor,
  }
});
export default InfoLabel;
