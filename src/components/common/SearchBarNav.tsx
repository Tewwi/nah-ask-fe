import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { makeStyles } from "@mui/styles";
import { Box, InputAdornment, TextField } from "@mui/material";
interface ISearchBarNav {
  classNameSearchBar?: Object;
  classRoot?: Object;
}

const useStyle = makeStyles(() => ({
  root: {
    minHeight: "calc(100vh - 84px)",
    display: "flex !important",
    flexDirection: "column",
  },
  customInput: {
    "& .MuiInputBase-root": {
      height: "40px",
    },
  },
}));

const SearchBarNav = ({
  classNameSearchBar = {},
  classRoot = {},
}: ISearchBarNav) => {
  const navigate = useNavigate();
  const classes = useStyle();
  const { handleSubmit, control } = useForm();

  const onSubmit = (data: any) => {
    navigate(`/search?query=${data.nav_bar_search}`);
  };

  const handlePressEnter = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      handleSubmit(onSubmit);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={classRoot}>
      <Controller
        name="nav_bar_search"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <div style={classRoot}>
            <TextField
              {...field}
              type="text"
              placeholder="Search Here"
              style={classNameSearchBar}
              className={classes.customInput}
              onKeyDown={(e) => {
                handlePressEnter(e);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      display="flex"
                      sx={{ cursor: "pointer" }}
                      onClick={handleSubmit(onSubmit)}
                    >
                      <SearchIcon />
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        )}
      />
    </form>
  );
};

export default SearchBarNav;
