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
};

const initialState: ResumeState = {
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

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setPersonalInfo(state, action: PayloadAction<PersonalInfo>) {
      state.personalInfo = action.payload;
    },
    setAboutMe(state, action: PayloadAction<AboutMe>) {
      state.aboutMe = action.payload;
    },
    setEducation(state, action: PayloadAction<EducationInfo[]>) {
      state.education = action.payload;
    },
    setExperience(state, action: PayloadAction<ExperienceInfo[]>) {
      state.experience = action.payload;
    },
    setSkills(state, action: PayloadAction<SkillsInfo>) {
      state.skills = action.payload;
    },
    setProjects(state, action: PayloadAction<ProjectInfo[]>) {
      state.projects = action.payload;
    },
    setCertifications(state, action: PayloadAction<CertificationInfo[]>) {
      state.certifications = action.payload;
    },
      setInterests(state, action: PayloadAction<string[]>) {
          state.interests = action.payload;

    },
    setLanguages(state, action: PayloadAction<LanguageInfo[]>) {
      state.languages = action.payload;
    },
      resetResume() {
          return initialState;
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
} = resumeSlice.actions;

export default resumeSlice.reducer;
