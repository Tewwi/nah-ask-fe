import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetTagListMutation } from "../../api/tagApi";
import TagItem from "../../components/tag/TagItem";
import { ITag } from "../../interface/QuestionItemInterface";
import { IUser } from "../../interface/UserInterface";
import { selectCurrentUser } from "../../redux/authSlice";
import { pathName } from "../../router/pathName";
import { text } from "../../util/Text";

const useStyle = makeStyles((theme: any) => ({
  actionContain: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "20px 0px",
    [theme.breakpoints.down("sm")]: {
      alignItems: "normal",
      flexDirection: "column",
      justifyContent: "flex-end",
    },
  },
  searchBar: {
    maxWidth: "300px",
    maxHeight: "40px",
    margin: "20px 0px",
    "& .MuiInputBase-root": {
      height: "40px",
    },
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
    },
  },
}));

const ListTagsPage = () => {
  const classes = useStyle();
  const navigate = useNavigate();
  const currentUser: IUser | null = useSelector(selectCurrentUser);
  const [tags, setTags] = useState<[ITag]>();
  const [getTags] = useGetTagListMutation();
  const isAdmin = currentUser && currentUser.role === "admin";

  const handleChangePage = (path: string) => {
    navigate(path);
  };

  const handleGetTags = React.useCallback(async () => {
    const resp = await getTags("").unwrap();

    if (resp && resp.message?.includes("success")) {
      setTags(resp.data);
    }
  }, [getTags]);

  const getTagData = _.debounce(async (value: string) => {
    const resp = await getTags(value).unwrap();
    setTags(resp.data);
  }, 500);

  useEffect(() => {
    if (!tags) {
      handleGetTags();
    }
  }, [handleGetTags, tags]);

  return (
    <>
      <Container maxWidth="md">
        <Typography variant="h4" mb="10px">
          {text.Tag}
        </Typography>
        <Typography variant="body1">{text.TagPageDesc}</Typography>
        <Box className={classes.actionContain}>
          <TextField
            onChange={(e) => {
              getTagData(e.target.value);
            }}
            placeholder="Search Tag Name"
            className={classes.searchBar}
          />
          {isAdmin && (
            <Button
              onClick={() =>
                handleChangePage(`${pathName.tag}${pathName.create}`)
              }
              variant="contained"
              sx={{ textTransform: "capitalize", maxHeight: "40px", maxWidth: '150px' }}
            >
              {text.NewTag}
            </Button>
          )}
        </Box>
        <Grid
          container
          spacing={{ xs: 2, md: 2 }}
          columns={{ xs: 0, sm: 0, md: 12 }}
          justifyContent={{ md: "flex-start", xs: "center" }}
        >
          {tags &&
            tags.map((tag) => {
              return (
                <Grid item key={tag._id} xs={12} sm={12} md={4}>
                  <TagItem data={tag} />
                </Grid>
              );
            })}
        </Grid>
      </Container>
    </>
  );
};

export default ListTagsPage;
