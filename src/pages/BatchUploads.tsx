import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import API from "../services/axiosInterceptor";
import type { Resume } from "../types/types";
import ResumeCard from "../components/utils/ResumeCard";
import Button from "../components/utils/Button";

const BatchUploads: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const batchDate = location.state?.batchDate;
  console.log("Batch date", batchDate);
  useEffect(() => {
    const fetchResumes = async () => {
      console.log("Fetching resumes for batch:", batchId);
      if (!batchId) return;
      try {
        const { data } = await API.get(`/resumes/by-batch/${batchId}`);
        console.log("data: ", data);
        setResumes(data.resumes);
      } catch (err) {
        console.error("Error fetching resumes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, [batchId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--background)]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--accent)] border-t-transparent"></div>
        <div className="ml-4 text-lg text-[var(--text)]">
          Loading resumes...
        </div>
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="p-8 text-center text-[var(--text)] bg-[var(--background)]">
        No resumes found for this batch.
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto bg-[var(--background)] justify-center max-h-[75vh] overflow-y-auto">
      <Button to={`/insights/${batchId}`}>insights</Button>
      <h2 className="text-3xl font-bold mb-6 text-[var(--text)]">
        Uploaded Resumes {batchDate}{" "}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume: Resume) => (
          <ResumeCard key={resume.id} {...resume} />
        ))}
      </div>
    </div>
  );
};

export default BatchUploads;
