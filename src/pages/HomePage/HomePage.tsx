import { Box, Link, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SearchBarNav from "../../components/common/SearchBarNav";
import { constantValue } from "../../util/constant";
import EastIcon from "@mui/icons-material/East";

const useStyle = makeStyles((theme: any) => ({
  root: {
    height: "calc(100vh - 64px)",
    width: "100vw",
    marginTop: "-20px",
    opacity: "1",
    zIndex: -1,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  textContain: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: "50px",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "30px",
    },
  },
}));

const HomePage = () => {
  const classes = useStyle();

  return (
    <Box
      className={classes.root}
      sx={{
        backgroundImage: `linear-gradient(to right, #fff, rgba(255,0,0,0)), url(${constantValue.heroImgLink})`,
      }}
    >
      <Box className={classes.textContain}>
        <Typography variant="h2">NahAsk</Typography>
        <Box mb="100px" display="flex" width="100%" mt="20px">
          <SearchBarNav
            classNameSearchBar={{
              width: "30%",
              minWidth: "300px",
            }}
            classRoot={{ width: "100%" }}
            subText={
              <Link
                display="flex"
                variant="subtitle2"
                mt="10px"
                sx={{
                  cursor: "pointer",
                  fontStyle: "italic",
                  opacity: 0.8,
                  color: "black",
                }}
                href="/question"
              >
                Đến trang tất cả câu hỏi{" "}
                <EastIcon sx={{ ml: "5px" }} fontSize="small" />
              </Link>
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
