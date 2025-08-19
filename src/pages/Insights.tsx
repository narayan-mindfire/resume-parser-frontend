import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/axiosInterceptor";
import type { Insights } from "../types/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { GraduationCap, Award } from "lucide-react";

function BatchInsightsPage() {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();

  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!batchId) {
      setError("Batch ID not found");
      setLoading(false);
      return;
    }

    API.get(`/batches/insights?batchId=${batchId}`)
      .then((res) => {
        setInsights(res.data.insights);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch insights");
        setLoading(false);
        navigate("/not-found");
      });
  }, [batchId, navigate]);

  const CHART_COLORS = [
    "var(--accent)",
    "var(--primary)",
    "var(--highlight)",
    "var(--muted)",
    "var(--accent)",
    "var(--primary)",
    "var(--text)",
    "var(--muted)",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text)] text-lg">Loading insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center mb-4">
            <span className="text-[var(--background)] text-2xl">!</span>
          </div>
          <p className="text-[var(--primary)] text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <p className="text-[var(--muted)] text-lg">No insights available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] transition-colors duration-300">
      <div className="bg-[var(--accent)] text-[var(--background)]">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold mb-2">Batch Analytics Dashboard</h1>
          <p className="text-lg opacity-90">Batch ID: {batchId}</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-[var(--background2)] rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--muted)] text-sm font-medium">
                  Universities
                </p>
                <p className="text-3xl font-bold text-[var(--text)]">
                  {insights.commonUniversities.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-[var(--primary)] rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[var(--background)]" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-[var(--background2)] rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-6">
              <Award className="w-5 h-5 text-[var(--accent)] mr-2" />
              <h3 className="text-xl font-bold text-[var(--text)]">
                Top Skills Distribution
              </h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.topSkills.slice(0, 6)}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--muted)"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="skill"
                    tick={{ fill: "var(--text)", fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fill: "var(--text)", fontSize: 12 }} />
                  <Bar
                    dataKey="count"
                    fill="var(--accent)"
                    radius={[4, 4, 0, 0]}
                  >
                    {insights.topSkills.slice(0, 6).map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[var(--background2)] rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-6">
              <GraduationCap className="w-5 h-5 text-[var(--accent)] mr-2" />
              <h3 className="text-xl font-bold text-[var(--text)]">
                Top Universities
              </h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.commonUniversities} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--muted)"
                    opacity={0.3}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: "var(--text)", fontSize: 12 }}
                  />
                  <YAxis
                    dataKey="university"
                    type="category"
                    tick={{ fill: "var(--text)", fontSize: 12 }}
                    width={150}
                  />
                  <Bar
                    dataKey="count"
                    fill="var(--primary)"
                    radius={[0, 4, 4, 0]}
                  >
                    {insights.commonUniversities.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="bg-[var(--background2)] rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-[var(--text)] mb-6">
            Complete Skills Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {insights.topSkills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-[var(--background)] rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-3"
                    style={{
                      backgroundColor:
                        CHART_COLORS[index % CHART_COLORS.length],
                    }}
                  ></div>
                  <span className="font-medium text-[var(--text)]">
                    {skill.skill}
                  </span>
                </div>
                <span className="bg-[var(--accent)] text-[var(--background)] px-2 py-1 rounded-full text-sm font-bold">
                  {skill.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BatchInsightsPage;
