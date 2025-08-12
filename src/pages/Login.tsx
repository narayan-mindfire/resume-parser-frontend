// src/pages/Login.jsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import API from "../services/axiosInterceptor";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import Button from "../components/utils/Button";
import InputField from "../components/generic/Input";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await API.post("/auth/login", data);
      login(res.data.user, res.data.accessToken);
      navigate("/upload");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setErrorMsg(axiosErr.response?.data?.message || "Login failed");
      } else {
        setErrorMsg("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[var(--background)] px-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-[var(--background2)] rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-[var(--text)]">
          Login
        </h2>

        {errorMsg && (
          <div className="bg-[var(--primary)] text-white p-2 rounded-md mb-4 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            label="Email"
            placeholder="john.doe@example.com"
            register={register("email")}
            error={errors.email}
          />
          <InputField
            label="password"
            placeholder="******"
            type="password"
            register={register("password")}
            error={errors.password}
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
