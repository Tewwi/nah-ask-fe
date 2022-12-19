import DoneIcon from "@mui/icons-material/Done";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ContentState, convertFromHTML, Editor, EditorState } from "draft-js";
import Cookies from "js-cookie";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  useChooseAnswerMutation,
  useHiddenCommentMutation,
} from "../../api/blogApi";
import { IComment } from "../../interface/QuestionItemInterface";
import { IUser } from "../../interface/UserInterface";
import { selectCurrentUser } from "../../redux/authSlice";
import { toggleSnack } from "../../redux/snackSlice";
import { pathName } from "../../router/pathName";
import { constantValue } from "../../util/constant";
import { text } from "../../util/Text";

const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const ITEM_HEIGHT = 48;

const useStyle = makeStyles((theme) => ({
  root: {
    display: "flex",
    margin: "40px 0px",
    padding: "18px",
    border: "1px solid transparent",
    borderRadius: "5px",
  },
  commentInfo: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "20px",
    width: "100%",
  },
}));

interface ICommentProps {
  data: IComment;
  isAnswer?: boolean;
  blogAuthorId?: string;
}

const Comment = ({ data, isAnswer, blogAuthorId }: ICommentProps) => {
  const classes = useStyle();
  const { id: questionId } = useParams() as { id: string };
  const [chooseAnswer] = useChooseAnswerMutation();
  const [hiddenComment] = useHiddenCommentMutation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const currUser: IUser | null = useSelector(selectCurrentUser);
  const token = Cookies.get("token");
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const isAdmin = currUser && currUser.role === "admin";
  const blocksFromHTML = convertFromHTML(data.body);
  const state = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  );
  const isCanChooseAnswer = useMemo(() => {
    if (!currUser || isAnswer) {
      return false;
    }
    const isAuthor = currUser._id === blogAuthorId;

    return isAuthor || isAdmin;
  }, [blogAuthorId, currUser, isAdmin, isAnswer]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChooseAnswer = async () => {
    if (isCanChooseAnswer && token) {
      handleClose();
      await chooseAnswer({
        token: token,
        questionID: questionId,
        commentID: data._id,
      });

      dispatch(toggleSnack({ status: true, message: text.Success }));
    }
  };

  const handleHiddenComment = async () => {
    if (isAdmin && token) {
      handleClose();
      await hiddenComment({
        token: token,
        id: data._id,
      });

      dispatch(toggleSnack({ status: true, message: text.Success }));
    }
  };

  return (
    <>
      <Box
        className={classes.root}
        sx={{ borderColor: isAnswer ? "green" : "transparent" }}
      >
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
          <Box display="flex" justifyContent="space-between">
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
            {isCanChooseAnswer && (
              <Box>
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={open ? "long-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="long-menu"
                  MenuListProps={{
                    "aria-labelledby": "long-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5,
                      width: "20ch",
                    },
                  }}
                >
                  {!data.isHidden ? (
                    <>
                      <MenuItem onClick={handleChooseAnswer}>
                        {text.ChooseAnswer}
                      </MenuItem>
                      {isAdmin && (
                        <MenuItem onClick={handleHiddenComment}>
                          {text.hidden_comment_action}
                        </MenuItem>
                      )}
                    </>
                  ) : (
                    <>
                      {isAdmin && (
                        <MenuItem onClick={handleHiddenComment}>
                          {text.unhidden_comment_action}
                        </MenuItem>
                      )}
                    </>
                  )}
                </Menu>
              </Box>
            )}
          </Box>
          {!data.isHidden ? (
            <Editor
              readOnly
              onChange={() => {}}
              editorState={EditorState.createWithContent(state)}
            />
          ) : (
            <Typography
              sx={{ fontSize: "1rem", opacity: "0.7", fontStyle: "italic" }}
            >
              {text.hidden_comment}
            </Typography>
          )}
        </Box>
      </Box>
      <Divider />
    </>
  );
};

export default Comment;
