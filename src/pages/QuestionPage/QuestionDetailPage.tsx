import { Avatar, Box, Container, Divider, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
import { selectCurrentUser } from "../../redux/authSlice";
import { pathName } from "../../router/pathName";
import { constantValue } from "../../util/constant";
import { text } from "../../util/Text";

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
  const { data, isLoading } = useGetQuestionDetailQuery(id);
  const [comment, setComment] = useState<[IComment]>();
  const [approveQuestion] = useApprovedBlogMutation();

  const handleApproveBtn = async () => {
    if (token && data) {
      await approveQuestion({
        id: data?.blog._id,
        token: token,
      });

      navigate(pathName.questions);
    }
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
        const result = data.blog.comment?.slice().sort((x: IComment, y: IComment) => {
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
      <Loading open={isLoading} height={80} />
      {data && (
        <>
          <Box className={classes.titleContain}>
            <Box display="flex" justifyContent="space-between">
              <Typography mb="20px" variant="h4" sx={{ flex: 1 }}>
                {data.blog?.title}
              </Typography>
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
          {data && currUser && <CreateComment data={currUser} />}
          <Divider />
          {data.blog &&
            comment &&
            comment.map((item) => {
              if(data.blog.answer?.length) {
                return <Comment key={item._id} data={item} isAnswer={item._id === data.blog.answer[0]._id} />
              }
              return <Comment key={item._id} data={item}/>
            })}
        </>
      )}
    </Container>
  );
};

export default QuestionDetailPage;
