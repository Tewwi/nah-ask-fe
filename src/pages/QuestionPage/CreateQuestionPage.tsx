import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Container,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import Cookies from "js-cookie";
import _ from "lodash";
import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetSignMutation } from "../../api/authApi";
import {
  useAddQuestionMutation,
  useEditQuestionMutation,
} from "../../api/blogApi";
import { useGetTagListMutation } from "../../api/tagApi";
import { useUploadImgMutation } from "../../api/uploadApi";
import Loading from "../../components/common/Loading";
import CreateQuestionImg from "../../components/question/CreateQuestionImg";
import TagItem from "../../components/tag/TagItem";
import {
  IImage,
  INewQuestion,
  ITag,
} from "../../interface/QuestionItemInterface";
import { toggleSnack } from "../../redux/snackSlice";
import { pathName } from "../../router/pathName";
import { createFormData } from "../../util/createFormDataFile";
import { checkErrorField } from "../../util/handleError";
import { text } from "../../util/Text";

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

interface hookFromType {
  title: string;
  body: EditorState;
  tags?: any;
}

interface ICreateQuestionPage {
  defaultData?: any;
  defaultImgData?: [IImage];
  isEdit?: boolean;
}

const CreateQuestionPage = ({
  defaultData,
  defaultImgData,
  isEdit = false,
}: ICreateQuestionPage) => {
  const classes = useStyle();
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<hookFromType>({
    defaultValues: defaultData || {
      title: "",
      body: "",
      tags: [],
    },
  });
  const [tagsList, setTagsList] = useState<[ITag]>();
  const [editorState, setEditorState] = useState(() =>
    defaultData?.bodyState
      ? EditorState.createWithContent(defaultData?.bodyState)
      : EditorState.createEmpty()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<any>([]);
  const [defaultImg, setDefaultImg] = useState<any>(defaultImgData);
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [getTags] = useGetTagListMutation();
  const [getSign] = useGetSignMutation();
  const [upload, { isLoading: cloudLoading }] = useUploadImgMutation();
  const [addQuestion, { isLoading: addQuestionLoading }] =
    useAddQuestionMutation();
  const [editQuestion, { isLoading: editQuestionLoading }] =
    useEditQuestionMutation();

  const onSubmit = async (formValue: hookFromType) => {
    if (!token) {
      return;
    }

    const bodyString =
      typeof formValue.body !== "string"
        ? draftToHtml(formValue.body as any)
        : formValue.body;

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

      if (defaultImg) {
        body.thumb = body.thumb.concat(defaultImg);
      }
    }

    if (isEdit) {
      await editQuestion({ body: body, token: token, id: defaultData._id });
    } else {
      await addQuestion({ body: body, token: token });
    }

    dispatch(toggleSnack({ status: true, message: text.Success }));
    navigate(pathName.questions);
  };

  const getTagData = async () => {
    const resp = await getTags("").unwrap();
    setTagsList(resp.data);
  };

  React.useEffect(() => {
    if (addQuestionLoading || cloudLoading || editQuestionLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [addQuestionLoading, cloudLoading, editQuestionLoading]);

  React.useEffect(() => {
    getTagData();
  }, []);

  return (
    <>
      {isLoading && <Loading height={80} open={isLoading} />}
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ margin: "24px 0px" }}>
          {!isEdit ? text.AskQuestion : text.EditQuestion}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className={classes.mainContent}
        >
          <Box className={classes.section}>
            <Typography variant="h5">{text.Title}</Typography>
            <Typography variant="subtitle2">{text.TitleDesc}</Typography>

            <Controller
              name="title"
              control={control}
              rules={{
                required: { value: true, message: text.FieldRequierd },
              }}
              render={({ ...field }) => (
                <TextField
                  {...field}
                  {...register("title")}
                  margin="normal"
                  sx={{ width: "100%", marginTop: "5px" }}
                  autoFocus
                  error={checkErrorField(errors.title)}
                  helperText={errors.title?.message || ""}
                />
              )}
            />
          </Box>

          <Box className={classes.section} sx={{ minHeight: "300px" }}>
            <Typography variant="h5">{text.Body}</Typography>
            <Typography sx={{ mb: "5px" }} variant="subtitle2">
              {text.BodyDesc}
            </Typography>
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
                  placeholder="Nội dung câu hỏi"
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
          {checkErrorField(errors.body) && (
            <Typography
              sx={{ color: "#d32f2f", fontSize: "0.75rem", ml: "14px" }}
              variant="subtitle2"
            >
              {errors.body?.message || ""}
            </Typography>
          )}

          <Box className={classes.section}>
            <Typography variant="h5">{text.Tag}</Typography>
            <Typography variant="subtitle2">{text.TagDesc}</Typography>

            <Controller
              name="tags"
              control={control}
              rules={{
                required: { value: true, message: text.FieldRequierd },
                maxLength: {
                  value: 5,
                  message: text.TagRequierd,
                },
              }}
              render={({ field: { onChange, ...props } }) => (
                <Select
                  multiple
                  onChange={(e) => {
                    onChange(e.target.value);
                  }}
                  input={<OutlinedInput id="select-multiple-chip" />}
                  renderValue={(selectTags) => {
                    const renderList =
                      tagsList?.filter((item) =>
                        selectTags.includes(item._id)
                      ) || [];
                    return (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {renderList?.map((value) => (
                          <Chip key={value._id} label={value.name} />
                        ))}
                      </Box>
                    );
                  }}
                  MenuProps={MenuProps}
                  {...props}
                >
                  {tagsList?.map((tag) => (
                    <MenuItem
                      key={tag._id}
                      value={tag._id}
                      style={getStyles(
                        tag.name,
                        tagsList.map((item) => item.name),
                        theme
                      )}
                    >
                      {tag.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </Box>
            {checkErrorField(errors.tags) && (
              <Typography
                sx={{ color: "#d32f2f", fontSize: "0.75rem", ml: "14px" }}
                variant="subtitle2"
              >
                {errors.tags?.message?.toString()}
              </Typography>
            )}

          <Box className={classes.section}>
            <CreateQuestionImg
              images={images}
              defaultImg={defaultImg}
              setImages={setImages}
              setDefaultImg={setDefaultImg}
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
              {!isEdit ? text.CreateQuestion : text.EditQuestionAction}
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default CreateQuestionPage;
