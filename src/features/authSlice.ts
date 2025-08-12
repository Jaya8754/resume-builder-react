import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type UserDetails = {
  id: number;
  name?: string;
  email: string;
  password?: string;
}

export type User = {
  user: UserDetails;
  accessToken: string;
};


export interface AuthState {
  currentUser: User | null;
  registeredUsers: User[];
}

const initialState: AuthState = {
  currentUser: null,
  registeredUsers: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    addRegisteredUser: (state, action: PayloadAction<User>) => {
      state.registeredUsers.push(action.payload);
    },
    logout: (state) => {
      state.currentUser = null;
    },
  },
});

export const { setCurrentUser, addRegisteredUser, logout } = authSlice.actions;
export default authSlice.reducer;