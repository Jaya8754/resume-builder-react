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

export type AboutMe = { aboutMe: string };

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
  jobTitle: string;
  companyName: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
  [key: string]: string ;
};

export type SkillsInfo = string[];
export type ProjectInfo = { projectTitle: string; description: string; [key: string]: string };
export type CertificationInfo = { certificationName: string; issuer: string; issuedDate: string; skillsCovered: string[] | string;};
export type InterestsInfo = string[];
export type LanguageInfo = { language: string; level: string };


