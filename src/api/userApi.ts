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

interface IReqChangeRole {
  token: string;
  id: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  tagTypes: ["user"],
  endpoints: (builder) => ({
    getUserByID: builder.query<IRespGetUserByID, string>({
      query: (query) => `${endPoints.user}${query}`,
      providesTags: ["user"],
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
    changeRoleUser: builder.mutation<IRespGetUser, IReqChangeRole>({
      query: (payload) => ({
        url: `${endPoints.change_role}/${payload.id}`,
        method: "GET",
        headers: {
          authorization: payload.token,
        },
      }),
      invalidatesTags: ["user"],
    }),
    blockUser: builder.mutation<any, { token: string; id: string }>({
      query: (payload) => ({
        url: `${endPoints.blockUser}/${payload.id}`,
        method: "GET",
        headers: {
          authorization: payload.token,
        },
      }),
      invalidatesTags: ['user']
    }),
  }),
});

export const {
  useGetUserByIDQuery,
  useGetCurrentMutation,
  useChangeRoleUserMutation,
  useBlockUserMutation,
} = userApi;
