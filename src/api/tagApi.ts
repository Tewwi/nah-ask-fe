import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ICreateTag, ITag } from "../interface/QuestionItemInterface";
import { endPoints } from "./apiEndPoints";

interface reqCreateTag {
  token: string;
  body: ICreateTag;
}

export const tagApi = createApi({
  reducerPath: "tagApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  endpoints: (builder) => ({
    getTagList: builder.mutation<any, string>({
      query: (query) => `${endPoints.tag}?query=${query}`,
    }),
    getTagByID: builder.mutation<{ tag: ITag }, string>({
      query: (query) => `${endPoints.tag}/${query}`,
    }),
    createTag: builder.mutation<any, reqCreateTag>({
      query: (payload) => ({
        url: `${endPoints.createTag}`,
        method: "POST",
        body: payload.body,
        headers: {
          authorization: payload.token,
        },
      }),
    }),
  }),
});

export const {
  useGetTagListMutation,
  useGetTagByIDMutation,
  useCreateTagMutation,
} = tagApi;
