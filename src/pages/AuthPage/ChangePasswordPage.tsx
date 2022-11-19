import {
  Box,
  Button, Container, TextField,
  Typography
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useChangePasswordMutation } from "../../api/authApi";
import Loading from "../../components/common/Loading";
import { IChangePassword } from "../../interface/AuthInterface";
import { IUser } from "../../interface/UserInterface";
import { selectCurrentUser } from "../../redux/authSlice";
import { toggleSnack } from "../../redux/snackSlice";
import { checkErrorField, getErrorMessage } from "../../util/handleError";
import { text } from "../../util/Text";

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

const ChangePasswordPage = () => {
  const classes = useStyle();
  const currUser: IUser | null = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const dispatch = useDispatch();
  const [changePassword, { isLoading, error }] =
    useChangePasswordMutation();

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<IChangePassword>({
    defaultValues: {
      password: "",
      new_password: "",
      re_password: "",
    },
  });

  const onSubmit = async (value: IChangePassword) => {
    if (currUser && token) {
      const { email, _id } = currUser;

      try {
        const resp = await changePassword({
          token: token,
          body: {
            password: value.password,
            newPassword: value.new_password,
            email,
            _id,
          },
        }).unwrap();

        if(resp.message.toLowerCase().include('success')) {
          dispatch(toggleSnack({ status: true, message: text.ApproveActionSuc }));
          navigate('');
        }
        
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      {isLoading && <Loading height={80} open={isLoading} />}
      <Container component="main" maxWidth="xs">
        <Box mt={8} className={classes.root}>
          <Typography component="h1" variant="h5">
            {text.changePassword}
          </Typography>
          {error && (
            <Box className={classes.errorContain}>
              <Typography variant="body2">{getErrorMessage(error)}</Typography>
            </Box>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
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
              name="new_password"
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
                  margin="normal"
                  fullWidth
                  autoComplete="on"
                  label={text.newPassword}
                  error={checkErrorField(errors.password)}
                  helperText={errors.password?.message || ""}
                  type="password"
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
                    value === watch("new_password") ||
                    text.wrong_repeat_password,
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
              {text.changePassword}
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ChangePasswordPage;
