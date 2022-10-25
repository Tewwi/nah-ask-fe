import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";
import { blogApi } from "../api/blogApi";
import { tagApi } from "../api/tagApi";
import { uploadApi } from "../api/uploadApi";
import { userApi } from "../api/userApi";
import authReducer from "../redux/authSlice";
import snackhReducer from "./snackSlice";

export const store = configureStore({
  reducer: {
    [blogApi.reducerPath]: blogApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [tagApi.reducerPath]: tagApi.reducer,
    auth: authReducer,
    snack: snackhReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      blogApi.middleware,
      authApi.middleware,
      userApi.middleware,
      tagApi.middleware,
      uploadApi.middleware
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
