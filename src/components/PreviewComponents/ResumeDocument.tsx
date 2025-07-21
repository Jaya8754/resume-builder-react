import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

Font.register({ family: "Helvetica", src: "path-to-font.ttf" });

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.4,
    color: "#333",
  },
  section: {
    marginBottom: 12,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    paddingBottom: 2,
  },
  text: {
    marginBottom: 3,
  },
  smallText: {
    fontSize: 9,
    color: "#555",
  },
  listItem: {
    marginLeft: 12,
    marginBottom: 2,
  },
});

interface ResumeData {
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phoneNumber: string;
    location: string;
  };
  aboutMe: {
    aboutMe: string;
  };
  education: {
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    description?: string;
    cgpa?: string;
  }[];
  experience: {
    experienceType:string;
    jobtitle: string;
    companyname: string;
    location: string;
    startDate: string;
    endDate: string;
    responsibilities?: string;
  }[];
  skills: string[];
  projects: {
    projectTitle: string;
    description?: string;
  }[];
  certifications: {
    certificationName: string;
    issuer: string;
    issuedDate: string;
    skillsCovered?: string;
  }[];
  interests: string[];
  languages: {
    language: string;
    level: string;
  }[];
}

interface ResumeDocumentProps {
  resumeData: ResumeData;
}

export const ResumeDocument: React.FC<ResumeDocumentProps> = ({ resumeData }) => {
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
  } = resumeData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Personal Info */}
        <View style={styles.section}>
          <Text style={styles.header}>{personalInfo.fullName || "Your Name"}</Text>
          <Text style={styles.text}>{personalInfo.jobTitle || "Job Title"}</Text>
          <Text style={styles.smallText}>
            {personalInfo.email} | {personalInfo.phoneNumber} | {personalInfo.location}
          </Text>
        </View>

        {/* About Me */}
        {aboutMe.aboutMe && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>About Me</Text>
            <Text style={styles.text}>{aboutMe.aboutMe}</Text>
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Education</Text>
            {education.map((edu, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={{ fontWeight: "bold" }}>{edu.degree}</Text>
                <Text>
                  {edu.institution} — {edu.location}
                </Text>
                <Text style={styles.smallText}>
                  {edu.startDate} - {edu.endDate}
                </Text>
                {edu.description && <Text>{edu.description}</Text>}
                {edu.cgpa && <Text>CGPA: {edu.cgpa}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Work Experience */}
        {experience.filter((exp) => exp.experienceType === "Work").length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Work Experience</Text>
            {experience
              .filter((exp) => exp.experienceType === "Work")
              .map((exp, i) => (
                <View key={`work-${i}`} style={{ marginBottom: 6 }}>
                  <Text style={{ fontWeight: "bold" }}>{exp.jobtitle}</Text>
                  <Text>{exp.companyname} — {exp.location}</Text>
                  <Text style={styles.smallText}>{exp.startDate} - {exp.endDate}</Text>
                  {exp.responsibilities && <Text>{exp.responsibilities}</Text>}
                </View>
              ))}
          </View>
        )}

        {/* Internship */}
        {experience.filter((exp) => exp.experienceType === "Internship").length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Internships</Text>
            {experience
              .filter((exp) => exp.experienceType === "Internship")
              .map((exp, i) => (
                <View key={`intern-${i}`} style={{ marginBottom: 6 }}>
                  <Text style={{ fontWeight: "bold" }}>{exp.jobtitle}</Text>
                  <Text>{exp.companyname} — {exp.location}</Text>
                  <Text style={styles.smallText}>{exp.startDate} - {exp.endDate}</Text>
                  {exp.responsibilities && <Text>{exp.responsibilities}</Text>}
                </View>
              ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Skills</Text>
            <Text>{skills.join(", ")}</Text>
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Projects</Text>
            {projects.map((proj, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={{ fontWeight: "bold" }}>{proj.projectTitle}</Text>
                {proj.description && <Text>{proj.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Certifications</Text>
            {certifications.map((cert, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={{ fontWeight: "bold" }}>{cert.certificationName}</Text>
                <Text>
                  {cert.issuer} — <Text style={styles.smallText}>{cert.issuedDate}</Text>
                </Text>
                {cert.skillsCovered && <Text>Skills Covered: {cert.skillsCovered}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Interests */}
        {interests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Interests</Text>
            <Text>{interests.join(", ")}</Text>
          </View>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Languages</Text>
            {languages.map(({ language, level }, i) => (
              <Text key={i} style={styles.listItem}>
                {language} — {level}
              </Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};
