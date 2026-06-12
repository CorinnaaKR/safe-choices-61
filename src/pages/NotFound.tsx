import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <p className="hud-label text-primary mb-4">Error</p>
        <h1 className="font-mono text-6xl font-bold text-foreground mb-4">404</h1>
        <p className="mb-8 text-muted-foreground">This page does not exist.</p>
        <a
          href="/"
          className="font-mono text-xs uppercase tracking-[0.2em] text-foreground underline decoration-primary underline-offset-4 hover:text-primary transition-colors"
        >
          Return home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
