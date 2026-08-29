import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./App";
import "./index.css";
import EssayPage from "./pages/EssayPage";
import ChatbotPage from "./pages/ChatbotPage";

function ChabotPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Chatbot Page Coming Soon</h1>
        <p className="text-xl opacity-80">This is where your AI journey begins.</p>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<ChatbotPage />} />
      <Route path="/essay" element={<EssayPage />} />
    </Routes>
  </BrowserRouter>
);

