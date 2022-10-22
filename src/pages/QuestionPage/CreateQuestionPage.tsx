import {
  Autocomplete,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { EditorState } from "draft-js";
import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { Controller, useForm } from "react-hook-form";
import { INewQuestion, ITag } from "../../interface/QuestionItemInterface";
import { useGetTagListMutation } from "../../api/tagApi";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import _ from "lodash";
import draftToHtml from "draftjs-to-html";
import CreateQuestionImg from "../../components/question/CreateQuestionImg";
import { useUploadImgMutation } from "../../api/uploadApi";
import { useGetSignMutation } from "../../api/authApi";
import { createFormData } from "../../util/createFormDataFile";
import { useAddQuestionMutation } from "../../api/blogApi";
import Cookies from "js-cookie";
import Loading from "../../components/common/Loading";
import { useNavigate } from "react-router-dom";
import { pathName } from "../../router/pathName";

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

interface hookFromType {
  title: string;
  body: EditorState;
  tags?: any;
}

const CreateQuestionPage = () => {
  const classes = useStyle();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<hookFromType>({
    defaultValues: {
      title: "",
      body: "",
      tags: [],
    },
  });
  const [tagsList, setTagsList] = useState<[ITag]>();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [images, setImages] = useState<any>([]);
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const [getTags, { isLoading }] = useGetTagListMutation();
  const [getSign] = useGetSignMutation();
  const [upload, { isLoading: cloudLoading }] = useUploadImgMutation();
  const [addQuestion, { isLoading: addQuestionLoading }] =
    useAddQuestionMutation();

  const onSubmit = async (formValue: hookFromType) => {
    if (!token) {
      return;
    }

    const bodyString = draftToHtml(formValue.body as any);

    const body: INewQuestion = {
      title: formValue.title,
      body: bodyString,
      tags: formValue.tags.map((item: ITag) => item._id),
    };

    if (images.length > 0) {
      body.thumb = await Promise.all(
        images.map(async (file: File) => {
          const { timestamp, signature } = await getSign().unwrap();

          const result = await upload(
            createFormData(file, signature, timestamp)
          ).unwrap();

          if (result.public_id) {
            return {
              url: result.url as string,
              publicID: result.public_id as string,
            };
          }
        })
      );
    }

    addQuestion({ body: body, token: token });
    navigate(pathName.questions);
  };

  const getTagData = _.debounce(
    async (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const resp = await getTags(e.target.value).unwrap();
      setTagsList(resp.data);
    },
    1000
  );

  return (
    <>
      {(cloudLoading || addQuestionLoading) && (
        <Loading height={80} open={true} />
      )}
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ margin: "24px 0px" }}>
          Ask a question
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className={classes.mainContent}
        >
          <Box className={classes.section}>
            <Typography variant="h5">Title</Typography>
            <Typography variant="subtitle2">
              Be specific and imagine you’re asking a question to another person
            </Typography>

            <Controller
              name="title"
              control={control}
              rules={{
                required: { value: true, message: "This field is requierd" },
              }}
              render={({ ...field }) => (
                <TextField
                  {...field}
                  {...register("title")}
                  margin="normal"
                  sx={{ width: "100%", marginTop: "5px" }}
                  autoFocus
                />
              )}
            />
          </Box>

          <Box className={classes.section} sx={{ minHeight: "300px" }}>
            <Typography variant="h5">Body</Typography>
            <Typography sx={{ mb: "5px" }} variant="subtitle2">
              Include all the information someone would need to answer your
              question
            </Typography>
            <Controller
              name="body"
              control={control}
              rules={{
                required: { value: true, message: "This field is requierd" },
              }}
              render={({ field }) => (
                <Editor
                  {...field}
                  editorStyle={{ height: "100%" }}
                  placeholder="Write something!"
                  editorState={editorState}
                  onChange={field.onChange}
                  onEditorStateChange={(content) => setEditorState(content)}
                  toolbar={{
                    options: ["inline", "blockType", "fontSize", "history"],
                  }}
                />
              )}
            />
          </Box>

          <Box className={classes.section}>
            <Typography variant="h5">Tags</Typography>
            <Typography variant="subtitle2">
              Add up to 5 tags to describe what your question is about
            </Typography>

            <Controller
              name="tags"
              control={control}
              rules={{
                required: { value: true, message: "This field is requierd" },
                maxLength: {
                  value: 1,
                  message: "This field can only enter up to 3 tag",
                },
              }}
              render={({ field: { onChange, ...props } }) => (
                <Autocomplete
                  disablePortal
                  options={tagsList || []}
                  getOptionLabel={(option) => option.name}
                  multiple
                  loading={isLoading}
                  renderInput={(params) => (
                    <TextField onChange={getTagData} {...params} />
                  )}
                  onChange={(e, data) => onChange(data)}
                  {...props}
                />
              )}
            />
          </Box>

          <Box className={classes.section}>
            <CreateQuestionImg
              images={images}
              setImages={setImages}
              control={control}
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
              Create Question
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default CreateQuestionPage;
