import {
  Box,
  Button,
  Container,
  FormControl,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import qs from "querystringify";
import React, { useEffect, useState } from "react";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import { useGetApprovedBlogMutation } from "../../api/blogApi";
import QuestionItem from "../../components/question/QuestionItem";
import QuestionSkeletonLoading from "../../components/question/QuestionSkeletonLoading";
import { IQuestion } from "../../interface/QuestionItemInterface";
import { pathName } from "../../router/pathName";
import { filterOption, IFilterOption } from "../../util/filterOption";
import { text } from "../../util/Text";
import NotFoundContent from "../ErrorPage/NotFoundContent";

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
  filterContain: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "20px",
  },
}));

interface IQuery {
  p?: string;
  sort: "ascending" | "descending";
  sortBy?: string;
}
const QuestionPage = () => {
  const classes = useStyle();
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<IFilterOption>(filterOption[0]);
  const [filterIndex, setFilterIndex] = useState<Number>(0);
  const [getData, { data, isLoading, error }] = useGetApprovedBlogMutation();

  const handleChangePath = (path: string) => {
    navigate(path);
  };

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const handleFilter = (e: any) => {
    if (e?.props) {
      setFilterIndex(e.props.value);
      navigate({
        search: createSearchParams({
          p: "1",
          sortBy: filterOption[e.props.value].sortBy,
          sort: filterOption[e.props.value].sort,
        }).toString(),
      });
    }
  };

  const fetchQuestion = React.useCallback(async () => {
    await getData({ p: page, sort: sort.sort, sortBy: sort.sortBy });
  }, [getData, page, sort]);

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

  useEffect(() => {
    const sortObj: IQuery = qs.parse(location.search) as IQuery;

    if (sortObj && sortObj.p && Number(sortObj.p) !== page) {
      setPage(Number(sortObj.p));
    }

    if (sortObj && sortObj?.sort && sortObj?.sortBy) {
      const index = filterOption.findIndex(
        (item) => item.sort === sortObj?.sort && item.sortBy === sortObj?.sortBy
      );

      if (index) {
        setFilterIndex(index);
      }

      setSort({ sort: sortObj.sort, sortBy: sortObj?.sortBy });
    }
  }, [location.search, page]);

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

      {/* {data && (
        
      )} */}

      {data && (
        <>
          <Box className={classes.filterContain}>
            <FormControl sx={{ minWidth: "250px" }}>
              <Select
                id="simple-select"
                onChange={(_, e: any) => {
                  handleFilter(e);
                }}
                value={filterIndex}
                defaultValue={0}
                displayEmpty
                sx={{ height: "42px" }}
              >
                {filterOption.map((item, index) => {
                  return (
                    <MenuItem key={index} value={index}>
                      {item.text}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
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
