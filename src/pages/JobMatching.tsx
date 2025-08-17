import { useParams, useNavigate } from "react-router-dom";
import { JOBS } from "../constants/jobDescriptions";
import Button from "../components/utils/Button";

const JobMatchingPage = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();

  if (!batchId) return <p>No batch selected</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-[var(--background)]">
      <h2 className="text-2xl font-bold mb-6 text-[var(--text)]">
        Select a Job to Match with Batch
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {JOBS.map((job) => (
          <div
            key={job.id}
            className="bg-[var(--background2)] rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition"
          >
            <div>
              <h3 className="text-xl font-semibold text-[var(--text)]">
                {job.title}
              </h3>
              <p className="text-[var(--muted)] mt-2">{job.description}</p>
              <div className="mt-4">
                <h4 className="font-medium">Required Skills:</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-[var(--accent)] text-white px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Required Experience: {job.required_experience_years} years
              </p>
            </div>

            <Button
              className="mt-6"
              onClick={() => navigate(`/match/${batchId}/job/${job.id}`)}
            >
              Match This Job
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobMatchingPage;
