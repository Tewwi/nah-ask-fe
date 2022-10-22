import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import { ITag } from "../../interface/QuestionItemInterface";
import TagChip from "./TagChip";

const useStyle = makeStyles((theme) => ({
  root: {
    height: "150px",
    width: "260px",
    padding: "8px",
    border: "1px solid #d6d9dc",
    borderRadius: "3px",
  },
  descriptionText: {
    wordBreak: "break-word",
    display: "-webkit-box",
    overflow: "hidden",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 3,
  },
}));

interface ITagItem {
  data: ITag;
}

const TagItem = ({ data }: ITagItem) => {
  const classes = useStyle();

  return (
    <Box className={classes.root}>
      <TagChip data={data} />
      <Typography variant="body2" mt="15px" className={classes.descriptionText}>
        {data.description}
      </Typography>
    </Box>
  );
};

export default TagItem;
