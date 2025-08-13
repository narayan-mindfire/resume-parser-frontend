import type { Resume } from "../../types/types";

function ResumeCard(resume: Resume) {
  return (
    <div
      key={resume.id}
      className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          {resume.name || "Name Not Found"}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            resume.processingStatus === "completed"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {resume.processingStatus}
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-4">{resume.fileName}</p>

      <div className="space-y-4">
        {resume.email && (
          <div>
            <p className="text-gray-700 font-medium">
              Email: <span className="font-normal">{resume.email}</span>
            </p>
          </div>
        )}

        {resume.phone && (
          <div>
            <p className="text-gray-700 font-medium">
              Phone: <span className="font-normal">{resume.phone}</span>
            </p>
          </div>
        )}

        {resume.totalExperienceYears && (
          <div>
            <p className="text-gray-700 font-medium">
              Total Experience:{" "}
              <span className="font-normal">
                {resume.totalExperienceYears} years
              </span>
            </p>
          </div>
        )}

        {resume.skills?.length > 0 && (
          <div>
            <p className="text-gray-700 font-medium">Skills:</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {resume.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {resume.experience?.length > 0 && (
          <div>
            <p className="text-gray-700 font-medium">Experience:</p>
            <ul className="mt-1 space-y-2">
              {resume.experience.map((exp, idx) => (
                <li key={idx} className="bg-gray-100 p-3 rounded-lg">
                  <p className="font-semibold">{exp}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {resume.education?.length > 0 && (
          <div>
            <p className="text-gray-700 font-medium">Education:</p>
            <ul className="mt-1 space-y-2">
              {resume.education.map((edu) => (
                <div className="text-gray-700 font-medium">
                  <p>{edu}</p>
                </div>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeCard;
