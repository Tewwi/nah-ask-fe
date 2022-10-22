import React from "react";
import { Controller, useForm } from "react-hook-form";
import SearchBar from "material-ui-search-bar";
import { useNavigate } from "react-router-dom";

interface ISearchBarNav {
  classNameSearchBar?: Object;
  classRoot?: Object 
}

const SearchBarNav = ({ classNameSearchBar = {}, classRoot = {} }: ISearchBarNav) => {
  const navigate = useNavigate();
  const { handleSubmit, control, reset } = useForm();

  const onSubmit = (data: any) => {
    navigate(`/search?query=${data.nav_bar_search}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={classRoot}>
      <Controller
        name="nav_bar_search"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <SearchBar
            {...field}
            cancelOnEscape
            style={classNameSearchBar}
            onCancelSearch={reset}
          />
        )}
      />
    </form>
  );
};

export default SearchBarNav;
