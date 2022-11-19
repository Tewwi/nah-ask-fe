import { Avatar, Box, Button, Divider } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import Cookies from "js-cookie";
import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAddCommentMutation } from "../../api/blogApi";
import { IUser } from "../../interface/UserInterface";
import { selectCurrentUser } from "../../redux/authSlice";
import { constantValue } from "../../util/constant";
import { text } from "../../util/Text";
import Loading from "../common/Loading";

const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const useStyle = makeStyles((theme) => ({
  root: {
    display: "flex",
    margin: "40px 0px",
    height: "auto",
  },
  commentInfo: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "20px",
    flex: 1,
  },
}));

interface ICreateCommentProps {
  data: IUser;
}

const CreateComment = ({ data }: ICreateCommentProps) => {
  const classes = useStyle();
  const currUser: IUser | null = useSelector(selectCurrentUser);
  const { id } = useParams() as { id: string };
  const [addCommnet, { isLoading }] = useAddCommentMutation();
  const token = Cookies.get("token");
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const { handleSubmit, control, reset } = useForm<{ body: EditorState }>({
    defaultValues: {
      body: "",
    },
  });

  const onSubmit = async (formData: { body: EditorState }) => {
    const bodyString = draftToHtml(formData.body as any);
    if (currUser && token) {
      await addCommnet({
        token: token,
        comment: {
          author: currUser,
          blogID: id,
          body: bodyString,
        },
      });

      reset();
      setEditorState(() => EditorState.createEmpty());
    }
  };

  if (isLoading) {
    return <Loading height={80} open={isLoading} />;
  }

  return (
    <>
      <Box className={classes.root}>
        <Box>
          <Avatar
            src={`${constantValue.imgUrl}/${data.avatar}`}
            sx={{ mr: "5px", width: 50, height: 50 }}
          />
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className={classes.commentInfo}
        >
          <Box>
            <Controller
              name="body"
              control={control}
              rules={{
                required: { value: true, message: text.FieldRequierd },
              }}
              render={({ field }) => (
                <Editor
                  {...field}
                  editorStyle={{ height: "100%" }}
                  placeholder="Viết gì đó !"
                  editorState={editorState}
                  onEditorStateChange={(content) => setEditorState(content)}
                  toolbar={{
                    options: ["inline", "blockType", "fontSize", "history"],
                  }}
                  toolbarStyle={{
                    backgroundColor: "#ecf1f1",
                  }}
                />
              )}
            />
          </Box>
          <Button
            variant="contained"
            type="submit"
            sx={{
              textTransform: "capitalize",
              width: 130,
              height: 40,
              marginTop: "20px",
            }}
          >
            {text.Comment}
          </Button>
        </Box>
      </Box>

      <Divider />
    </>
  );
};

export default CreateComment;
