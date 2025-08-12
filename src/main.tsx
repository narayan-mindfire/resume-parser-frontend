import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeProvider.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";
import { HelmetProvider } from "@dr.pogodin/react-helmet";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>,
);
