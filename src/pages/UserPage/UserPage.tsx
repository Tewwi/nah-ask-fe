import { Box, Container, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  useChangeRoleUserMutation,
  useGetUserByIDQuery,
} from "../../api/userApi";
import QuestionItem from "../../components/question/QuestionItem";
import QuestionSkeletonLoading from "../../components/question/QuestionSkeletonLoading";
import UserInfoCard from "../../components/user/UserInfoCard";
import { IQuestion } from "../../interface/QuestionItemInterface";
import { logOut } from "../../redux/authSlice";
import { toggleSnack } from "../../redux/snackSlice";
import { text } from "../../util/Text";

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
  const [setRole, { isLoading: setRoleLoading }] = useChangeRoleUserMutation();

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
      const resp = await setRole({ token: token, id: data.user._id });
      console.log(resp);
      dispatch(toggleSnack({ status: true, message: text.Success }));
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
            userData={data?.user}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} md={8} className={classes.userPageBody}>
          <Typography mb="20px" variant="h4">
            Tất cả câu hỏi {data?.user.userName}
          </Typography>
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
