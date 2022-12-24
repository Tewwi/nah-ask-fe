import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetSignMutation, useRegisterMutation } from "../../api/authApi";
import { useUploadImgMutation } from "../../api/uploadApi";
import Loading from "../../components/common/Loading";
import { IRegister } from "../../interface/AuthInterface";
import { toggleSnack } from "../../redux/snackSlice";
import { pathName } from "../../router/pathName";
import { constantValue } from "../../util/constant";
import { createFormData } from "../../util/createFormDataFile";
import {
  checkErrorField,
  checkFile,
  getErrorMessage,
} from "../../util/handleError";
import { text } from "../../util/Text";

const useStyle = makeStyles(() => ({
  errorContain: {
    padding: "15px",
    backgroundColor: "#ff8181",
    width: "100%",
    borderRadius: "5px",
  },
}));

const RegisterPage = () => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<IRegister>({
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      re_password: "",
    },
  });

  const classes = useStyle();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<File>();
  const [previewImg, setPreviewImg] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [fileError, setFileError] = useState<boolean | string>(false);
  const [getSign] = useGetSignMutation();
  const [register, { error: registerError }] =
    useRegisterMutation();
  const [upload, { error: cloudError }] =
    useUploadImgMutation();
  const defaultAvatar = {
    url: "https://res.cloudinary.com/dqlcjscsz/image/upload/v1665657617/avatar_aho9f1.jpg",
    publicID: "avatar_aho9f1",
  };

  const handleClickAvatar = () => {
    if (imgInputRef.current) {
      imgInputRef.current.click();
    }
  };

  const handleOnchangeAvatar = (file: any) => {
    const error = checkFile(file);

    if (error) {
      setFileError(error);
    }

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function (e) {
      setPreviewImg([reader.result]);
    };

    setAvatar(file);
  };

  const onSubmit = async (formValues: IRegister) => {
    setIsLoading(true);

    let tempAvatar = defaultAvatar;

    if (process.env.REACT_APP_CLOUDINARY_API && avatar) {
      const { timestamp, signature } = await getSign().unwrap();

      const response: any = await upload(
        createFormData(avatar, signature, timestamp)
      );

      const respJson = response?.data;
      if (respJson) {
        tempAvatar.url = respJson.url;
        tempAvatar.publicID = respJson.public_id;
      }
    }

    const result = {
      ...formValues,
      avatar: tempAvatar,
    };

    try {
      const res = await register(result).unwrap();
      
      if (res && res.message?.includes("success")) {
        navigate(pathName.login);
        dispatch(toggleSnack({ status: true, message: text.SignUpSucces }));
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      {isLoading && <Loading height={80} open={isLoading} />}
      <Container component="main" maxWidth="xs" sx={{ padding: 0 }}>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div onClick={handleClickAvatar}>
            <Tooltip title="Set Avatar">
              <Avatar
                src={previewImg || constantValue.defaultAvatar}
                sx={{ m: 1, bgcolor: "#f48225", width: 70, height: 70 }}
              ></Avatar>
            </Tooltip>
            <Controller
              name="avatar"
              control={control}
              render={({ ...field }) => (
                <TextField
                  {...field}
                  inputRef={imgInputRef}
                  onChange={(e: React.ChangeEvent<any>) => {
                    if (e.target.files) {
                      handleOnchangeAvatar(e.target.files[0]);
                    }
                  }}
                  type="file"
                  style={{ display: "none" }}
                />
              )}
            />
          </div>
          <Typography component="h1" variant="h5">
            {text.SignUp}
          </Typography>
          {(registerError || cloudError || fileError) && (
            <Box className={classes.errorContain}>
              <Typography variant="body2">
                {fileError || getErrorMessage(registerError || cloudError)}
              </Typography>
            </Box>
          )}
          <Box>
            <Controller
              name="userName"
              control={control}
              rules={{
                required: { value: true, message: text.FieldRequierd },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  sx={{ width: "100%" }}
                  label={text.UserName}
                  autoFocus
                  error={checkErrorField(errors.userName)}
                  helperText={errors.userName?.message || ""}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              rules={{
                required: { value: true, message: text.FieldRequierd },
                pattern: {
                  value: constantValue.regexEmail,
                  message: "This field must be email",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={{ width: "100%" }}
                  margin="normal"
                  label="Email"
                  error={checkErrorField(errors.email)}
                  helperText={errors.email?.message || ""}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{
                required: { value: true, message: text.FieldRequierd },
                minLength: {
                  value: 6,
                  message: text.FieldLengthRequierd,
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={{ width: "100%" }}
                  margin="normal"
                  autoComplete="on"
                  label={text.Password}
                  type="password"
                  error={checkErrorField(errors.password)}
                  helperText={errors.password?.message || ""}
                />
              )}
            />
            <Controller
              name="re_password"
              control={control}
              rules={{
                required: { value: true, message: text.FieldRequierd },
                validate: {
                  value: (value) =>
                    value === watch("password") || text.wrong_repeat_password,
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={{ width: "100%" }}
                  margin="normal"
                  autoComplete="on"
                  label={text.RepeatPassword}
                  type="password"
                  error={checkErrorField(errors.re_password)}
                  helperText={errors.re_password?.message || ""}
                />
              )}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {text.SignUp}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  {text.SignUpBottomText}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default RegisterPage;
