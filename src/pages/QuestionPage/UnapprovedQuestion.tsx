import { Container, Box, Typography, Stack, Pagination } from "@mui/material";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import { useGetUnapprovedBlogQuery } from "../../api/blogApi";
import QuestionItem from "../../components/question/QuestionItem";
import QuestionSkeletonLoading from "../../components/question/QuestionSkeletonLoading";
import { IQuestion } from "../../interface/QuestionItemInterface";
import { text } from "../../util/Text";
import qs from "querystringify";
import NotFoundContent from "../ErrorPage/NotFoundContent";

interface IQuery {
  p?: string;
}

const UnapprovedQuestion = () => {
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useGetUnapprovedBlogQuery({
    page,
    token: token || "",
  });

  const totalPage = React.useMemo(() => {
    if (data) {
      const total = Math.ceil(Number(data.total) / 10);
      return total || 1;
    }

    return 1;
  }, [data]);

  const handleChangePage = (page: number) => {
    const sortObj: IQuery = qs.parse(location.search) as IQuery;
    const newQuery = { ...sortObj, p: page };
    navigate({
      search: createSearchParams(qs.stringify(newQuery)).toString(),
    });
    setPage(page);
  };

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="space-between" marginBottom="20px">
        <Typography variant="h4">{text.AllUnapprovedQuestion}</Typography>
      </Box>
      {!data && isLoading && <QuestionSkeletonLoading />}
      {data &&
        data.data.map((item: IQuestion) => (
          <QuestionItem key={item._id} data={item} />
        ))}
      {!data && error && <NotFoundContent />}
      <Stack
        sx={{
          margin: "15px 0px",
        }}
        spacing={2}
      >
        <Pagination
          page={page}
          sx={{ display: "flex", justifyContent: "center" }}
          onChange={(e, page) => {
            handleChangePage(page);
          }}
          count={totalPage}
        />
      </Stack>
    </Container>
  );
};

export default UnapprovedQuestion;
