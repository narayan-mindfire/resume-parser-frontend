import { motion } from "framer-motion";
import Button from "./Button";
import { useAuth } from "../../hooks/useAuth";

export const HeroSection = () => {
  const { currentUser } = useAuth();
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative flex flex-col justify-center items-center text-center gap-6 py-20 px-6 bg-[var(--background)] text-[var(--text)] overflow-hidden"
    >
      <h1 className="text-4xl sm:text-5xl font-bold leading-tight z-10">
        <span className="text-[var(--accent)]">Automated</span> &{" "}
        <span className="text-[var(--primary)]">Intelligent</span> Resume
        Parsing
      </h1>
      <p className="max-w-2xl text-lg text-[var(--muted)] z-10">
        Upload resumes in any format (PDF, DOCX, Images) and instantly extract
        key details like skills, experience, and education. Gain insights
        through an interactive dashboard to make faster, data-driven hiring
        decisions.
      </p>
      <div className="flex gap-4 flex-wrap justify-center z-10">
        <Button to={currentUser ? "/upload" : "/login"} variant="default">
          Upload Resumes
        </Button>
      </div>

      {/* Optional background illustration */}
      {/* <img
      src="/assets/resume-illustration.svg"
      alt="resume-parser-illustration"
      className="absolute bottom-0 right-0 w-40 md:w-72 opacity-80 pointer-events-none"
    /> */}
    </motion.section>
  );
};
