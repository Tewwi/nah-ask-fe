import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_CLOUDINARY_API }),
  endpoints: (builder) => ({
    uploadImg: builder.mutation<any, FormData>({
      query: (payload) => ({
        url: "",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useUploadImgMutation } = uploadApi;
