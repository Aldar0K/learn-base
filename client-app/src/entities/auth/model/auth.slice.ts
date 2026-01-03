import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { User } from "@/entities/user";

type AuthState = {
  user: User | null;
  isLoading: boolean;
};

const initialState: AuthState = {
  user: null,
  isLoading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { actions: authActions, reducer: authReducer } = authSlice;
