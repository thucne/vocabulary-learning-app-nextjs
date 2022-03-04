import { Grid, ImageList, ImageListItem, Typography } from "@mui/material";

import { Box } from "@mui/system";
import { Fonts, Props } from "@styles";

import Image from "next/image";

const ImageGallery = (props) => {

  const { illustrationsList, setCurrentImg } = props;

  return (
    <>
      <Grid container {...Props.GCRCS}>
        <Grid item xs={12} mt={[5, 5, 3]}>
          <Typography
            variant="h1"
            align="center"
            sx={{ fontSize: Fonts.FS_27, fontWeight: Fonts.FW_400 }}
          >
            Personal Image Library
          </Typography>
          <Typography
            variant="h2"
            color="text.secondary"
            align="center"
            sx={{ fontSize: Fonts.FS_16, fontWeight: Fonts.FW_400, mt: 2 }}
          >
            Display all infomation about your personal image library
          </Typography>
        </Grid>

        <Grid item xs={12} {...Props.GIRCC} sx={{ p: 5 }}>
          <Box sx={{ width: ["100%", "80%"], height: 450, overflowY: "auto" }}>

            <ImageList variant="masonry" cols={3} gap={8}>
              {illustrationsList.map((illustration, index) => (
                <ImageListItem key={index}>
                  <img
                    src={`${illustration.formats.small.url}?w=248&fit=crop&auto=format`}
                    layout="fill"
                    alt={illustration.name}
                    style={{ cursor: "pointer" }}
                    onClick={() => setCurrentImg(illustration)}
                  />
                </ImageListItem>
              ))}
            </ImageList>

          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default ImageGallery;
