import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import API from "../services/axiosInterceptor";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import Button from "../components/utils/Button";
import InputField from "../components/generic/Input";

const registerSchema = z.object({
  fname: z.string().min(1, "First name is required"),
  lname: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters"),
  profileImage: z.any().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("fname", data.fname);
      formData.append("lname", data.lname);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("bio", data.bio);
      if (data.profileImage && data.profileImage[0]) {
        formData.append("profileImage", data.profileImage[0]);
      }

      const res = await API.post(
        "http://localhost:5003/api/v1/auth/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      login(res.data.user, res.data.accessToken);
      reset();
      navigate("/upload");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setErrorMsg(axiosErr.response?.data?.message || "Registration failed");
      } else {
        setErrorMsg("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[var(--background)] px-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-[var(--background2)] rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-[var(--text)]">
          Create Account
        </h2>

        {errorMsg && (
          <div className="bg-[var(--primary)] text-white p-2 rounded-md mb-4 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            label="First Name"
            placeholder="John"
            register={register("fname")}
            error={errors.fname}
          />
          <InputField
            label="Last Name"
            placeholder="Doe"
            register={register("lname")}
            error={errors.lname}
          />
          <InputField
            label="Email"
            type="email"
            placeholder="john.doe@example.com"
            register={register("email")}
            error={errors.email}
          />
          <InputField
            label="Password"
            type="password"
            placeholder="••••••••"
            register={register("password")}
            error={errors.password}
          />
          <InputField
            label="Bio"
            placeholder="I'm a passionate developer."
            register={register("bio")}
            error={errors.bio}
            textarea
          />
          <InputField
            label="Profile Image (optional)"
            type="file"
            accept="image/*"
            register={register("profileImage")}
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Registering..." : "Sign Up"}
          </Button>
        </form>
      </div>
    </div>
  );
}
