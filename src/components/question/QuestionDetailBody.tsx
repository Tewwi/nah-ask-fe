import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import { IQuestion } from "../../interface/QuestionItemInterface";
import { ContentState, convertFromHTML, Editor, EditorState } from "draft-js";
import QuestionImgPreview from "./QuestionImgPreview";
import TagChip from "../tag/TagChip";

const useStyle = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  },
}));

interface IQuestionDetailBody {
  data: IQuestion;
}

const QuestionDetailBody = ({ data }: IQuestionDetailBody) => {
  const classes = useStyle();
  const blocksFromHTML = convertFromHTML(data.body);
  const state = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  );

  return (
    <Box className={classes.root}>
      <Editor
        readOnly
        onChange={() => {}}
        editorState={EditorState.createWithContent(state)}
      />
      {data.thumb && <QuestionImgPreview images={data.thumb} />}
      <Box display="flex" mt="10px">
        {data.tags?.map((tag) => (
          <TagChip key={tag._id} data={tag} />
        ))}
      </Box>
    </Box>
  );
};

export default QuestionDetailBody;
