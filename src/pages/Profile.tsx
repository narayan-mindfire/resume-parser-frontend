import { memo, useEffect, useState, Suspense, lazy } from "react";
import API from "../services/axiosInterceptor";
import { motion } from "framer-motion";
import Button from "../components/utils/Button";
import { Helmet } from "@dr.pogodin/react-helmet";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Lazy load modals
const EditProfileModal = lazy(
  () => import("../components/modals/EditProfileModal"),
);
const ConfirmModal = lazy(() => import("../components/modals/ConfirmModal"));

interface User {
  fname: string;
  lname: string;
  email: string;
  profileImage: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    API.get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleDeleteConfirmed = async () => {
    try {
      await API.delete("/auth/me");
      logout();
      navigate("/");
    } catch {
      console.error("failed to delete profile");
    }
    setIsConfirmingDelete(false);
  };

  if (!user) {
    return (
      <div className="text-center text-muted mt-10 animate-pulse">
        Loading...
      </div>
    );
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const lastUpdated = new Date(user.updatedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Helmet>
        <title>{`${user.fname} ${user.lname} | Resume Parser`}</title>
        <meta
          name="description"
          content={`Profile of ${user.fname} ${user.lname} on Resume Parser platform.`}
        />
      </Helmet>

      <div className="min-h-screen bg-[var(--background)] py-16 px-6 text-[var(--text)] transition-colors duration-300">
        {isConfirmingDelete && (
          <Suspense fallback={<div>Loading...</div>}>
            <ConfirmModal
              message="Are you sure you want to delete your account? This action is irreversible."
              onConfirm={handleDeleteConfirmed}
              onCancel={() => setIsConfirmingDelete(false)}
            />
          </Suspense>
        )}

        {isEditing && (
          <Suspense fallback={<div>Loading...</div>}>
            <EditProfileModal
              defaultValues={{ ...user }}
              onClose={() => setIsEditing(false)}
              onSuccess={() => console.log("success")}
            />
          </Suspense>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto rounded-2xl shadow-2xl bg-[var(--background)] overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Left side: avatar + name */}
            <div className="bg-[var(--accent)] flex flex-col items-center justify-center p-10 text-white">
              <motion.img
                src={user.profileImage}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md"
                whileHover={{ scale: 1.05 }}
              />
              <motion.h2
                className="mt-6 text-2xl font-bold text-center"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {user.fname} {user.lname}
              </motion.h2>
              <p className="mt-2 text-sm opacity-80">{user.email}</p>
            </div>

            {/* Right side: bio + dates + actions */}
            <div className="md:col-span-2 p-10 flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-semibold text-[var(--primary)]">
                  Bio
                </h3>
                <p className="text-sm text-[var(--muted)]">
                  {user.bio || "No bio provided."}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[var(--primary)]">
                  Member Since
                </h3>
                <p className="text-sm text-[var(--muted)]">{memberSince}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[var(--primary)]">
                  Last Updated
                </h3>
                <p className="text-sm text-[var(--muted)]">{lastUpdated}</p>
              </div>

              <div className="flex gap-4 mt-6">
                <Button onClick={() => setIsEditing(true)} className="w-full">
                  Edit Profile
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="w-full"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default memo(ProfilePage);
