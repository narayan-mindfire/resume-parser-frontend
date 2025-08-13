import React from "react";

interface ProgressBarProps {
  progress: number;
  status: string;
  fileName?: string;
  className?: string;
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  status,
  fileName,
  className = "",
  showPercentage = true,
}) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case "uploading":
      case "processing":
        return "bg-blue-500";
      case "completed":
      case "success":
        return "bg-green-500";
      case "failed":
      case "error":
        return "bg-red-500";
      case "idle":
      default:
        return "bg-gray-300";
    }
  };

  const getStatusText = () => {
    switch (status.toLowerCase()) {
      case "uploading":
        return "Uploading...";
      case "processing":
        return "Processing...";
      case "completed":
      case "success":
        return "Completed";
      case "failed":
      case "error":
        return "Failed";
      case "idle":
        return "Ready";
      default:
        return status;
    }
  };

  const progressPercentage = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {fileName && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 truncate">
            {fileName}
          </span>
          <span className="text-sm text-gray-500">{getStatusText()}</span>
        </div>
      )}

      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ease-in-out ${getStatusColor()}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {showPercentage && (
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">
            {progressPercentage.toFixed(1)}%
          </span>
          {status === "failed" && (
            <span className="text-xs text-red-500">Upload failed</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
