import { useCallback, useEffect, useState } from "react";
import API from "../services/axiosInterceptor";
import type { Batch } from "../types/types";
import Button from "../components/utils/Button";

function UploadsPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[85vh] bg-[var(--background)] transition-colors duration-300">
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
    <div className="p-4 max-w-6xl mx-auto bg-[var(--background)] min-h-[80.6vh] transition-colors duration-300">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)] mb-1">
          My Upload Batches
        </h1>
        <p className="text-[var(--muted)] text-sm">
          Tap on any batch to view uploaded resumes.
        </p>
      </div>

      {batches.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
            No batches found
          </h3>
          <p className="text-[var(--muted)]">
            You haven't uploaded any resumes yet.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-[var(--background)] rounded-lg shadow-lg border border-[var(--background2)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--background2)] border-b border-[var(--background2)]">
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                      Batch ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--background2)]">
                  {batches.map((batch) => (
                    <tr
                      key={batch.id}
                      className="hover:bg-[var(--background2)] transition-colors"
                    >
                      <td className="px-6 py-4">{batch.id}</td>
                      <td className="px-6 py-4">
                        {formatDate(batch.createdAt)}
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <Button
                          to={`/uploads/${batch.id}`}
                          className="justify-center"
                        >
                          View Resumes
                        </Button>
                        <Button
                          to={`/insights/${batch.id}`}
                          className="justify-center"
                        >
                          Analytics
                        </Button>
                        <Button to={`/match/${batch.id}`}>Match Jobs</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="md:hidden space-y-4">
            {batches.map((batch) => (
              <div
                key={batch.id}
                className="bg-[var(--background2)] rounded-lg p-4 shadow"
              >
                <div className="mb-2">
                  <p className="text-xs text-[var(--muted)]">Batch ID</p>
                  <p className="font-medium text-[var(--text)] break-all">
                    {batch.id}
                  </p>
                </div>
                <div className="mb-2">
                  <p className="text-xs text-[var(--muted)]">Created At</p>
                  <p className="text-[var(--text)]">
                    {formatDate(batch.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button to={`/uploads/${batch.id}`} className="flex-1">
                    View Resumes
                  </Button>
                  <Button to={`/insights/${batch.id}`} className="flex-1">
                    Analytics
                  </Button>
                  <Button to={`/match/${batch.id}`} className="flex-1">
                    Match Jobs
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {batches.length > 0 && (
        <div className="mt-6 text-center text-sm text-[var(--muted)]">
          Total batches: <span className="font-semibold">{batches.length}</span>
        </div>
      )}
    </div>
  );
}

export default UploadsPage;
