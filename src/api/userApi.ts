import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IUser } from "../interface/UserInterface";
import { endPoints } from "./apiEndPoints";

interface IRespGetUser {
  user: IUser;
}

interface IRespGetUserByID {
  user: IUser;
  blog: [];
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  endpoints: (builder) => ({
    getUserByID: builder.query<IRespGetUserByID, string>({
      query: (query) => `${endPoints.user}${query}`,
    }),
    getCurrent: builder.mutation<IRespGetUser, string>({
      query: (payload) => ({
        url: endPoints.currentUser,
        method: "GET",
        headers: {
          authorization: payload,
        },
      }),
    }),
  }),
});

export const { useGetUserByIDQuery, useGetCurrentMutation } = userApi;
