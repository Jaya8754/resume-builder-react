import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import type { AuthState } from "../features/authSlice";
import resumeReducer from "../store/resumeSlice";  // reducer function import
import type { FullResumeState } from "../store/resumeSlice";

interface PersistedState {
  auth: AuthState;
  resume: FullResumeState;  // Use correct type here
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
    resume: resumeReducer,   // <-- use reducer function here, NOT FullResumeState type
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState({
    auth: store.getState().auth,
    resume: store.getState().resume,
  });
});

// Export these types for usage in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
