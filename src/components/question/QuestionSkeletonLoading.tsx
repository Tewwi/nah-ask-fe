import { Box, Divider, Skeleton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyle = makeStyles((theme) => ({
  questionContain: {
    padding: "12px",
    // flexDirection: 'row'
  },
  questionInfo: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    marginLeft: "30px",
  },
}));

const QuestionSkeletonLoading = () => {
  const classes = useStyle();

  return (
    <>
      {Array.from(Array(10)).map((_, index) => {
        return (
          <div key={index}>
            <Divider />
            <Box display="flex" className={classes.questionContain}>
              <Box display="flex" flexDirection="column">
                <Typography variant="subtitle2" mt="10px">
                  <Skeleton width={60} />
                </Typography>
                <Typography variant="subtitle2" mt="10px">
                  <Skeleton width={60} />
                </Typography>
              </Box>
              <Box className={classes.questionInfo}>
                <Typography variant="h5" mb="3px">
                  <Skeleton width="80%" />
                </Typography>
                <Typography variant="body1" mb="3px">
                  <Skeleton width="70%" />
                </Typography>
                <Typography variant="body1" mb="3px">
                  <Skeleton width="70%" />
                </Typography>
              </Box>
            </Box>
          </div>
        );
      })}
    </>
  );
};

export default QuestionSkeletonLoading;
