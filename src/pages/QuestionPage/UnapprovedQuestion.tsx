import { Container, Box, Typography } from "@mui/material";
import Cookies from "js-cookie";
import React from "react";
import { useGetUnapprovedBlogQuery } from "../../api/blogApi";
import QuestionItem from "../../components/question/QuestionItem";
import QuestionSkeletonLoading from "../../components/question/QuestionSkeletonLoading";
import { IQuestion } from "../../interface/QuestionItemInterface";
import NotFoundContent from "../ErrorPage/NotFoundContent";

const UnapprovedQuestion = () => {
  const token = Cookies.get("token");
  const { data, error, isLoading } = useGetUnapprovedBlogQuery(token || "");

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="space-between" marginBottom="20px">
        <Typography variant="h4">All Unapproved Question</Typography>
      </Box>
      {!data && isLoading && <QuestionSkeletonLoading />}
      {data &&
        data.data.map((item: IQuestion) => (
          <QuestionItem isHaveMenu={true} key={item._id} data={item} />
        ))}
      {!data && error && <NotFoundContent />}
    </Container>
  );
};

export default UnapprovedQuestion;
