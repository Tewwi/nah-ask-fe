import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ILogin } from "../interface/AuthInterface";
import { IUser } from "../interface/UserInterface";
import { endPoints } from "./apiEndPoints";

interface ILoginRes {
  userInfo: IUser;
  token: string;
  message?: string;
}

interface ISignCloud {
  timestamp: string;
  signature: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  endpoints: (builder) => ({
    login: builder.mutation<ILoginRes, ILogin>({
      query: (payload) => ({
        url: endPoints.login,
        method: "POST",
        body: payload,
      }),
    }),
    register: builder.mutation<any, any>({
      query: (payload) => ({
        url: endPoints.register,
        method: "POST",
        body: payload,
      }),
    }),
    getSign: builder.mutation<ISignCloud, void>({
      query: () => ({
        url: endPoints.getSign,
        method: "GET",
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetSignMutation } =
  authApi;
