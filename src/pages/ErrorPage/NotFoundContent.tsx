import { Box, Container, Typography } from "@mui/material";
import React from "react";
import { constantValue } from "../../util/constant";

const NotFoundContent = () => {
  return (
    <Container maxWidth="md">
      <Box display="flex" flexDirection="column">
        <Typography
          mb="20px"
          mt="20px"
          variant="h5"
          sx={{ textAlign: "center" }}
        >
          Không tìm thấy trang
        </Typography>
        <img
          style={{ height: "450px" }}
          src={constantValue.notFoundImg}
          alt="empty"
        />
      </Box>
    </Container>
  );
};

export default NotFoundContent;
