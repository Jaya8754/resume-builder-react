import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {PersonalInfo, AboutMe, EducationInfo, ExperienceInfo, SkillsInfo, ProjectInfo, CertificationInfo, InterestsInfo, LanguageInfo} from "@/components/interfaces/interfaces";

export type ResumeState = {
  personalInfo: PersonalInfo;
  aboutMe: AboutMe;
  education: EducationInfo[];
  experience: ExperienceInfo[];
  skills: SkillsInfo;
  projects: ProjectInfo[];
  certifications: CertificationInfo[];
  interests: InterestsInfo;
  languages: LanguageInfo[];
  id?: string;
  createdAt?: string;
};

type FullResumeState = {
  currentResume: ResumeState;
  allResumes: {
    [userId: string]: (ResumeState & { id: string; createdAt: string })[];
  };
};

const initialResume: ResumeState = {
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phoneNumber: "",
    location: "",
    linkedinProfile: "",
    portfolio: "",
    profilePicture: "",
  },
  aboutMe: { aboutMe: "" },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  interests: [],
  languages: [],
};

const initialState: FullResumeState = {
  currentResume: initialResume,
  allResumes: {},
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    saveCurrentResume(state, action: PayloadAction<{ userId: string; resumeId?: string }>) {
      const { userId, resumeId } = action.payload;
      const userResumes = state.allResumes[userId] || [];

      if (!resumeId || !state.currentResume.id || state.currentResume.id !== resumeId) {
        throw new Error("Cannot save. Resume ID is missing or mismatched.");
      }

      const existingIndex = userResumes.findIndex((r) => r.id === resumeId);
      if (existingIndex !== -1) {
        userResumes[existingIndex] = {
          ...state.currentResume,
          id: resumeId,
          createdAt: userResumes[existingIndex].createdAt || new Date().toISOString(),
        };
      } else {
        userResumes.push({
          ...state.currentResume,
          id: resumeId,
          createdAt: new Date().toISOString(),
        });
      }

      state.allResumes[userId] = userResumes;
    },

    setCurrentResume(state, action: PayloadAction<ResumeState>) {
    state.currentResume = action.payload;
    },

    setResumeId(state, action: PayloadAction<string>) {
      state.currentResume.id = action.payload;
    },

    setPersonalInfo(state, action: PayloadAction<PersonalInfo>) {
      state.currentResume.personalInfo = action.payload;
    },

    setAboutMe(state, action: PayloadAction<AboutMe>) {
      state.currentResume.aboutMe = action.payload;
    },

    setEducation(state, action: PayloadAction<EducationInfo[]>) {
      state.currentResume.education = action.payload;
    },

    addEducation(state, action: PayloadAction<EducationInfo>) {
      state.currentResume.education.push(action.payload);
    },

    removeEducation(state, action: PayloadAction<number>) {
      state.currentResume.education.splice(action.payload, 1);
    },

    setExperience(state, action: PayloadAction<ExperienceInfo[]>) {
      state.currentResume.experience = action.payload;
    },

    addExperience(state, action: PayloadAction<ExperienceInfo>) {
      state.currentResume.experience.push(action.payload);
    },

    removeExperience(state, action: PayloadAction<number>) {
      state.currentResume.experience.splice(action.payload, 1);
    },

    setSkills(state, action: PayloadAction<SkillsInfo>) {
      state.currentResume.skills = action.payload;
    },

    setProjects(state, action: PayloadAction<ProjectInfo[]>) {
      state.currentResume.projects = action.payload;
    },

    setCertifications(state, action: PayloadAction<CertificationInfo[]>) {
      state.currentResume.certifications = action.payload;
    },

    setInterests(state, action: PayloadAction<InterestsInfo>) {
      state.currentResume.interests = action.payload;
    },

    setLanguages: (state, action: PayloadAction<LanguageInfo[]>) => {
    state.currentResume.languages = action.payload;
    },

    resetResume(state, action: PayloadAction<{ resumeId: string }>) {
      const { resumeId } = action.payload;
      state.currentResume = {
        ...initialResume,
        id: resumeId,
        createdAt: new Date().toISOString(),
      };
    },

    deleteResume(state, action: PayloadAction<{ userId: string; resumeId: string }>) {
      const { userId, resumeId } = action.payload;
      state.allResumes[userId] = state.allResumes[userId]?.filter((r) => r.id !== resumeId) || [];
    },

    loadResume(state, action: PayloadAction<{ userId: string; resumeId: string }>) {
      const resumes = state.allResumes[action.payload.userId] || [];
      const resume = resumes.find((r) => r.id === action.payload.resumeId);
      if (resume) {
        state.currentResume = { ...resume };
      }
    },

    renameResume(state, action: PayloadAction<{ userId: string; resumeId: string; newName: string }>) {
      const { userId, resumeId, newName } = action.payload;
      const resume = state.allResumes[userId]?.find((r) => r.id === resumeId);
      if (resume) {
        resume.personalInfo.fullName = newName;
      }
    },
  },
});

export const {
  setPersonalInfo,
  setAboutMe,
  setEducation,
  addEducation,
  removeEducation,
  setExperience,
  addExperience,
  removeExperience,
  setSkills,
  setProjects,
  setCertifications,
  setInterests,
  setLanguages,
  resetResume,
  setResumeId,
  setCurrentResume, 
  saveCurrentResume,
  deleteResume,
  loadResume,
  renameResume,
} = resumeSlice.actions;

export default resumeSlice.reducer;
