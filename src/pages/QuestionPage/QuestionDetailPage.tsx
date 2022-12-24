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
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useApprovedBlogMutation,
  useGetQuestionDetailQuery,
} from "../../api/blogApi";
import Comment from "../../components/comment/Comment";
import CreateComment from "../../components/comment/CreateComment";
import Loading from "../../components/common/Loading";
import MoreVertMenu from "../../components/common/MoreVertMenu";
import QuestionDetailBody from "../../components/question/QuestionDetailBody";
import { IComment } from "../../interface/QuestionItemInterface";
import { IUser } from "../../interface/UserInterface";
import { selectCurrentUser } from "../../redux/authSlice";
import { toggleSnack } from "../../redux/snackSlice";
import { pathName } from "../../router/pathName";
import { constantValue } from "../../util/constant";
import { text } from "../../util/Text";
import ChatTwoToneIcon from "@mui/icons-material/ChatTwoTone";

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
  const currUser: IUser | null = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const { data, isLoading: getUserLoading } = useGetQuestionDetailQuery(id);
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState<[IComment]>();
  const [approveQuestion] = useApprovedBlogMutation();
  const dispatch = useDispatch();

  const handleApproveBtn = async () => {
    setIsLoading(true);
    if (token && data) {
      await approveQuestion({
        id: data?.blog._id,
        token: token,
      });

      dispatch(toggleSnack({ status: true, message: text.Success }));
      navigate(pathName.questions);
    }
    setIsLoading(false);
  };

  const compareAnswer = React.useCallback(
    (comment: IComment) => {
      if (data?.blog.answer?.length) {
        return comment._id === data?.blog.answer[0]._id;
      }

      return false;
    },
    [data?.blog.answer]
  );

  useEffect(() => {
    if (data && data.blog) {
      if (data.blog.comment && data.blog.answer?.length) {
        const result = data.blog.comment
          ?.slice()
          .sort((x: IComment, y: IComment) => {
            return Number(compareAnswer(y)) - Number(compareAnswer(x));
          });

        setComment(result as [IComment]);
      } else {
        setComment(data.blog.comment);
      }
    }
  }, [data, compareAnswer]);

  return (
    <Container maxWidth="md">
      <Loading open={isLoading || getUserLoading} height={80} />
      {data && (
        <>
          <Box className={classes.titleContain}>
            <Box display="flex" justifyContent="space-between">
              <Typography
                mb="20px"
                variant="h4"
                sx={{ flex: 1, maxWidth: "85%", overflowWrap: "anywhere" }}
              >
                {data.blog?.title}{" "}
              </Typography>
              {!data.blog.approve && (
                <Button
                  variant="contained"
                  sx={{
                    height: "32px",
                    width: "90px",
                    textTransform: "capitalize",
                    mt: "3px",
                  }}
                  onClick={handleApproveBtn}
                >
                  Duyệt
                </Button>
              )}
              {data && (
                <MoreVertMenu
                  data={data.blog}
                  handleApprove={handleApproveBtn}
                />
              )}
            </Box>
            <Box className={classes.questionInfo}>
              <Typography mr="5px" variant="body2">
                {text.author}
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
                {`${text.createAt} ${dayjs(data.blog?.createAt).format(
                  "DD-MM-YYYY"
                )}`}
              </Typography>
            </Box>
            <Divider />
          </Box>
          <QuestionDetailBody data={data.blog} />
          <Divider />
          {data && data.blog.approve && (
            <>
              <Typography variant="h5" mt="20px">
                Bình luận
              </Typography>
              {currUser && !currUser.isBlock ? (
                <CreateComment data={currUser} />
              ) : (
                <Box display="flex">
                  <Typography
                    variant="h6"
                    sx={{ margin: "20px auto 30px auto", opacity: 0.8 }}
                  >
                    Bạn cần đăng nhập để có thể bình luận
                  </Typography>
                </Box>
              )}
            </>
          )}
          <Divider />
          {data.blog && comment && comment.length > 0 ? (
            comment.map((item) => {
              if (data.blog.answer?.length) {
                return (
                  <Comment
                    key={item._id}
                    data={item}
                    isAnswer={item._id === data.blog.answer[0]._id}
                    blogAuthorId={data.blog.author._id}
                  />
                );
              }
              return (
                <Comment
                  key={item._id}
                  data={item}
                  blogAuthorId={data.blog.author._id}
                />
              );
            })
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              width="100%"
              minHeight="180px"
              mt="25px"
            >
              <ChatTwoToneIcon
                sx={{ fontSize: "100px", marginInline: "auto" }}
              />
              <Typography
                variant="h6"
                sx={{
                  marginInline: "auto",
                  color: "#938e8e",
                  textAlign: "center",
                }}
              >
                {data.blog.approve
                  ? "Bài viết chưa có bình luận nào"
                  : "Bài viết cần được duyệt để có thể bình luận "}
              </Typography>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default QuestionDetailPage;
