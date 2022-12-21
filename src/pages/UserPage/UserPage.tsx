import { Box, Container, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  useBlockUserMutation,
  useChangeRoleUserMutation,
  useGetUserByIDQuery,
} from "../../api/userApi";
import QuestionItem from "../../components/question/QuestionItem";
import QuestionSkeletonLoading from "../../components/question/QuestionSkeletonLoading";
import UserInfoCard from "../../components/user/UserInfoCard";
import { IQuestion } from "../../interface/QuestionItemInterface";
import { IUser } from "../../interface/UserInterface";
import { logOut, selectCurrentUser } from "../../redux/authSlice";
import { toggleSnack } from "../../redux/snackSlice";
import { text } from "../../util/Text";
import { constantValue } from "../../util/constant";

const useStyle = makeStyles((theme: any) => ({
  root: {
    [theme.breakpoints.down("md")]: {
      flexDirection: "column !important",
      alignItems: "center",
    },
  },
  userAction: {
    display: "flex",
    flexDirection: "column",
  },
  actionBtn: {
    display: "flex",
    margin: "auto",
  },
  listQuestion: {
    display: "flex",
    flexDirection: "column",
  },
  userPageBody: {
    [theme.breakpoints.down("md")]: {},
  },
}));

const UserPage = () => {
  const { id } = useParams() as { id: string };
  const classes = useStyle();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, isLoading } = useGetUserByIDQuery(id);
  const token = Cookies.get("token");
  const currUser: IUser | null = useSelector(selectCurrentUser);
  const isAdmin = currUser && currUser.role === "admin";
  const [setRole] = useChangeRoleUserMutation();
  const [blockUser] = useBlockUserMutation();

  const handleChangePath = (path: string) => {
    navigate(path);
  };

  const handleLogOut = () => {
    Cookies.remove("token");
    dispatch(logOut());
    handleChangePath("");
  };

  const handleSetRole = async () => {
    if (token && data) {
      await setRole({ token: token, id: data.user._id });
      dispatch(toggleSnack({ status: true, message: text.Success }));
    }
  };

  const handleBlockUser = async () => {
    if (isAdmin && data?.user.role !== "admin" && token) {
      await blockUser({ id: id, token: token });
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} className={classes.root}>
        <Grid
          item
          xs={12}
          md={4}
          className={classes.userAction}
          sx={{ flexDirection: "column" }}
        >
          <UserInfoCard
            handleChangePassword={handleChangePath}
            handleLogOut={handleLogOut}
            handleSetRole={handleSetRole}
            handleBlockUser={handleBlockUser}
            userData={data?.user}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} md={8} className={classes.userPageBody}>
          {data?.blog.length === 0 ? (
            <Box display="flex" flexDirection="column">
              <Typography
                mb="20px"
                mt="20px"
                variant="h5"
                sx={{ textAlign: "center" }}
              >
                {data?.user.userName} hiện tại chưa có câu hỏi nào
              </Typography>
              <img
                style={{ height: "450px" }}
                src={constantValue.emptyImgLink}
                alt="empty"
              />
            </Box>
          ) : (
            <Typography mb="20px" variant="h4">
              Tất cả câu hỏi {data?.user.userName}
            </Typography>
          )}

          {!data && isLoading && <QuestionSkeletonLoading />}
          {data && (
            <Box className={classes.listQuestion}>
              {data.blog.map((item: IQuestion) => (
                <QuestionItem key={item._id} data={item} />
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserPage;
