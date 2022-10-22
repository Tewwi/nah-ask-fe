import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton, Toolbar,
  Typography
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetCurrentMutation } from "../../api/userApi";
import { selectCurrentUser, setUserInfo } from "../../redux/authSlice";
import SearchBarNav from "./SearchBarNav";
import SideBar from "./SideBar";

const useStyle = makeStyles((theme: any) => ({
  navBarContent: {
    display: "flex",
    flexGrow: 1,
    marginLeft: "10px",
  },
  navBar: {
    backgroundColor: "#ecf1f1",
    color: "#232629",
    borderTop: "2px solid #f48225",
  },
  btnContain: {
    display: "flex",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  searchBarRoot: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "flex-end",
    marginRight: "10px",
  },
}));

const Layout = () => {
  const classes = useStyle();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isHide, setIsHide] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const token = Cookies.get("token");

  const [getUser] = useGetCurrentMutation();

  const handleNavigate = (type: string) => {
    setIsSideBarOpen(false);
    navigate(`/${type}`);
  };

  const checkUser = React.useCallback(async () => {
    if (!currentUser && token) {
      const resp = await getUser(token).unwrap();

      dispatch(setUserInfo({ user: resp.user, token: token }));
    }
  }, [currentUser, dispatch, getUser, token]);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  useEffect(() => {
    if (/login|register/.test(pathname)) {
      setIsHide(true);
    } else {
      setIsHide(false);
    }
  }, [pathname]);

  if (isHide) {
    return <div></div>;
  }

  return (
    <>
      <AppBar position="static" sx={{ mb: "20px" }}>
        <Toolbar className={classes.navBar}>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            color="inherit"
            sx={{ mr: 2 }}
            onClick={() => setIsSideBarOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            NahAsk
          </Typography>
          <Box className={classes.navBarContent}>
            <SearchBarNav
              classNameSearchBar={{
                maxWidth: "300px",
                maxHeight: "40px",
              }}
              classRoot={{
                display: "flex",
                flexGrow: 1,
                justifyContent: "flex-end",
                marginRight: "10px",
              }}
            />
            {!token && (
              <div className={classes.btnContain}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    textTransform: "capitalize",
                    ml: "5px",
                  }}
                  onClick={() => handleNavigate("register")}
                >
                  register
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    textTransform: "capitalize",
                    ml: "5px",
                  }}
                  onClick={() => handleNavigate("login")}
                >
                  Login
                </Button>
              </div>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor={"left"}
        open={isSideBarOpen}
        onClose={() => setIsSideBarOpen(false)}
      >
        <SideBar handleNavigate={handleNavigate} currentUser={currentUser} />
      </Drawer>
    </>
  );
};

export default Layout;
