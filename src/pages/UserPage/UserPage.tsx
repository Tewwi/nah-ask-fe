import React from "react";
import { Grid, Box, Container, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetUserByIDQuery } from "../../api/userApi";
import UserInfoCard from "../../components/user/UserInfoCard";
import { makeStyles } from "@mui/styles";
import QuestionSkeletonLoading from "../../components/question/QuestionSkeletonLoading";
import QuestionItem from "../../components/question/QuestionItem";
import { IQuestion } from "../../interface/QuestionItemInterface";

const useStyle = makeStyles((theme: any) => ({
  root: {
    [theme.breakpoints.down("md")]: {
      flexDirection: "column !important",
      alignItems: 'center',
    },
  },
  listQuestion: {
    display: "flex",
    flexDirection: "column",
  },
  userPageBody: {
    [theme.breakpoints.down("md")]: {
    },
  }
}));

const UserPage = () => {
  const { id } = useParams() as { id: string };
  const classes = useStyle();
  const { data, isLoading } = useGetUserByIDQuery(id);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} className={classes.root}>
        <Grid item xs={12} md={4}>
          <UserInfoCard userData={data?.user} isLoading={isLoading} />
        </Grid>
        <Grid item xs={12} md={8} className={classes.userPageBody}>
          <Typography mb="20px" variant="h4">
            All Question of {data?.user.userName}
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
