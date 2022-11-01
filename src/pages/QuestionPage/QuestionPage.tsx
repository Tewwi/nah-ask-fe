import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Pagination,
  Stack,
} from "@mui/material";
import QuestionItem from "../../components/question/QuestionItem";
import { IQuestion } from "../../interface/QuestionItemInterface";
import QuestionSkeletonLoading from "../../components/question/QuestionSkeletonLoading";
import NotFoundContent from "../ErrorPage/NotFoundContent";
import { useNavigate } from "react-router-dom";
import { pathName } from "../../router/pathName";
import { useGetApprovedBlogMutation } from "../../api/blogApi";
import { makeStyles } from "@mui/styles";
import { text } from "../../util/Text";

const useStyle = makeStyles((theme: any) => ({
  root: {
    minHeight: "calc(100vh - 84px)",
    display: "flex !important",
    flexDirection: "column",
  },
  actionSection: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  btn: {
    maxWidth: "150px",
    [theme.breakpoints.down("sm")]: {
      alignSelf: "flex-end",
    },
  },
}));

const QuestionPage = () => {
  const classes = useStyle();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [getData, { data, isLoading, error }] = useGetApprovedBlogMutation();

  const handleChangePath = (path: string) => {
    navigate(path);
  };

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const fetchQuestion = React.useCallback(async () => {
    await getData(page);
  }, [getData, page]);

  const totalPage = React.useMemo(() => {
    if (data) {
      const total = Math.ceil(Number(data.total) / 10);
      
      return total || 1;
    }

    return 1;
  }, [data]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  return (
    <Container maxWidth="md" className={classes.root}>
      <Box className={classes.actionSection}>
        <Typography variant="h4">{text.AllQuestion}</Typography>
        <Button
          onClick={() => handleChangePath(pathName.create)}
          variant="contained"
          sx={{ textTransform: "capitalize" }}
          className={classes.btn}
        >
          {text.NewQuestion}
        </Button>
      </Box>
      {!data && isLoading && <QuestionSkeletonLoading />}
      {data && (
        <>
          <Box flex={1}>
            {data.data.map((item: IQuestion) => (
              <QuestionItem key={item._id} data={item} />
            ))}
          </Box>
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
        </>
      )}
      {!data && error && <NotFoundContent />}
    </Container>
  );
};

export default QuestionPage;
