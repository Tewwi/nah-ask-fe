import React from "react";
import { Avatar, Box, Divider, List, ListItem } from "@mui/material";
import { IUser } from "../../interface/UserInterface";
import { sideBarItem } from "../../util/sideBarItem";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentUser } from "../../redux/authSlice";
import Cookies from "js-cookie";
import { text } from "../../util/Text";

interface ISideBar {
  handleNavigate: (type: string) => void;
  currentUser: IUser | null;
}

const SideBar = ({ handleNavigate, currentUser }: ISideBar) => {
  const dispatch = useDispatch();
  const currUser: IUser | null = useSelector(selectCurrentUser);

  const handleLogOut = () => {
    Cookies.remove("token");
    dispatch(logOut());
    handleNavigate("");
  };

  return (
    <List sx={{ width: 250, mt: "30px", cursor: "pointer" }}>
      {currUser && (
        <ListItem alignItems="center" sx={{mb: '10px'}}>
          <Box sx={{ display: "flex", margin: "auto" }}>
            <Avatar
              onClick={() => handleNavigate(`user/${currentUser?._id}`)}
              sx={{ width: 65, height: 65 }}
              alt={currUser.userName}
              src={currUser.avatar.url}
            />
          </Box>
        </ListItem>
      )}

      {sideBarItem.map((item) => {
        return (
          <div key={item.text}>
            <ListItem onClick={() => handleNavigate(item.link)}>
              {item.text}
            </ListItem>
            <Divider />
          </div>
        );
      })}
      {currentUser ? (
        <>
          <ListItem onClick={() => handleNavigate(`user/${currentUser?._id}`)}>
            {text.UserProfile}
          </ListItem>
          <Divider />
          <ListItem onClick={handleLogOut}>{text.LogOut}</ListItem>
          <Divider />
        </>
      ) : (
        <>
          <ListItem onClick={() => handleNavigate(`register`)}>
            {text.SignUp}
          </ListItem>
          <Divider />
          <ListItem onClick={() => handleNavigate(`login`)}>{text.Login}</ListItem>
          <Divider />
        </>
      )}
    </List>
  );
};

export default SideBar;
