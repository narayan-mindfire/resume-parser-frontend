import { useState } from "react";
import type { Resume } from "../../types/types";
import ResumeModal from "../modals/ResumeModal";
import { Link } from "react-router-dom";
import Button from "./Button";
function ResumeCard(resume: Resume) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        key={resume.id}
        className="p-6 bg-[var(--background)] rounded-xl shadow-lg border border-[var(--background2)] hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-[var(--text)]">
            {resume.name || "Name Not Found"}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              resume.processingStatus === "completed"
                ? "bg-[var(--accent)] text-[var(--background)]"
                : "bg-[var(--primary)] text-[var(--background)]"
            }`}
          >
            {resume.processingStatus}
          </span>
        </div>
        <Link
          to={resume.url || "#"}
          target="_blank"
          className="text-sm text-[var(--accent)] hover:underline"
        >
          <p className="text-sm text-[var(--accent)] mb-4">{resume.fileName}</p>
        </Link>

        <div className="space-y-3">
          {resume.email && (
            <div>
              <p className="text-[var(--text)] font-medium">
                Email: <span className="font-normal">{resume.email}</span>
              </p>
            </div>
          )}

          {resume.phone && (
            <div>
              <p className="text-[var(--text)] font-medium">
                Phone: <span className="font-normal">{resume.phone}</span>
              </p>
            </div>
          )}

          <div>
            <p className="text-[var(--text)] font-medium">
              Total Experience:{" "}
              <span className="font-normal">
                {resume.totalExperienceYears || 0} years
              </span>
            </p>
          </div>
        </div>

        <Button variant="outline" className="justify-center mt-4 w-full">
          Click to view full details
        </Button>
      </div>

      {isModalOpen && (
        <ResumeModal resume={resume} onClose={handleCloseModal} />
      )}
    </>
  );
}

export default ResumeCard;
