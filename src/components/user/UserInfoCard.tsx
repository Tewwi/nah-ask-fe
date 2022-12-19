import React from "react";
import { Avatar, Box, Popover, Skeleton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { IUser } from "../../interface/UserInterface";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { text } from "../../util/Text";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/authSlice";

interface IUserInfoCard {
  userData?: IUser;
  isLoading: boolean;
  handleChangePassword: (path: string) => void;
  handleLogOut: () => void;
  handleSetRole: () => void;
  handleBlockUser: () => void;
}

const useStyle = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: "12px",
    alignItems: "center",
    marginInline: "20px",
    minWidth: "210px",
    position: "relative",
    boxShadow:
      "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
  },
  avatar: {
    marginBottom: "5px",
  },
  loadingRow: {
    padding: "8px",
  },
}));

const UserInfoCard = (props: IUserInfoCard) => {
  const {
    userData,
    isLoading,
    handleChangePassword,
    handleLogOut,
    handleSetRole,
    handleBlockUser,
  } = props;
  const classes = useStyle();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const currUser: IUser | null = useSelector(selectCurrentUser);
  const isAdmin = currUser?.role === "admin" && userData?._id !== currUser._id;
  const isCanBlock = currUser?.role === "admin" && userData?.role !== "admin";

  const handleOpenPopover = (event: React.MouseEvent<any>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (isLoading) {
    return (
      <Box className={classes.root}>
        <Skeleton
          className={classes.avatar}
          variant="circular"
          width={80}
          height={80}
        />
        <Skeleton className={classes.loadingRow} variant="text" width="60%" />
        <Skeleton className={classes.loadingRow} variant="text" width="60%" />
        <Skeleton className={classes.loadingRow} variant="text" width="60%" />
      </Box>
    );
  }

  return (
    <Box className={classes.root}>
      <MoreVertIcon
        onClick={(e) => handleOpenPopover(e)}
        sx={{ position: "absolute", right: "10px", top: "8px" }}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{ cursor: "pointer" }}
      >
        {isAdmin && (
          <Typography onClick={() => handleSetRole()} sx={{ p: "12px" }}>
            {userData?.role === "admin"
              ? text.set_role_member
              : text.set_role_admin}
          </Typography>
        )}
        <Typography
          onClick={() => handleChangePassword("/change_password")}
          sx={{ p: "12px" }}
        >
          {text.changePassword}
        </Typography>
        {isCanBlock && (
          <Typography
            onClick={() => {
              handleClose();
              handleBlockUser();
            }}
            sx={{ p: "12px" }}
          >
            {text.block_user}
          </Typography>
        )}

        <Typography onClick={handleLogOut} sx={{ p: "12px" }}>
          {text.LogOut}
        </Typography>
      </Popover>
      <Avatar
        className={classes.avatar}
        sx={{ width: 80, height: 80 }}
        src={`${userData?.avatar.url}`}
      />
      <Typography padding="8px" variant="h5">
        {userData?.userName}
      </Typography>
      <Typography padding="8px" variant="body2" display="flex">
        Trạng thái:{" "}
        {!userData?.isBlock ? (
          <Typography variant="body2" color="green">
            Đang hoạt động
          </Typography>
        ) : (
          <Typography variant="body2" color="red">
            Bị chặn
          </Typography>
        )}
      </Typography>
      <Typography padding="8px" variant="body2">
        Vai trò: {userData?.role}
      </Typography>
      <Typography padding="8px" variant="body2" noWrap>
        Email: {userData?.email}
      </Typography>
    </Box>
  );
};

export default UserInfoCard;
