import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

type SnackState = {
  isOpen: boolean;
  message?: string;
};

//Snackbar

const slice = createSlice({
  name: "snack",
  initialState: { isOpen: false } as SnackState,
  reducers: {
    toogleSnack: (
      state,
      {
        payload: { status, message },
      }: PayloadAction<{ status: boolean; message?: string }>
    ) => {
      state.isOpen = status;
      state.message = message;
    },
  },
});

export const { toogleSnack } = slice.actions;

export default slice.reducer;

export const selectSnackStatus = (state: RootState) => state.snack;
