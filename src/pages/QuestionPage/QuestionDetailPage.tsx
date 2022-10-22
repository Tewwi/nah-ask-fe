import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useApprovedBlogMutation,
  useGetQuestionDetailQuery,
} from "../../api/blogApi";
import Comment from "../../components/comment/Comment";
import CreateComment from "../../components/comment/CreateComment";
import QuestionDetailBody from "../../components/question/QuestionDetailBody";
import { selectCurrentUser } from "../../redux/authSlice";
import { pathName } from "../../router/pathName";
import { constantValue } from "../../util/constant";
import Cookies from "js-cookie";

const useStyle = makeStyles((theme) => ({
  titleContain: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
    padding: "10px",
  },
  questionInfo: {
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    marginBottom: "10px",
  },
}));

const QuestionDetailPage = () => {
  const { id } = useParams() as { id: string };
  const classes = useStyle();
  const token = Cookies.get("token");
  const currUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetQuestionDetailQuery(id);
  const [approveQuestion] = useApprovedBlogMutation();

  const handleApproveBtn = async () => {
    if (token && data) {
      const resp = await approveQuestion({
        id: data?.blog._id,
        token: token,
      });

      console.log(resp);
      navigate(pathName.questions);
    }
  };

  return (
    <Container maxWidth="md">
      {data && (
        <>
          <Box className={classes.titleContain}>
            <Box display="flex" justifyContent="space-between">
              <Typography mb="20px" variant="h4" sx={{ flex: 1 }}>
                {data.blog?.title}
              </Typography>
              {!data.blog.approve && (
                <Button
                  onClick={handleApproveBtn}
                  variant="contained"
                  sx={{
                    textTransform: "capitalize",
                    height: "40px",
                    padding: "10px",
                  }}
                >
                  approve
                </Button>
              )}
            </Box>
            <Box className={classes.questionInfo}>
              <Typography mr="5px" variant="body2">
                By:
              </Typography>
              <Avatar
                src={`${constantValue.imgUrl}/${data.blog?.author.avatar}`}
                sx={{ mr: "5px", width: 30, height: 30 }}
              />{" "}
              <Typography mr="20px" variant="body2">
                <Link
                  style={{ textDecoration: "none" }}
                  to={`/${pathName.user}/${data.blog?.author._id}`}
                >
                  {data.blog?.author.userName}
                </Link>
              </Typography>
              <Typography mr="20px" variant="body2">
                Create At: {dayjs(data.blog?.createAt).format("DD-MM-YYYY")}
              </Typography>
            </Box>
            <Divider />
          </Box>
          <QuestionDetailBody data={data.blog} />
          <Divider />
          {data && currUser && <CreateComment data={currUser} />}
          <Divider />
          {data.blog &&
            data.blog.comment?.map((item) => (
              <Comment key={item._id} data={item} />
            ))}
        </>
      )}
    </Container>
  );
};

export default QuestionDetailPage;
