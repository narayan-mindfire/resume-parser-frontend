import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/axiosInterceptor";
import type { Resume } from "../types/types";
import ResumeCard from "../components/utils/ResumeCard";

const UploadsPage: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <div className="ml-4 text-lg text-gray-700">Loading resumes...</div>
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No resumes found for this batch.
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Uploaded Resumes (Batch:{" "}
        <span className="text-blue-600">{batchId}</span>)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume: Resume) => (
          <ResumeCard key={resume.id} {...resume} />
        ))}
      </div>
    </div>
  );
};

export default UploadsPage;
