import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/axiosInterceptor";
import type { Batch } from "../types/types";

function UploadsPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await API.get("/batches/my-batches");
        setBatches(res.data);
      } catch (err) {
        console.error("Error fetching batches:", err);
        setError("Failed to fetch batches");
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  const handleBatchClick = (batchId: string) => {
    navigate(`/uploads/${batchId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[85vh] bg-[var(--background)]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--accent)] border-t-transparent"></div>
        <div className="ml-4 text-lg text-[var(--text)]">
          Loading batches...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-[var(--background)] min-h-[85vh]">
        <div className="max-w-md mx-auto">
          <div className="text-red-500 text-lg mb-4">Error</div>
          <p className="text-[var(--text)]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-0  max-w-6xl mx-auto bg-[var(--background)] min-h-[80.6vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text)] mb-2">
          My Upload Batches
        </h1>
        <p className="text-[var(--muted)]">
          Click on any batch to view uploaded resumes
        </p>
      </div>

      {batches.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-[var(--text)] mb-2">
            No batches found
          </h3>
          <p className="text-[var(--muted)]">
            You haven't uploaded any resumes yet.
          </p>
        </div>
      ) : (
        <div className="bg-[var(--background)] rounded-lg shadow-lg border border-[var(--background2)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--background2)] border-b border-[var(--background2)]">
                  <th className="px-6 py-4 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider hidden sm:table-cell">
                    Batch ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--background2)]">
                {batches.map((batch) => (
                  <tr
                    key={batch.id}
                    onClick={() => handleBatchClick(batch.id)}
                    className="hover:bg-[var(--background2)] cursor-pointer transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-sm font-medium text-[var(--text)]">
                        {batch.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--text)]">
                        {formatDate(batch.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBatchClick(batch.id);
                        }}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-[var(--background)] bg-[var(--accent)] hover:bg-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] transition-colors duration-200"
                      >
                        View Resumes
                        <svg
                          className="ml-1 -mr-0.5 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {batches.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-[var(--muted)]">
            Total batches:{" "}
            <span className="font-semibold">{batches.length}</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default UploadsPage;
