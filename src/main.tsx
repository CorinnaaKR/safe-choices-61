import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@fontsource-variable/archivo";
import "@fontsource-variable/jetbrains-mono";

createRoot(document.getElementById("root")!).render(<App />);
