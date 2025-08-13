import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import API from "../services/axiosInterceptor";

// Set the chunk size for file uploads to 1MB
const CHUNK_SIZE = 1024 * 1024;
const API_URL = "http://localhost:5003";

interface FileStatus {
  fileName: string;
  status:
    | "uploaded"
    | "processing-ocr"
    | "parsing-text"
    | "completed"
    | "failed";
  message: string;
  progress?: number;
}

interface MatchResult {
  total: number;
  breakdown: {
    skills: number;
    experience: number;
    keywords: number;
  };
}

const ZipUploader: React.FC = () => {
  const [uploadStatus, setUploadStatus] = useState("Idle");
  const [fileStatuses, setFileStatuses] = useState<Record<string, FileStatus>>(
    {}
  );
  const [matchStatus, setMatchStatus] = useState("Idle");
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    getUploadedData();
    const socket = io(API_URL, {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("processing-complete", (data) => {
      console.log("Processing complete:", data);
      setFileStatuses((prevStatuses) => ({
        ...prevStatuses,
        [data.fileName]: {
          ...prevStatuses[data.fileName],
          status: "completed",
          message: "Processing completed successfully.",
        },
      }));
      console.log("file processing completed");
      getUploadedData();
    });

    socket.on("processing-failed", (data) => {
      console.log("Processing failed:", data);
      setFileStatuses((prevStatuses) => ({
        ...prevStatuses,
        [data.fileName]: {
          ...prevStatuses[data.fileName],
          status: "failed",
          message: `Processing failed: ${data.error}`,
        },
      }));
    });

    socket.on("job-matched", (data) => {
      console.log("Job match result received:", data);
      setMatchStatus("Matching complete!");
      setMatchResult(data.matchResult);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getUploadedData = async () => {
    try {
      const { data: res } = await API.get("/resumes/get-all-resumes");
      console.log("resumes --------------------------");
      console.log(res);
    } catch (err) {
      console.error("Error fetching resumes:", err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId = `${Date.now()}-${file.name}`;
    setUploadStatus("Uploading...");

    setFileStatuses({
      [file.name]: {
        fileName: file.name,
        status: "uploaded",
        message: "Waiting for server to process...",
      },
    });

    for (let i = 0; i < totalChunks; i++) {
      const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("uploadId", uploadId);
      formData.append("chunkIndex", i.toString());
      formData.append("totalChunks", totalChunks.toString());
      formData.append("fileName", file.name);

      try {
        await API.post("/uploads/zip", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (err) {
        setUploadStatus(`Upload failed at chunk ${i}`);
        console.error("Chunk upload error:", err);
        return;
      }
    }

    setUploadStatus(
      "Upload complete. Waiting for server to begin processing..."
    );

    if (socketRef.current) {
      socketRef.current.emit("join-upload", uploadId);
    }
  };

  const handleMatchJob = async () => {
    const jobId = "job-2";
    const resumeId = "d4ccf16b-7e12-47c5-957f-6d1f865ce600";
    const trackingKey = `${jobId}:${resumeId}`;

    setMatchStatus("Requesting job match...");
    setMatchResult(null);

    if (socketRef.current) {
      socketRef.current.emit("join-match", trackingKey);
    }

    try {
      await API.get(`/jobs/match-job`, {
        params: { jobId, resumeId },
      });
      setMatchStatus("Matching job started. Awaiting results...");
    } catch (error) {
      console.error("Error during API call:", error);
      setMatchStatus("API request failed.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Upload ZIP (Chunked)</h2>
      <input type="file" accept=".zip" onChange={handleFileUpload} />
      <p className="mt-2 text-sm">Main Status: {uploadStatus}</p>

      {Object.keys(fileStatuses).length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">File Processing Status</h3>
          <ul>
            {Object.values(fileStatuses).map((file, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span>{file.fileName}:</span>
                <span
                  className={
                    file.status === "completed"
                      ? "text-green-600"
                      : file.status === "failed"
                        ? "text-red-600"
                        : "text-blue-600"
                  }
                >
                  {file.message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ⭐ New section for the job matching tester */}
      <hr className="my-6 border-gray-300" />
      <div>
        <h3 className="text-xl font-bold mb-2">Job Matcher Tester</h3>
        <p className="text-sm text-gray-600 mb-4">
          This will trigger a job match for a hardcoded resume and job ID.
        </p>
        <button
          onClick={handleMatchJob}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Test Job Match
        </button>

        <div className="mt-4 p-4 border border-gray-300 rounded">
          <p className="font-semibold">Match Status: {matchStatus}</p>
          {matchResult && (
            <div className="mt-2">
              <h4 className="text-lg font-bold">
                Total Score: {matchResult.total}%
              </h4>
              <ul className="text-sm mt-1 list-disc list-inside">
                <li>Skills: {matchResult.breakdown.skills}%</li>
                <li>Experience: {matchResult.breakdown.experience}%</li>
                <li>Keywords: {matchResult.breakdown.keywords}%</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZipUploader;
