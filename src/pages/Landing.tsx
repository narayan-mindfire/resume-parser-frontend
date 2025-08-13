import { motion } from "framer-motion";
import { HeroSection } from "../components/utils/HeroSection";
import { Helmet } from "@dr.pogodin/react-helmet";
import { useMemo } from "react";

/**
 * Landing page with hero section and features for Resume Parser Platform.
 */
const Landing = () => {
  const features = useMemo(
    () => [
      {
        title: "Automated Resume Parsing",
        desc: "Extract candidate details like skills, experience, and education from PDF, DOCX, or image resumes instantly.",
      },
      {
        title: "Smart Role Matching",
        desc: "Match resumes to predefined job roles using AI-powered keyword scoring.",
      },
      {
        title: "Insightful Analytics",
        desc: "Visualize top skills, average experience, and other hiring trends in an interactive dashboard.",
      },
    ],
    [],
  );

  return (
    <main className="bg-[var(--background)] text-[var(--text)] transition-colors min-h-[90vh] duration-300">
      <Helmet>
        <title>Home | Resume Parser & Insights</title>
        <meta
          name="description"
          content="Parse, analyze, and gain insights from resumes with our AI-powered resume intelligence platform."
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Home | Resume Parser & Insights" />
        <meta
          property="og:description"
          content="Upload resumes, get instant parsing, match candidates to roles, and view rich analytics."
        />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Resume Parser & Insights" />
        <meta property="twitter:card" content="summary_large_image" />
      </Helmet>

      <HeroSection />

      <section className="py-16 px-4 sm:px-6 bg-[var(--primary)] text-[var(--text)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {features.map(({ title, desc }) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              key={title}
              className="bg-[var(--background)] p-5 sm:p-6 rounded-2xl shadow-xl transition-all"
            >
              <h3 className="text-lg sm:text-xl text-center font-semibold mb-2">
                {title}
              </h3>
              <p className="text-sm sm:text-base text-center text-[var(--muted)]">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Landing;
