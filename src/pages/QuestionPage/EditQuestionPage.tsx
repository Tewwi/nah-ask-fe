import { ContentState, convertFromHTML } from "draft-js";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useGetQuestionDetailQuery } from "../../api/blogApi";
import { selectCurrentUser } from "../../redux/authSlice";
import CreateQuestionPage from "./CreateQuestionPage";

const EditQuestionPage = () => {
  const { id } = useParams() as { id: string };
  const currUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const { data } = useGetQuestionDetailQuery(id);
  const [questionInfo, setQuestionInfo] = React.useState<any>();

  useEffect(() => {
    if (data) {
      const blocksFromHTML = convertFromHTML(data.blog.body);
      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );

      setQuestionInfo({...data.blog, bodyState: state})
    }
  }, [data]);

  return (
    <>
      {questionInfo && data && (
        <CreateQuestionPage
          defaultData={questionInfo as any}
          defaultImgData={data.blog.thumb as any}
          isEdit={true}
        />
      )}
    </>
  );
};

export default EditQuestionPage;
