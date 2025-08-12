// src/api/resumeApi.ts or src/hooks/useResumeData.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {PersonalInfo, AboutMe, EducationInfo, ExperienceInfo, 
  SkillsInfo, ProjectInfo, CertificationInfo, LanguageInfo} from "@/components/interfaces/interfaces";
import api from '../api/api';

type ResumePayloadType = { 

  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;

}

export const useResumeData = (resumeId: string) =>
  useQuery({
    queryKey: ['resume', resumeId],
    queryFn: async () => {
      const response = await api.get(`/resumes/${resumeId}`);
      return response.data.data.resume; 
    },
    enabled: !!resumeId,
    staleTime: 0, // set to 0 to always fetch fresh data when invalidated
  });


// Example mutation function in useCreateResume
export const useCreateResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (initialData?: Partial<ResumePayloadType>) => 
      api.post("/resumes", initialData || {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
};


export const useAllResumes = () => {
  return useQuery({
    queryKey: ['resumes'],
    queryFn: async () => {
      const { data } = await api.get('/resumes');
      return data.data.resumes;
    },
  });
};

export const useUpdatePersonalInfo = (resumeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PersonalInfo) =>
      api.put(`/resumes/${resumeId}/personal-details`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
    },
  });
};

export const useUpdateAboutMe = (resumeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AboutMe) =>
      api.put(`/resumes/${resumeId}/about-me`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
    },
  });
};

export const useUpdateEducation = (resumeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { educations: EducationInfo[] }) =>
      api.put(`/resumes/${resumeId}/educations`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
    },
  });
};


export const useUpdateExperience = (resumeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ExperienceInfo[]) =>
      api.put(`/resumes/${resumeId}/experiences`, { experiences: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
    },
  });
};

export const useUpdateSkills = (resumeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { skills: SkillsInfo }) =>
      api.put(`/resumes/${resumeId}/skills`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
    },
  });
};


export const useUpdateProjects = (resumeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { projects: ProjectInfo[] }) =>
      api.put(`/resumes/${resumeId}/projects`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
    },
  });
};

export const useUpdateCertifications = (resumeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CertificationInfo[]) =>
      api.put(`/resumes/${resumeId}/certifications`, {
        certifications: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
    },
  });
};

export type InterestsPayload = { interests: string[] }

export const useUpdateInterests = (resumeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: InterestsPayload) =>
      api.put(`/resumes/${resumeId}/interests`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
    },
  });
};

export const useUpdateLanguages = (resumeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { languages: LanguageInfo[] }) =>
      api.put(`/resumes/${resumeId}/languages`, payload), // wrap array in object
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
    },
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resumeId: string) => api.delete(`/resumes/${resumeId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] }); // refresh the list of all resumes
    },
  });
};
