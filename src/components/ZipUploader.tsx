import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import API from "../services/axiosInterceptor";
import { useNavigate } from "react-router-dom";
import Button from "./utils/Button";

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

const ZipUploader: React.FC = () => {
  const navigate = useNavigate();
  const [uploadStatus, setUploadStatus] = useState("Idle");
  const [fileStatuses, setFileStatuses] = useState<Record<string, FileStatus>>(
    {},
  );
  const [isDragging, setIsDragging] = useState(false);
  const [completedBatchId, setCompletedBatchId] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const socket = io(API_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => console.log("Connected to Socket.IO server"));

    socket.on("processing-complete", (data) => {
      setFileStatuses((prev) => ({
        ...prev,
        [data.fileName]: {
          ...prev[data.fileName],
          fileName: data.fileName,
          status: "completed",
          message: "Processing completed successfully.",
        },
      }));
    });

    socket.on("batch-complete", (data: { batchId: string }) => {
      setUploadStatus("Processing complete!");
      setCompletedBatchId(data.batchId);
    });

    socket.on("processing-failed", (data) => {
      setFileStatuses((prev) => ({
        ...prev,
        [data.fileName]: {
          ...prev[data.fileName],
          status: "failed",
          message: `Processing failed: ${data.error}`,
        },
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleFileUpload = async (file: File) => {
    setCompletedBatchId(null);
    setFileStatuses({});
    setUploadStatus("Uploading...");

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId = `${Date.now()}-${file.name}`;
    let finalBatchId: string | null = null; // Store the batchId here

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
        const response = await API.post("/uploads/zip", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.data.batchId) {
          finalBatchId = response.data.batchId;
        }
      } catch (err) {
        if (err instanceof Error) {
          setUploadStatus(`Upload failed at chunk ${i}, ${err.message}`);
        }
        return;
      }
    }

    setUploadStatus(
      "Upload complete. Waiting for server to begin processing...",
    );
    socketRef.current?.emit("join-upload", uploadId);

    // Only emit the batch event after the finalBatchId is available
    if (finalBatchId) {
      socketRef.current?.emit("join-batch", finalBatchId);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleRedirect = () => {
    if (completedBatchId) {
      navigate(`/uploads/${completedBatchId}`);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto min-h-[80vh] bg-[var(--background)] text-[var(--text)] transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-4 text-[var(--primary)]">
        Upload ZIP (Drag & Drop)
      </h2>

      <div
        className={`border-2 border-dashed rounded-lg p-10 py-20 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-[var(--accent)] bg-[var(--highlight)]"
            : "border-[var(--muted)]"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <p className="text-[var(--muted)]">
          Drag & drop your .zip file here, or{" "}
          <span className="text-[var(--accent)] underline">
            click to browse
          </span>
        </p>
        <input
          type="file"
          accept=".zip"
          className="hidden"
          ref={fileInputRef}
          onChange={onFileSelect}
        />
      </div>

      <p className="mt-3 text-sm text-[var(--muted)]">Status: {uploadStatus}</p>

      {completedBatchId && (
        <div className="mt-4">
          <Button onClick={handleRedirect}>Go to Uploads Page</Button>
        </div>
      )}

      {Object.keys(fileStatuses).length > 0 && (
        <div className="mt-4 bg-[var(--background2)] p-4 rounded-lg shadow max-h-75 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2 text-[var(--accent)]">
            File Processing Status
          </h3>
          <ul>
            {Object.values(fileStatuses).map((file, index) => (
              <li
                key={index}
                className="flex justify-between border-b border-[var(--muted)] py-1"
              >
                <span>{file.fileName}</span>
                <span
                  className={
                    file.status === "completed"
                      ? "text-green-500"
                      : file.status === "failed"
                        ? "text-red-500"
                        : "text-[var(--accent)]"
                  }
                >
                  {file.message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ZipUploader;
