import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../api/authApi";
import { ILogin } from "../../interface/AuthInterface";
import { setUserInfo } from "../../redux/authSlice";
import { checkErrorField, getErrorMessage } from "../../util/handleError";
import Cookies from "js-cookie";
import { constantValue } from "../../util/constant";
import Loading from "../../components/common/Loading";
import { useNavigate } from "react-router-dom";
import { pathName } from "../../router/pathName";
import { text } from "../../util/Text";
import { toogleSnack } from "../../redux/snackSlice";

const useStyle = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  errorContain: {
    padding: "15px",
    backgroundColor: "#ff8181",
    width: "100%",
    borderRadius: "5px",
  },
}));

const LoginPage = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ILogin>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading, error: loginError }] = useLoginMutation();
  const classes = useStyle();

  const onSubmit = async (formValues: ILogin) => {
    const res = await login(formValues).unwrap();

    if (res && res.message?.includes("success")) {
      dispatch(setUserInfo({ user: res.userInfo, token: res.token }));
      Cookies.set("token", res.token, {
        expires: formValues.remember ? constantValue.expiresTime : undefined,
      });
      dispatch(toogleSnack({ status: true, message: text.LoginSuccess }));

      navigate(pathName.home);
    }
  };

  return (
    <>
      {isLoading && <Loading height={80} open={isLoading} />}
      <Container component="main" maxWidth="xs">
        <Box mt={8} className={classes.root}>
          <Avatar sx={{ m: 1, bgcolor: "#f48225" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {text.Login}
          </Typography>
          {loginError && (
            <Box className={classes.errorContain}>
              <Typography variant="body2">
                {getErrorMessage(loginError)}
              </Typography>
            </Box>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <Controller
              name="email"
              control={control}
              rules={{
                required: { value: true, message: text.FieldRequierd },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  fullWidth
                  label="Email"
                  error={checkErrorField(errors.email)}
                  helperText={errors.email?.message || ""}
                  autoFocus
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
                  message: "This field requierd at least 6 characters",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  fullWidth
                  autoComplete="on"
                  label={text.Password}
                  error={checkErrorField(errors.password)}
                  helperText={errors.password?.message || ""}
                  type="password"
                />
              )}
            />

            <Controller
              name="remember"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  {...field}
                  control={<Checkbox value="remember" color="primary" />}
                  label={text.Remember}
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {text.Login}
            </Button>
            <Grid container sx={{ justifyContent: "flex-end" }}>
              <Grid item>
                <Link href="/register" variant="body2">
                  {text.LoginBottomText}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default LoginPage;
