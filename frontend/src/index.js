import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./App";
import "./index.css";
import EssayPage from "./pages/EssayPage";
import ChatbotPage from "./pages/ChatbotPage";
import ResultPage from "./pages/ResultPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<ChatbotPage />} />
      <Route path="/essay" element={<EssayPage />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  </BrowserRouter>
);

