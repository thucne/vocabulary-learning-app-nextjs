import React, { useCallback, useEffect, useState } from "react";

import { Box } from "@mui/system";
import WordInfo from "./WordInfo";

import { Checkbox, Divider, IconButton, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { Colors } from "@styles";
import { getNumberOfSelected, isCheckedAll } from "@utils";

/**
 * @author
 * @function DateLabesSection
 **/

function DateLabesSection({
  dateSegment,
  setCurrentWord,
  setOpen,
  handleUpdateCheckList,
  handleCheckSingleBox,
  checkList,
}) {

  const [isCheckAll, setIsCheckAll] = useState(
    isCheckedAll(dateSegment.data, checkList)
  );
  const [numsOfSelected, setNumsOfSelected] = useState(0)


  useEffect(() => {
    setIsCheckAll(isCheckedAll(dateSegment.data, checkList));
    setNumsOfSelected(getNumberOfSelected(dateSegment.data, checkList));
  },[dateSegment,checkList]);


  const handleCheckAll = () => {
    let updateArray = Array.from(
      Array(dateSegment.data.length),
      function (_, index) {
        return dateSegment.data[index].id;
      }
    );
    handleUpdateCheckList(updateArray, !isCheckAll);
    setIsCheckAll((prev) => !prev);
  };

  return (
    <React.Fragment>
      <Divider>
        <Box
          sx={{
            border: `1px solid ${Colors.GRAY_4}`,
            color: Colors.BLACK,
            padding: "5px 15px",
            borderRadius: "20px",
            display: "flex",
          }}
        >
          <Typography>{dateSegment.date}</Typography>
          <ArrowDropDownIcon />
        </Box>
      </Divider>
      <Box sx={{ display: "flex", alignItems: "center"}}>
        <Checkbox
          checked={isCheckAll}
          icon={<CircleIcon style={{ color: Colors.GRAY_3 }} />}
          checkedIcon={<CheckCircleIcon />}
          onChange={handleCheckAll}
        ></Checkbox>
        <IconButton>
          <DeleteOutlineIcon></DeleteOutlineIcon>
        </IconButton>
        <Typography sx={{ ml: 3 }}>Selected item: {numsOfSelected} </Typography>
      </Box>

      {dateSegment.data.map((word, index) => (
        <WordInfo
          key={index}
          index={index}
          word={word}
          checked={checkList[index]}
          handleCheckBox={handleCheckSingleBox}
          setCurrentWord={setCurrentWord}
          setOpen={setOpen}
          checkList={checkList}
        />
      ))}
    </React.Fragment>
  );
}

export default DateLabesSection;
