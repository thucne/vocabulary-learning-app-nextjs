import { useMemo, useState } from "react";

import Index from "@components/LoadingImage";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Button,
  Collapse,
  Divider,
  Grid,
  IconButton,
  ListItem,
  Tooltip,
  Typography,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import { Box } from "@mui/system";

import { Fonts, SXs, Props, Colors } from "@styles";
import { capitalizeFirstLetter, getAllImageFormats } from "@utils";
import Link from "next/link";

const MetaData = (props) => {
  const { illustration, value, index } = props;

  const { formatArrays, opens } = useMemo(
    () => getAllImageFormats(illustration),
    [illustration]
  );

  const [openSecsons, setOpenSecsons] = useState(opens);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {formatArrays.map((format, index) => (
            <Box key={index}>
              <Grid key={index} item xs={12}>
                <Button
                  fullWidth
                  disableRipple
                  onClick={() =>
                    setOpenSecsons((prev) => ({
                      ...prev,
                      [format[0]]: !prev[format[0]],
                    }))
                  }
                  sx={{
                    ...SXs.COMMON_BUTTON_STYLES,
                    justifyContent: "space-between",
                  }}
                  endIcon={
                    openSecsons[format[0]] ? <ExpandLess /> : <ExpandMore />
                  }
                  size="small"
                >
                  {capitalizeFirstLetter(format[0])}
                </Button>
              </Grid>

              <InfoExpand format={format} openSecsons={openSecsons}  />
              {index!==formatArrays.length-1 && <Divider/>}
            </Box>
            
          ))}
        </Box>
      )}
    </div>
  );
};

const InfoExpand = ({ format, openSecsons,isBreak }) => {
  const infoData = [
    ["File size", `${format[1].size} kb`],
    ["Dimension", `${format[1].width}x${format[1].height}`],
  ];

  const [isCopy, setIsCopy] = useState(false);
  const copyToClipboard = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(format[1].url);
    setIsCopy(true);
  };
  return (
    <Grid item xs={12}>
      <Collapse
        in={openSecsons[format[0]]}
        sx={{ width: "100%" }}
        timeout="auto"
        unmountOnExit
      >
        {infoData.map((info, index) => (
          <Grid container key={index}>
            <Grid item xs={4}>
              <Typography sx={{ ...styles(Fonts).text }}>{info[0]}</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography
                sx={{
                  fontSize: [Fonts.FS_12, Fonts.FS_14, Fonts.FS_16],
                }}
              >
                {info[1]}
              </Typography>
            </Grid>
          </Grid>
        ))}

        <Box sx={{ width: "100%" }}>
          <Link href={format[1].url} passHref >
            <a target="_blank" rel={format[1].url} style={{wordWrap: 'break-word',color:Colors.BLUE,textDecoration:'underline'}} >
              {format[1].url}
            </a>
          </Link>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <IconButton onClick={copyToClipboard}>
            <Tooltip title={isCopy ? "Copied" : "Copy"}>
              <LinkIcon />
            </Tooltip>
          </IconButton>
        </Box>
      </Collapse>
    </Grid>
  );
};

const styles = (Fonts) => ({
  text: {
    fontWeight: Fonts.FW_500,
    fontSize: [Fonts.FS_12, Fonts.FS_14, Fonts.FS_16],
  },
});

export default MetaData;
