import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { ResumeState } from "@/store/resumeSlice";
import { Edit } from "lucide-react";
import { Link } from "react-router-dom";

interface ResumePreviewProps {
  isCompact?: boolean;
  resumeData?: ResumeState;  
  showEditLinks?: boolean;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, isCompact, showEditLinks,}) => {
 
  const resume: ResumeState = resumeData ?? useSelector((state: RootState) => state.resume.currentResume);


  const {
    personalInfo,
    aboutMe,
    education,
    experience,
    skills,
    projects,
    certifications,
    interests,
    languages,
  } = resume;

  const sectionClass = isCompact ? "mb-4 text-sm" : "mb-6";

  const renderEditLink = (path: string) =>
    showEditLinks && (
      <Link
        to={path}
        className="text-blue-500 hover:text-blue-700 float-right no-print no-pdf"
        title="Edit"
      >
        <Edit className="w-4 h-4" />
      </Link>
    );
  

  return (
    <div className={`p-4 ${isCompact ? "max-h-[1000vh] overflow-y-auto" : "max-w-3xl mx-auto"}`}>
      {/* Personal Info */}
      <section className={sectionClass}>
        <h1 className="text-2xl font-bold">{personalInfo.fullName || "Your Name"}
          {renderEditLink("/resume/personal-info")}</h1>
        <p className="text-lg text-gray-700">{personalInfo.jobTitle || "Job Title"}</p>
        <p className="text-sm text-gray-600">
          {personalInfo.email} | {personalInfo.phoneNumber} | {personalInfo.location} 
        </p>
        {personalInfo.linkedinProfile && (
          <p className="text-sm text-gray-600">
            LinkedIn: {personalInfo.linkedinProfile}
          </p>
        )}

        {personalInfo.portfolio && (
          <p className="text-sm text-gray-600">
            Portfolio: {personalInfo.portfolio}
          </p>
        )}
      </section>

      {/* About Me */}
      {aboutMe.aboutMe && (
        <section className={sectionClass}>
          <h2 className="text-xl font-semibold border-b border-gray-300 pb-1">About Me
            {renderEditLink("/resume/aboutme")}
          </h2>
          <p className="mt-1">{aboutMe.aboutMe}</p>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className={sectionClass}>
          <h2 className="text-xl font-semibold border-b border-gray-300 pb-1">Education
             {renderEditLink("/resume/educational-info")}
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} className="mt-2">
              <strong>{edu.degree}</strong>, {edu.institution} — {edu.location}
              <div className="text-sm text-gray-600">
                {edu.startDate} - {edu.endDate}
              </div>
              {edu.description && <p className="mt-1">{edu.description}</p>}
              {edu.cgpa && <p>CGPA: {edu.cgpa}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className={sectionClass}>
          <h2 className="text-xl font-semibold border-b border-gray-300 pb-1">
            {experience[0].workOrInternship === "Internship" ? "Internships" : "Work Experience"}
            {renderEditLink("/resume/experience-info")}
          </h2>

          {experience.map((exp, idx) => (
            <div key={idx} className="mt-2">
              <strong>{exp.jobtitle}</strong>, {exp.companyname} — {exp.location}
              <div className="text-sm text-gray-600">
                {exp.startDate} - {exp.endDate}
              </div>
              {exp.responsibilities && <p className="mt-1">{exp.responsibilities}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className={sectionClass}>
          <h2 className="text-xl font-semibold border-b border-gray-300 pb-1">Skills
            {renderEditLink("/resume/skills-info")}
          </h2>
          <p className="mt-1">{skills.join(", ")}</p>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className={sectionClass}>
          <h2 className="text-xl font-semibold border-b border-gray-300 pb-1">Projects
            {renderEditLink("/resume/project-info")}
          </h2>
          {projects.map((proj, idx) => (
            <div key={idx} className="mt-2">
              <strong>{proj.projectTitle}</strong>
              {proj.description && <p>{proj.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className={sectionClass}>
          <h2 className="text-xl font-semibold border-b border-gray-300 pb-1">Certifications
            {renderEditLink("/resume/certificate-info")}
          </h2>
          {certifications.map((cert, idx) => (
            <div key={idx} className="mt-2">
              <strong>{cert.certificationName}</strong> — {cert.issuer}
              <div className="text-sm text-gray-600">{cert.issuedDate}</div>
              {cert.skillsCovered && <p>Skills Covered: {cert.skillsCovered}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Interests */}
      {interests.length > 0 && (
        <section className={sectionClass}>
          <h2 className="text-xl font-semibold border-b border-gray-300 pb-1">Interests
            {renderEditLink("/resume/interest-info")}
          </h2>
          <p>{interests.join(", ")}</p>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section className={sectionClass}>
          <h2 className="text-xl font-semibold border-b border-gray-300 pb-1">Languages
            {renderEditLink("/resume/languages-info")}
          </h2>
          <ul className="list-disc pl-5">
            {languages.map(({ language, level }, idx) => (
              <li key={idx}>
                {language} - {level}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
