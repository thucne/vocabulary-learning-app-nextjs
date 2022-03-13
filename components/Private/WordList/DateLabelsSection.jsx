import React, { useCallback, useEffect, useState } from "react";

import { Box } from "@mui/system";
import WordInfo from "./WordInfo";

import { Checkbox, Divider, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { Colors } from "@styles";

/**
 * @author
 * @function DateLabesSection
 **/

function DateLabesSection({ dateSegment, setCurrentWord,setOpen }) {
    
  const [checkList, setScheckList] = useState(
    Array.from(Array(dateSegment.data.length).keys()).map(() => false)
  );



  const [isCheckAll, setIsCheckAll] = useState(false);

  const handleCheckSingleBox = (index) => {
    const newCheckList = [...checkList];
    newCheckList[index] = !newCheckList[index];
    setScheckList(newCheckList);
  };


  const handleCheckAll = () => {
    if (isCheckAll) {
      setScheckList(
        Array.from(Array(dateSegment.data.length).keys()).map(() => false)
      );
      setIsCheckAll((prev) => !prev);
    } else {
      setScheckList(
        Array.from(Array(dateSegment.data.length).keys()).map(() => true)
      );
      setIsCheckAll((prev) => !prev);
    }
  };


  return (
    <React.Fragment>
      <Divider >
		  <Box sx={{ border:	`1px solid ${Colors.GRAY_4}`, color:Colors.BLACK, padding:'5px 15px', borderRadius:'20px', display:'flex' }}>
			  <Typography>{dateSegment.date}</Typography>
              <ArrowDropDownIcon/>
			   </Box>
	  </Divider>
      <Box sx={{ width: "100%", textAlign: "center" }}>
        <Checkbox
          checked={isCheckAll}
          icon={<CircleIcon style={{color:Colors.GRAY_3}}/>}
          checkedIcon={<CheckCircleIcon />}
          onChange={handleCheckAll}
        ></Checkbox>
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
        />
      ))}
    </React.Fragment>
  );
}

export default DateLabesSection;
