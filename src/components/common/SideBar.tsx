import { Box, Divider, List, ListItem, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { IUser } from "../../interface/UserInterface";
import { logOut, selectCurrentUser } from "../../redux/authSlice";
import { pathName } from "../../router/pathName";
import { sideBarItem } from "../../util/sideBarItem";
import { text } from "../../util/Text";
import LoginIcon from "@mui/icons-material/Login";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";

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
    <List
      sx={{
        width: 250,
        cursor: "pointer",
        backgroundColor: "#ecf1f1",
        height: "100%",
      }}
    >
      <ListItem alignItems="center" sx={{ mb: "10px", mt: "30px" }}>
        <Box sx={{ display: "flex" }} onClick={() => handleNavigate("")}>
          <Typography variant="h4">NahAsk</Typography>
        </Box>
      </ListItem>

      {sideBarItem.map((item) => {
        return (
          <div key={item.text}>
            <ListItem onClick={() => handleNavigate(item.link)}>
              <item.icon sx={{ marginRight: "10px" }} /> {item.text}
            </ListItem>
            <Divider />
          </div>
        );
      })}

      {currUser?.role === "admin" && (
        <>
          <ListItem onClick={() => handleNavigate(pathName.unapproved)}>
            <ListAltIcon sx={{ mr: "10px" }} /> {text.UnapprovedQuestion}
          </ListItem>
          <Divider />
        </>
      )}

      {currentUser ? (
        <>
          <ListItem onClick={() => handleNavigate(`user/${currentUser?._id}`)}>
            <AccountCircleIcon sx={{ mr: "10px" }} /> {text.UserProfile}
          </ListItem>
          <Divider />
          <ListItem onClick={handleLogOut}>
            <LogoutIcon sx={{ mr: "10px" }} /> {text.LogOut}
          </ListItem>
          <Divider />
        </>
      ) : (
        <>
          <ListItem onClick={() => handleNavigate(`login`)}>
            <LoginIcon sx={{ mr: "10px" }} /> {text.Login}
          </ListItem>
          <Divider />
          <ListItem onClick={() => handleNavigate(`register`)}>
            <GroupAddIcon sx={{ mr: "10px" }} /> {text.SignUp}
          </ListItem>
          <Divider />
        </>
      )}
    </List>
  );
};

export default SideBar;
