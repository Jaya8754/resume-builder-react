import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type PersonalInfo = {
  fullName: string;
  jobTitle: string;
  email: string;
  phoneNumber: string;
  location: string;
  linkedinProfile: string;
  portfolio: string;
  profilePicture: string;
  [key: string]: string;
};

export type AboutMe = {
  aboutMe: string;
};

export type EducationInfo = {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  cgpa: string;
  [key: string]: string;
};

export type ExperienceInfo = {
  experienceType: string;
  jobtitle: string;
  companyname: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
  [key: string]: string;
};

export type SkillsInfo = string[];

export type ProjectInfo = {
  projectTitle: string;
  description: string;
  [key: string]: string;
};

export type CertificationInfo = {
  certificationName: string;
  issuer: string;
  issuedDate: string;
  skillsCovered: string;
  [key: string]: string;
};

export type InterestsInfo = string[];

export type LanguageInfo = {
  language: string;
  level: string;
};

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
  aboutMe: {
    aboutMe: "",
  },
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
      const { userId } = action.payload;
      const userResumes = state.allResumes[userId] || [];

      let resumeId = state.currentResume.id;

      if (resumeId) {
        // Resume already exists, update it
        const existingIndex = userResumes.findIndex((r) => r.id === resumeId);
        if (existingIndex !== -1) {
          userResumes[existingIndex] = {
            ...state.currentResume,
            id: resumeId,
            createdAt: userResumes[existingIndex].createdAt || new Date().toISOString(),
          };
        } else {
          // Somehow resume has id but not found in list
          userResumes.push({
            ...state.currentResume,
            id: resumeId,
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        // New resume: generate ID and timestamp
        resumeId = crypto.randomUUID();
        const newResume = {
          ...state.currentResume,
          id: resumeId,
          createdAt: new Date().toISOString(),
        };
        userResumes.push(newResume);
        state.currentResume.id = resumeId;
        state.currentResume.createdAt = newResume.createdAt;
      }

      state.allResumes[userId] = userResumes;
    },
    setResumeId(state, action: PayloadAction<string>) {
      state.currentResume.id = action.payload;
    },
    setPersonalInfo(state, action: PayloadAction<PersonalInfo>) {
      state.currentResume.personalInfo = action.payload;
    },
    updatePersonalInfo(state, action) {
      state.currentResume.personalInfo = { ...state.currentResume.personalInfo, ...action.payload };
    },
    setAboutMe(state, action: PayloadAction<AboutMe>) {
      state.currentResume.aboutMe = action.payload;
    },
    updateAboutMe(state, action) {
      state.currentResume.aboutMe = { ...state.currentResume.aboutMe, ...action.payload };
    },
    setEducation(state, action: PayloadAction<EducationInfo[]>) {
      state.currentResume.education = action.payload;
    },
    updateEducation: (state, action) => {
      const { index, updates } = action.payload;
      if (!state.currentResume.education[index]) {
        state.currentResume.education[index] = updates;
      } else {
        state.currentResume.education[index] = {
          ...state.currentResume.education[index],
          ...updates,
        };
      }
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
    updateExperience(
      state,
      action: PayloadAction<{ index: number; updates: { [key: string]: string } }>
    ) {
      const { index, updates } = action.payload;
      const existing = state.currentResume.experience[index] ?? {};
      state.currentResume.experience[index] = {
        ...existing,
        ...updates,
      };
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
    updateSkills(state, action: PayloadAction<{ index: number; updates: string[] }>) {
      const { updates } = action.payload;
      state.currentResume.skills = updates;
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
    updateInterests(state, action) {
      state.currentResume.interests = { ...state.currentResume.interests, ...action.payload };
    },
    setLanguages(state, action: PayloadAction<LanguageInfo[]>) {
      state.currentResume.languages = action.payload;
    },
    updateLanguages(state, action) {
      state.currentResume.languages = { ...state.currentResume.languages, ...action.payload };
    },

    resetResume(state) {
      state.currentResume = {
        ...initialResume,
        id: undefined,
        createdAt: undefined,
      };
    },

    deleteResume(state, action: PayloadAction<{ userId: string; resumeId: string }>) {
      state.allResumes[action.payload.userId] = state.allResumes[action.payload.userId]?.filter(
        r => r.id !== action.payload.resumeId
      ) || [];
    },

    loadResume(state, action: PayloadAction<{ userId: string; resumeId: string }>) {
      const resumes = state.allResumes[action.payload.userId] || [];
      const resume = resumes.find(r => r.id === action.payload.resumeId);
      if (resume) {
        state.currentResume = { ...resume };
      }
    },

    renameResume(
      state,
      action: PayloadAction<{ userId: string; resumeId: string; newName: string }>
    ) {
      const { userId, resumeId, newName } = action.payload;
      const userResumes = state.allResumes[userId] || [];

      const resume = userResumes.find((r) => r.id === resumeId);
      if (resume) {
        resume.personalInfo.fullName = newName;
      }
    }

  },
});

export const {
  setPersonalInfo,
  updatePersonalInfo,
  setAboutMe,
  updateAboutMe,
  setEducation,
  updateEducation,
  addEducation,
  removeEducation,
  addExperience,
  removeExperience,
  setExperience,
  updateExperience,
  setSkills,
  updateSkills,
  setProjects,
  setCertifications,
  setInterests,
  updateInterests,
  setLanguages,
  updateLanguages,
  resetResume,
  setResumeId,
  saveCurrentResume,
  deleteResume,
  loadResume,
  renameResume,
} = resumeSlice.actions;

export default resumeSlice.reducer;