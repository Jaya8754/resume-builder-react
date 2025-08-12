import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "../interfaces/interfaces";

const styles = StyleSheet.create({
  page: {
    padding: 32, 
    fontSize: 12, 
    fontFamily: "Helvetica",
    lineHeight: 1.5,
    color: "#374151", 
  },
  section: {
    marginBottom: 8, 
  },
  header: {
    fontSize: 34, 
    fontWeight: "bold",
    marginBottom: 24,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "semibold",
    marginBottom: 4,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB", 
    borderBottomStyle: "solid",
  },
  smallText: {
    fontSize: 10,
    color: "#6B7280",
  },
  text: {
    marginTop: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  listItem: {
    marginLeft: 12,
  },
});

interface ResumeDocumentProps {
  resumeData: ResumeData;
}

export const ResumeDocument = ({ resumeData }: ResumeDocumentProps) => {
const {
  fullName,
  jobTitle,
  email,
  phoneNumber,
  location,
  linkedinProfile,
  portfolio,
  aboutMe,
  educations = [],
  experiences = [],
  skills = [],
  projects = [],
  certifications = [],
  interests = [],
  languages = [],
} = resumeData || {};


  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Personal Info */}
        <View style={styles.section}>
          <Text style={styles.header}>{fullName || "Your Name"}</Text>
          <Text style={{ fontSize: 14 }}>{jobTitle || "Job Title"}</Text>
          <Text style={styles.smallText}>
            {email} | {phoneNumber} | {location}
          </Text>
          {linkedinProfile && (
            <Text style={styles.smallText}>LinkedIn: {linkedinProfile}</Text>
          )}
          {portfolio && (
            <Text style={styles.smallText}>Portfolio: {portfolio}</Text>
          )}
        </View>

        {/* About Me */}
        {aboutMe.aboutMe && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>About Me</Text>
            <Text style={styles.text}>{aboutMe.aboutMe}</Text>
          </View>
        )}

        {/* Education */}
        {educations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Education</Text>
            {educations.map((edu, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <Text style={styles.bold}>{edu.degree}</Text>
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
        {experiences.some((exp) => exp.experienceType === "Work") && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Work Experience</Text>
            {experiences
              .filter((exp) => exp.experienceType === "Work")
              .map((exp, i) => (
                <View key={`work-${i}`} style={{ marginBottom: 8 }}>
                  <Text style={styles.bold}>{exp.jobTitle}</Text>
                  <Text>{exp.companyName} — {exp.location}</Text>
                  <Text style={styles.smallText}>{exp.startDate} - {exp.endDate}</Text>
                  {exp.responsibilities && <Text>{exp.responsibilities}</Text>}
                </View>
              ))}
          </View>
        )}

        {/* Internships */}
        {experiences.some((exp) => exp.experienceType === "Internship") && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Internships</Text>
            {experiences
              .filter((exp) => exp.experienceType === "Internship")
              .map((exp, i) => (
                <View key={`intern-${i}`} style={{ marginBottom: 8 }}>
                  <Text style={styles.bold}>{exp.jobTitle}</Text>
                  <Text>{exp.companyName} — {exp.location}</Text>
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
            <Text style={styles.text}>{skills.join(", ")}</Text>
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Projects</Text>
            {projects.map((proj, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <Text style={styles.bold}>{proj.projectTitle}</Text>
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
              <View key={i} style={{ marginBottom: 8 }}>
                <Text style={styles.bold}>{cert.certificationName}</Text>
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
