import { createSelector } from "reselect";
import type { RootState } from "@/store/store";

const selectAllResumes = (state: RootState) => state.resume.allResumes;
const selectUserId = (_state: RootState, userId: string | undefined) => userId;

export const selectUserResumes = createSelector(
  [selectAllResumes, selectUserId],
  (allResumes, userId) => {
    if (!userId) return [];
    return allResumes[userId] || [];
  }
);
