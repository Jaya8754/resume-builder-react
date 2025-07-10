import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import type { AuthState } from "../features/authSlice";

interface PersistedState {
  auth: AuthState;
}

const loadState = (): PersistedState | undefined => {
  try {
    const serializedState = localStorage.getItem("reduxState");
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (e) {
    return undefined;
  }
};

const saveState = (state: PersistedState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("reduxState", serializedState);
  } catch (e) {
    // ignore errors
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState({
    auth: store.getState().auth,
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
