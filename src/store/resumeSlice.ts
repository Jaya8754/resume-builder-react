import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Types matching your forms in exact order
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

export type FullResumeState = {
  currentResume: ResumeState;
  allResumes: (ResumeState & { id: string; createdAt: string })[];
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
  allResumes: [],
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    saveCurrentResume(state: FullResumeState) {
      const existingIndex = state.allResumes.findIndex(
        (r) => r.id === (state.currentResume as any).id
      );

      if (existingIndex !== -1) {
        // Resume exists → update it
        state.allResumes[existingIndex] = {
          ...state.currentResume,
          id: (state.currentResume as any).id,
          createdAt: (state.currentResume as any).createdAt,
        };
      } else {
        // Resume is new → add it
        state.allResumes.push({
          ...state.currentResume,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        });
      }
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

    deleteResume(state, action: PayloadAction<string>) {
      state.allResumes = state.allResumes.filter(r => r.id !== action.payload);
    },

    loadResume(state, action: PayloadAction<string>) {
      const resume = state.allResumes.find(r => r.id === action.payload);
      if (resume) {
        state.currentResume = {
          ...resume, // ✅ Keep id and createdAt intact
        };
      }
    },
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
} = resumeSlice.actions;

export default resumeSlice.reducer;
