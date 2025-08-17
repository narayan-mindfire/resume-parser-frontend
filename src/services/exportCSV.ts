import type { Resume } from "../types/types";

export const exportResumesToCSV = (resumes: Resume[], batchId: string) => {
  const headers = [
    "ID",
    "File Name",
    "Name",
    "Email",
    "Phone",
    "Total Experience (Years)",
    "Processing Status",
    "Skills",
    "Experience",
    "Education",
    "URL",
  ];

  const csvContent = [
    headers.join(","),
    ...resumes.map((resume) =>
      [
        resume.id,
        `"${resume.fileName}"`,
        `"${resume.name}"`,
        `"${resume.email}"`,
        `"${resume.phone}"`,
        resume.totalExperienceYears,
        resume.processingStatus,
        `"${resume.skills.join(", ")}"`,
        `"${resume.experience.join(", ")}"`,
        `"${resume.education.join(", ")}"`,
        `"${resume.url}"`,
      ].join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `resumes_batch_${batchId}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
