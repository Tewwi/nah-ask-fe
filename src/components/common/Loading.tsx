import React, { memo } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Backdrop, CircularProgress } from "@mui/material";
const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});

interface LoaderProps {
  height: number;
  open: boolean;
}

const Loading = (props: LoaderProps) => {
  const { height, open } = props;
  const classes = useStyles({ height });

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme: any) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <div className={classes.root} style={{ height: height }}>
        <CircularProgress style={{ color: "#fb8c00" }} />
      </div>
    </Backdrop>
  );
};

export default memo(Loading);
