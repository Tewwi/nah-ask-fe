import React from "react";
import { Avatar, Box, Skeleton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { IUser } from "../../interface/UserInterface";

interface IUserInfoCard {
  userData?: IUser;
  isLoading: boolean;
}

const useStyle = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: "12px",
    alignItems: "center",
    marginInline: "20px",
    minWidth: '210px',
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
  const { userData, isLoading } = props;
  const classes = useStyle();

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
      <Avatar
        className={classes.avatar}
        sx={{ width: 80, height: 80 }}
        src={`${userData?.avatar.url}`}
      />
      <Typography padding="8px" variant="h5">
        {userData?.userName}
      </Typography>
      <Typography padding="8px" variant="body2">
        Role: {userData?.role}
      </Typography>
      <Typography padding="8px" variant="body2" noWrap>
        Email: {userData?.email}
      </Typography>
    </Box>
  );
};

export default UserInfoCard;
