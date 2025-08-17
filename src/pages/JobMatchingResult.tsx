import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/axiosInterceptor";
import type { Resume } from "../types/types";

interface MatchResult {
  resumeId: string;
  score: {
    total: number;
    breakdown: { skills: number; experience: number; keywords: number };
  };
}

const JobMatchingResultPage = () => {
  const { batchId, jobId } = useParams<{ batchId: string; jobId: string }>();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!batchId || !jobId) return;

      try {
        const { data } = await API.get(
          `/jobs/match-batch-job?batchId=${batchId}&jobId=${jobId}`,
        );
        setMatches(data.matches);
        const resResumes = await API.get(`/resumes/by-batch/${batchId}`);
        setResumes(resResumes.data.resumes);
      } catch (err) {
        console.error("Error fetching match results", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [batchId, jobId]);

  if (loading) return <p>Loading job matches...</p>;

  const resumeMap = Object.fromEntries(resumes.map((r) => [r.id, r]));

  return (
    <div className="p-6 max-w-5xl mx-auto bg-[var(--background)]">
      <h2 className="text-2xl font-bold mb-6 text-[var(--text)]">
        Job Match Results
      </h2>

      <div className="grid grid-cols-1 gap-6">
        {matches.map((match) => {
          const resume = resumeMap[match.resumeId];
          return (
            <div
              key={match.resumeId}
              className="bg-[var(--background2)] rounded-2xl p-6 shadow-md"
            >
              <h3 className="text-xl font-semibold text-[var(--accent)] hover:underline">
                <Link to={resume.url!} target="_blank">
                  {resume?.name || "Unknown Candidate"}
                </Link>
              </h3>
              <p className="text-[var(--muted)]">
                Total Score:{" "}
                <span className="text-[var(--primary)] font-bold">
                  {match.score.total}
                </span>
              </p>
              <div className="mt-3 text-sm text-[var(--text)]">
                <p>Skills: {match.score.breakdown.skills}</p>
                <p>Experience: {match.score.breakdown.experience}</p>
                <p>Keywords: {match.score.breakdown.keywords}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobMatchingResultPage;
