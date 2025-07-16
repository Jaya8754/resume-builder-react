import { configureStore } from "@reduxjs/toolkit";
import authReducer, { type AuthState } from "../features/authSlice";
import resumeReducer from "../store/resumeSlice";

interface PersistedState {
  auth: AuthState;
  resume: ReturnType<typeof resumeReducer>;
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
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState({
    auth: store.getState().auth,
    resume: store.getState().resume,
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
