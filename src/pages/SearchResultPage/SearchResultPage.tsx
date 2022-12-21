import {
  Box,
  Container,
  Pagination,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useFindBlogMutation } from "../../api/blogApi";
import { useGetTagByIDMutation } from "../../api/tagApi";
import QuestionItem from "../../components/question/QuestionItem";
import QuestionSkeletonLoading from "../../components/question/QuestionSkeletonLoading";
import { IQuestion, ITag } from "../../interface/QuestionItemInterface";
import { constantValue } from "../../util/constant";
import { text } from "../../util/Text";

const useStyle = makeStyles(() => ({
  root: {
    minHeight: "calc(100vh - 84px)",
    display: "flex !important",
    flexDirection: "column",
  },
}));

const SearchResultPage = () => {
  const [searchParams] = useSearchParams();
  const classes = useStyle();
  const [getTagInfo, { isLoading: getTagLoading }] = useGetTagByIDMutation();
  const [getData, { data, error, isLoading }] = useFindBlogMutation();
  const [searchTag, setSearchTag] = useState<ITag>();
  const [page, setPage] = useState(1);

  const queryApi = searchParams.toString();
  const query = searchParams.get("query") || "";
  const tag = searchParams.get("tag");

  const resultText = tag ? `thẻ "${searchTag?.name}"` : `"${query}"`;

  const handleGetTagData = React.useCallback(async () => {
    if (tag) {
      const resp = await getTagInfo(tag).unwrap();

      setSearchTag(resp.tag);
    }
  }, [getTagInfo, tag]);

  const handleGetQuestionData = React.useCallback(async () => {
    await getData({
      query: queryApi,
      page: page,
    });
  }, [getData, page, queryApi]);

  const totalPage = React.useMemo(() => {
    if (data) {
      const total = Math.ceil(Number(data.total) / 10);
      console.log(total);
      return total || 1;
    }

    return 1;
  }, [data]);

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  useEffect(() => {
    if (!searchTag && tag) {
      handleGetTagData();
    } else if (query) {
      setSearchTag(undefined);
    }
  }, [handleGetTagData, query, searchTag, tag]);

  useEffect(() => {
    handleGetQuestionData();
  }, [handleGetQuestionData]);

  return (
    <Container maxWidth="md" className={classes.root}>
      <Box display="flex" flexDirection="column" marginBottom="30px">
        {!getTagLoading && data ? (
          <>
            <Typography variant="h4" mb="20px">
              {data.total} kết quả cho {resultText}
            </Typography>
            {searchTag && (
              <Typography sx={{ wordBreak: "break-word" }} variant="body1">
                {searchTag.description}
              </Typography>
            )}
          </>
        ) : (
          <></>
        )}
        {getTagLoading && !data && (
          <>
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="80%" />
          </>
        )}
      </Box>
      {error && (
        <>
          <Box display="flex" flexDirection="column">
            <Typography
              mb="20px"
              mt="20px"
              variant="h5"
              sx={{ textAlign: "center" }}
            >
              {`${text.NoResult} cho ${resultText}`}
            </Typography>
            <img
              style={{ height: "450px" }}
              src={constantValue.emptyImgLink}
              alt="empty"
            />
          </Box>
        </>
      )}
      {!data && isLoading && <QuestionSkeletonLoading />}
      {data?.blog && !error && (
        <>
          <Box flex={1}>
            {data.blog.map((item: IQuestion) => (
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
    </Container>
  );
};

export default SearchResultPage;
