import { Box, Button, Divider, Link, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ContentState, convertFromHTML, Editor, EditorState } from "draft-js";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { useApprovedBlogMutation } from "../../api/blogApi";
import { IQuestion } from "../../interface/QuestionItemInterface";
import { toggleSnack } from "../../redux/snackSlice";
import { pathName } from "../../router/pathName";
import { text } from "../../util/Text";
import MoreVertMenu from "../common/MoreVertMenu";
import TagChip from "../tag/TagChip";

const useStyle = makeStyles((theme) => ({
  questionContain: {
    padding: "12px",
  },
  questionInfo: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    maxWidth: "85%",
    marginLeft: "30px",
  },
  questionText: {
    display: "-webkit-box",
    overflow: "hidden",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
  },
  questionTitle: {
    display: "-webkit-box",
    overflow: "hidden",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    "&:hover": {
      opacity: "0.8",
    },
  },
}));

interface IQuestionItem {
  data: IQuestion;
}

const QuestionItem = (props: IQuestionItem) => {
  const { data } = props;
  const classes = useStyle();
  const token = Cookies.get("token");
  const dispatch = useDispatch();
  const blocksFromHTML = convertFromHTML(data.body);
  const [approveQuestion] = useApprovedBlogMutation();
  const state = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  );

  const handleApproveBtn = async () => {
    if (token) {
      const resp = await approveQuestion({
        id: data._id,
        token: token,
      });

      if (resp) {
        dispatch(toggleSnack({ status: true, message: text.ApproveActionSuc }));
      }
    }
  };

  return (
    <>
      <Divider />
      <Box display="flex" className={classes.questionContain}>
        <Box display="flex" flexDirection="column">
          <Typography
            variant="subtitle2"
            mt="10px"
            color={data.approve ? "green" : "black"}
            sx={{ textTransform: "capitalize" }}
          >
            {data.approve ? text.Approve : text.Unapproved}
          </Typography>
          {data.answer?.length ? (
            <Typography variant="subtitle2" mt="10px" color={"green"}>
              {text.Answered}
            </Typography>
          ) : null}
          <Typography variant="subtitle2" mt="10px">
            {`${data.comment?.length || 0} ${text.Comment}`}
          </Typography>
        </Box>
        <Box className={classes.questionInfo}>
          <Link
            href={`${pathName.questions}/${data._id}`}
            variant="h5"
            mb="3px"
            underline="none"
            className={classes.questionTitle}
          >
            {data.title}
          </Link>
          <Typography variant="body1" mb="3px" className={classes.questionText}>
            {
              <Editor
                readOnly
                onChange={() => {}}
                editorState={EditorState.createWithContent(state)}
              />
            }
          </Typography>
          <Box display="flex" mt="10px">
            {data.tags?.map((tag) => (
              <TagChip key={tag._id} data={tag} />
            ))}
          </Box>
        </Box>
        {data && <MoreVertMenu data={data} handleApprove={handleApproveBtn} />}
      </Box>
    </>
  );
};

export default QuestionItem;
