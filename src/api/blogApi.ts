import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ICreateComment,
  INewQuestion,
  IQuestion,
} from "../interface/QuestionItemInterface";
import { endPoints } from "./apiEndPoints";
import qs from "querystringify";

interface respQuestionDetail {
  blog: IQuestion;
}

export interface reqgetApprovedBlog {
  p: number;
  sortBy?: string;
  sort?: string;
}

interface ICommentReq {
  comment: ICreateComment;
  token: string;
}

interface reqAddQuestion {
  body: INewQuestion;
  token: string;
}

interface reqEditQuestion {
  body: INewQuestion;
  id: string;
  token: string;
}

interface reqApproveQuestion {
  token: string;
  id: string;
}

interface reqFindBlog {
  query: string;
  page: number;
}

interface IChooseCommentReq {
  commentID: string;
  questionID: string;
  token: string;
}

interface IDeqDeleBlog {
  token: string;
  id: string | number;
}

interface IReqUnapprovedQuestion {
  data: IQuestion[];
  message: string;
  total: number;
}

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  tagTypes: ["question", "unapproveQuestion"],
  endpoints: (builder) => ({
    getApprovedBlog: builder.mutation<any, reqgetApprovedBlog>({
      query: (payload) => {
        const queryString = qs.stringify(payload);

        return `${endPoints.approveBlog}?${queryString}`;
      },
    }),
    getUnapprovedBlog: builder.query<
      IReqUnapprovedQuestion,
      { page?: number; token: string }
    >({
      query: (payload) => ({
        url: `${endPoints.blog}${endPoints.unapproved}?p=${payload.page || 1}`,
        method: "GET",
        headers: {
          authorization: payload.token,
        },
      }),
      providesTags: ["unapproveQuestion"],
    }),
    ApprovedBlog: builder.mutation<any, reqApproveQuestion>({
      query: (payload) => ({
        url: `${endPoints.blog}${endPoints.approve}/${payload.id}`,
        method: "GET",
        headers: {
          authorization: payload.token,
        },
      }),
      invalidatesTags: ["unapproveQuestion"],
    }),
    deleteBlog: builder.mutation<any, IDeqDeleBlog>({
      query: (payload) => ({
        url: `${endPoints.blog}${payload.id}`,
        method: "DELETE",
        headers: {
          authorization: payload.token,
        },
      }),
      invalidatesTags: ["question"],
    }),
    findBlog: builder.mutation<any, reqFindBlog>({
      query: (query) => `search?${query.query}&p=${query.page}`,
    }),
    getQuestionDetail: builder.query<respQuestionDetail, string>({
      query: (query) => `${endPoints.blog}${query}`,
      providesTags: ["question"],
    }),
    addQuestion: builder.mutation<any, reqAddQuestion>({
      query: (payload) => ({
        url: endPoints.blog,
        method: "POST",
        body: payload.body,
        headers: {
          authorization: payload.token,
        },
      }),
      invalidatesTags: ["question"],
    }),
    editQuestion: builder.mutation<any, reqEditQuestion>({
      query: (payload) => ({
        url: `${endPoints.blogEdit}/${payload.id}`,
        method: "PUT",
        body: payload.body,
        headers: {
          authorization: payload.token,
        },
      }),
      invalidatesTags: ["question"],
    }),
    addComment: builder.mutation<any, ICommentReq>({
      query: (payload) => ({
        url: endPoints.addComment,
        method: "POST",
        body: payload.comment,
        headers: {
          authorization: payload.token,
        },
      }),
      invalidatesTags: ["question"],
    }),
    chooseAnswer: builder.mutation<any, IChooseCommentReq>({
      query: (payload) => ({
        url: endPoints.chooseAnswer,
        method: "POST",
        body: {
          blogID: payload.questionID,
          answer: payload.commentID,
        },
        headers: {
          authorization: payload.token,
        },
      }),
      invalidatesTags: ["question"],
    }),
    hiddenComment: builder.mutation<any, { token: string; id: string }>({
      query: (payload) => ({
        url: `${endPoints.hiddenComment}/${payload.id}`,
        method: "GET",
        headers: {
          authorization: payload.token,
        },
      }),
      invalidatesTags: ["question"],
    }),
  }),
});

export const {
  useGetApprovedBlogMutation,
  useFindBlogMutation,
  useGetQuestionDetailQuery,
  useAddCommentMutation,
  useAddQuestionMutation,
  useGetUnapprovedBlogQuery,
  useApprovedBlogMutation,
  useEditQuestionMutation,
  useChooseAnswerMutation,
  useDeleteBlogMutation,
  useHiddenCommentMutation,
} = blogApi;
