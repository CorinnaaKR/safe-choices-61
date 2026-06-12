import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { MotionConfig } from "framer-motion";
import WelcomePage from "./pages/WelcomePage";
import NotFound from "./pages/NotFound";
import { LoadingCounter } from "./components/LoadingSequence";

// Lazy-load the 3D-heavy pages so the welcome screen doesn't pay for three.js
const StoryPage = lazy(() => import("./pages/StoryPage"));
const ResultsPage = lazy(() => import("./pages/ResultsPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MotionConfig reducedMotion="user">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* Film grain over everything; hidden under prefers-reduced-motion */}
        <div className="film-grain" aria-hidden="true" />
        <BrowserRouter>
          <Suspense fallback={<LoadingCounter />}>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/story/:scenarioId?" element={<StoryPage />} />
              <Route path="/results" element={<ResultsPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </MotionConfig>
  </QueryClientProvider>
);

export default App;
