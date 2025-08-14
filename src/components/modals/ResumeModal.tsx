import { useEffect } from "react";
import type { Resume } from "../../types/types";

interface ResumeModalProps {
  resume: Resume;
  onClose: () => void;
}

function ResumeModal({ resume, onClose }: ResumeModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-[var(--background)] rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[var(--background)] border-b border-[var(--background2)] px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[var(--text)]">
            {resume.name || "Resume Details"}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--muted)] hover:text-[var(--text)] text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--background2)] transition-colors"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-[var(--background2)] p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
                  Basic Information
                </h3>
                <div className="space-y-2">
                  <p className="text-[var(--text)]">
                    <span className="font-medium">Name:</span>{" "}
                    {resume.name || "Not provided"}
                  </p>
                  <p className="text-[var(--text)]">
                    <span className="font-medium">Email:</span>{" "}
                    {resume.email || "Not provided"}
                  </p>
                  <p className="text-[var(--text)]">
                    <span className="font-medium">Phone:</span>{" "}
                    {resume.phone || "Not provided"}
                  </p>
                  <p className="text-[var(--text)]">
                    <span className="font-medium">Total Experience:</span>{" "}
                    {resume.totalExperienceYears
                      ? `${resume.totalExperienceYears} years`
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-[var(--background2)] p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
                  File Information
                </h3>
                <div className="space-y-2">
                  <p className="text-[var(--text)]">
                    <span className="font-medium">Filename:</span>{" "}
                    {resume.fileName || "Unknown"}
                  </p>
                  <p className="text-[var(--text)]">
                    <span className="font-medium">Status:</span>
                    <span
                      className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        resume.processingStatus === "completed"
                          ? "bg-[var(--accent)] text-[var(--background)]"
                          : "bg-[var(--primary)] text-[var(--background)]"
                      }`}
                    >
                      {resume.processingStatus}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {resume.skills?.length > 0 && (
            <div className="bg-[var(--background2)] p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-[var(--text)] mb-3">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-[var(--background)] text-[var(--text)] px-3 py-1 rounded-full text-sm border border-[var(--background2)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {resume.experience?.length > 0 && (
            <div className="bg-[var(--background2)] p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-[var(--text)] mb-3">
                Experience
              </h3>
              <div className="space-y-3">
                {resume.experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="bg-[var(--background)] p-3 rounded-lg border border-[var(--background2)]"
                  >
                    <p className="text-[var(--text)]">{exp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resume.education?.length > 0 && (
            <div className="bg-[var(--background2)] p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-[var(--text)] mb-3">
                Education
              </h3>
              <div className="space-y-3">
                {resume.education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="bg-[var(--background)] p-3 rounded-lg border border-[var(--background2)]"
                  >
                    <p className="text-[var(--text)]">{edu}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumeModal;
