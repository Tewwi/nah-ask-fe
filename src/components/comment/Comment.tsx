import { Avatar, Box, Divider, Tooltip, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ContentState, convertFromHTML, Editor, EditorState } from "draft-js";
import React from "react";
import { Link } from "react-router-dom";
import { IComment } from "../../interface/QuestionItemInterface";
import { pathName } from "../../router/pathName";
import { constantValue } from "../../util/constant";
import DoneIcon from "@mui/icons-material/Done";
import { text } from "../../util/Text";

const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const useStyle = makeStyles((theme) => ({
  root: {
    display: "flex",
    margin: "40px 0px",
    padding: '18px',
    border: '1px solid transparent',
    borderRadius: '5px',
  },
  commentInfo: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "20px",
  },
}));

interface ICommentProps {
  data: IComment;
  isAnswer?: boolean;
}

const Comment = ({ data, isAnswer }: ICommentProps) => {
  const classes = useStyle();
  const blocksFromHTML = convertFromHTML(data.body);
  const state = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  );

  return (
    <>
      <Box className={classes.root} sx={{borderColor: isAnswer ? 'green' : 'transparent'}}>
        <Box display="flex" flexDirection="column">
          <Avatar
            src={`${constantValue.imgUrl}/${data.author.avatar}`}
            sx={{ mr: "5px", width: 50, height: 50 }}
          />
          {isAnswer && (
            <Box sx={{ alignSelf: "center", marginTop: "30px" }}>
              <Tooltip title={text.AnswerDesc}>
                <DoneIcon sx={{ fontSize: "40px" }} color="success" />
              </Tooltip>
            </Box>
          )}
        </Box>
        <Box className={classes.commentInfo}>
          <Box display="flex">
            <Typography mr="5px" variant="body1">
              <Link
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontWeight: "550",
                }}
                to={`/${pathName.user}/${data.author._id}`}
              >
                {data.author.userName}
              </Link>
            </Typography>
            <Typography variant="body2">
              · {dayjs(data.createAt).fromNow()}
            </Typography>
          </Box>
          <Editor
            readOnly
            onChange={() => {}}
            editorState={EditorState.createWithContent(state)}
          />
        </Box>
      </Box>
      <Divider />
    </>
  );
};

export default Comment;
