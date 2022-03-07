import React from 'react'

import Index from "@components/LoadingImage";
import { Divider, Grid, ListItem, Typography } from "@mui/material";

import { Box } from "@mui/system";
import { Fonts } from "@styles";

const ImageSumary = (props) => {
  const { illustration, value, index } = props;
console.log("rerendering ImageSumary");
  const infoData = [
    ["File Name", illustration.name],
    ["Format", illustration.ext, { break: true }],
    ["File size", `${illustration.size} kb`],
    [
      "Dimension",
      `${illustration.width}x${illustration.height}`,
      { break: true },
    ],
    ["Uploaded", new Date(illustration.updatedAt).toLocaleDateString()],
    ["Created", new Date(illustration.createdAt).toLocaleDateString()],
  ];

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div style={{...styles().image}}>
            <Index
              src={illustration.formats.small.url}
              layout="fill"
              objectFit="contain"
            />
          </div>

          {infoData.map((info, index) => (
            <Box key={index}>
              <ListItem>
                <Grid container>
                  <Grid item xs={4}>
                    <Typography sx={{ ...styles(Fonts).textKey }}>
                      {info[0]}
                    </Typography>
                  </Grid>

                  <Grid item xs={8}>
                    <Typography sx={{ ...styles(Fonts).textValue }}>
                      {info[1]}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              {info[2] && <Divider />}
            </Box>
          ))}
        </Box>
      )}
    </div>
  );
};

const styles = (Fonts={}) => ({
  textKey: {
    fontWeight: Fonts.FW_800,
    fontSize: [Fonts.FS_12, Fonts.FS_14, Fonts.FS_16],
  },
  textValue: {
    fontSize: [Fonts.FS_12, Fonts.FS_14, Fonts.FS_16],
  },
  image: {
    position: "relative",
    height: "200px",
    width: "100%",
    marginBottom: "20px",
  },
});

export default React.memo(ImageSumary);
