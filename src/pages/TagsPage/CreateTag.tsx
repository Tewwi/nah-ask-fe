import React from "react";
import { Box, Container, TextField, Typography, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateTagMutation } from "../../api/tagApi";
import Loading from "../../components/common/Loading";
import { ICreateTag } from "../../interface/QuestionItemInterface";
import { IUser } from "../../interface/UserInterface";
import { selectCurrentUser } from "../../redux/authSlice";
import { checkErrorField } from "../../util/handleError";
import { pathName } from "../../router/pathName";
import { text } from "../../util/Text";
import { toggleSnack } from "../../redux/snackSlice";

const useStyle = makeStyles(() => ({
  mainContent: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    boxShadow:
      "0 1px 3px hsla(0,0%,0%,0.06), 0 2px 6px hsla(0, 0%, 0%, 0.06), 0 3px 8px hsla(0, 0%, 0%, 0.09)",
    padding: "16px",
    margin: "24px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "10px",
  },
}));

const CreateTag = () => {
  const classes = useStyle();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ICreateTag>({
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const token = Cookies.get("token");
  const currUser: IUser | null = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createTag, { isLoading }] = useCreateTagMutation();

  const onSubmit = async (formValue: ICreateTag) => {
    if (currUser && token && currUser.role === "admin") {
      const resp = await createTag({ token: token, body: formValue }).unwrap();

      if (resp) {
        dispatch(toggleSnack({ status: true, message: text.Success }));
        navigate(pathName.tag);
      }
    }
  };

  return (
    <>
      {isLoading && <Loading height={80} open={isLoading} />}
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ margin: "24px 0px" }}>
          {text.NewTag}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className={classes.mainContent}
        >
          <Box className={classes.section}>
            <Typography variant="h5">
              {text.TagName}
              <span style={{ color: "red" }}>*</span>
            </Typography>
            <Typography variant="subtitle2">{text.TagNameDesc}</Typography>

            <Controller
              name="name"
              control={control}
              rules={{
                required: { value: true, message: text.FieldRequierd },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  sx={{ width: "100%", marginTop: "5px" }}
                  autoFocus
                  error={checkErrorField(errors.name)}
                  helperText={errors.name?.message || ""}
                />
              )}
            />
          </Box>

          <Box className={classes.section}>
            <Typography variant="h5">
              {text.TagDescription}
              <span style={{ color: "red" }}>*</span>
            </Typography>
            <Typography variant="subtitle2">{text.TagDescHint}</Typography>

            <Controller
              name="description"
              control={control}
              rules={{
                required: { value: true, message: text.FieldRequierd },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  multiline
                  minRows={5}
                  maxRows={Infinity}
                  margin="normal"
                  sx={{ width: "100%", marginTop: "5px" }}
                  error={checkErrorField(errors.description)}
                  helperText={errors.description?.message || ""}
                />
              )}
            />
          </Box>

          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              type="submit"
              sx={{
                textTransform: "capitalize",
                width: 200,
                height: 40,
                marginTop: "20px",
              }}
            >
              {text.Createtag}
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default CreateTag;
