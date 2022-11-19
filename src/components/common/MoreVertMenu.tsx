import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import Cookies from "js-cookie";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDeleteBlogMutation } from "../../api/blogApi";
import { IQuestion } from "../../interface/QuestionItemInterface";
import { IUser } from "../../interface/UserInterface";
import { selectCurrentUser } from "../../redux/authSlice";
import { pathName } from "../../router/pathName";
import { text } from "../../util/Text";
import Loading from "./Loading";

const ITEM_HEIGHT = 48;

interface IMoreVertMenu {
  data: IQuestion;
  handleApprove: () => void;
}

const MoreVertMenu = (props: IMoreVertMenu) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const currUser: IUser | null = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const token = Cookies.get("token");
  const [deleteQuestion, { isLoading }] = useDeleteBlogMutation();

  const isAdmin = currUser && currUser.role === "admin";

  const isCanApprove = useMemo(() => {
    return isAdmin && !props.data?.approve;
  }, [isAdmin, props.data?.approve]);

  const isCanEdit = useMemo(() => {
    if (!currUser) {
      return false;
    }

    const isAuthor = currUser._id === props.data.author._id;
    return isAuthor || isAdmin;
  }, [currUser, isAdmin, props.data.author._id]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangePath = (path: string) => {
    navigate({ pathname: path });
  };

  const handleDeleQuestion = async () => {
    if (token) {
      await deleteQuestion({ id: props.data._id, token: token });
      handleClose();
      handleChangePath(`${pathName.questions}?p=1`);
    }
  };

  if (isLoading) {
    return <Loading open={isLoading} height={80} />;
  }

  return (
    <Box>
      {(isCanApprove || isCanEdit) && (
        <>
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
            {isCanApprove && (
              <MenuItem onClick={props.handleApprove}>
                {text.ApproveAction}
              </MenuItem>
            )}
            {isCanEdit && (
              <MenuItem
                onClick={() => {
                  handleChangePath(`/question/edit/${props.data._id}`);
                }}
              >
                {text.Edit}
              </MenuItem>
            )}
            {isCanEdit && (
              <MenuItem onClick={handleDeleQuestion} sx={{ color: "red" }}>
                {text.delete_question}
              </MenuItem>
            )}
          </Menu>
        </>
      )}
    </Box>
  );
};

export default MoreVertMenu;
