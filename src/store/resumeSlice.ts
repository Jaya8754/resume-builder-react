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
  workOrInternship: string;
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
    saveCurrentResume(state, action: PayloadAction<{ userId: string }>) {
      const { userId } = action.payload;
      const userResumes = state.allResumes[userId] || [];

      const existingIndex = userResumes.findIndex(
        (r) => r.id === (state.currentResume as any).id
      );

      if (existingIndex !== -1) {
        userResumes[existingIndex] = {
          ...state.currentResume,
          id: (state.currentResume as any).id,
          createdAt: (state.currentResume as any).createdAt,
        };
      } else {
        userResumes.push({
          ...state.currentResume,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        });
      }

      state.allResumes[userId] = userResumes;
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
    setExperience(state, action: PayloadAction<ExperienceInfo[]>) {
      state.currentResume.experience = action.payload;
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
    setLanguages(state, action: PayloadAction<LanguageInfo[]>) {
      state.currentResume.languages = action.payload;
    },

    resetResume(state) {
      state.currentResume = {
        ...initialResume,
        id: "",
        createdAt: "",
      } as any;
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
  setAboutMe,
  setEducation,
  setExperience,
  setSkills,
  setProjects,
  setCertifications,
  setInterests,
  setLanguages,
  resetResume,
  saveCurrentResume,
  deleteResume,
  loadResume,
  renameResume,
} = resumeSlice.actions;

export default resumeSlice.reducer;