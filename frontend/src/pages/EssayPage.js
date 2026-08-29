import React, { useState } from "react";
import axios from "axios";
import API_BASE from "../api";
import ConstellationBackground from "../ConstellationBackground";
import "../styles/essay.css";
import { useNavigate } from "react-router-dom";

const EssayPage = () => {
    const [essay, setEssay] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Get userId from sessionStorage to ensure user completed chatbot
    const userId = sessionStorage.getItem("userId");

    const handleAnalyze = async () => {
        setError("");
        const userId = sessionStorage.getItem("userId");

        // 1️⃣ Ensure user is identified
        if (!userId) {
            setError("User not identified. Please go back to chatbot.");
            return;
        }

        // 2️⃣ Ensure essay is not empty
        if (!essay.trim()) {
            setError("Essay cannot be empty.");
            return;
        }

        // 3️⃣ Ensure essay is at least 100 words
        const wordCount = essay.trim().split(/\s+/).length;
        if (wordCount < 100) {
            setError(`Essay must be at least 100 words. Current: ${wordCount}`);
            return;
        }

        setLoading(true);

        try {
            // 4️⃣ Send essay + user_id to backend for saving and analysis
            const res = await axios.post(`${API_BASE}/essay/analyze`, {
                user_id: parseInt(userId),
                essay: essay
            });

            if (res.data.status === "success") {
                const analysis = res.data.analysis;

                // Store essay and analysis in sessionStorage
                sessionStorage.setItem("userEssay", essay);
                sessionStorage.setItem("essayAnalysis", JSON.stringify(analysis));

                // Redirect to result page
                navigate("/result");
            } else {
                setError("Failed to analyze essay.");
            }
        } catch (err) {
            console.error("AxiosError", err);
            setError("Error connecting to server. Make sure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="essay-page">
            <ConstellationBackground />
            <div className="gradient-overlay"></div>

            <div className="glass-essay-panel">
                <h1 className="essay-title">Write an essay about yourself</h1>

                <textarea
                    value={essay}
                    onChange={(e) => setEssay(e.target.value)}
                    placeholder="Write at least 100 words..."
                    rows={12}
                />

                {error && <p className="error-message">{error}</p>}

                <button
                    className="analyze-button"
                    onClick={handleAnalyze}
                    disabled={loading}
                >
                    {loading ? "Analyzing..." : "Analyze"}
                </button>
            </div>
        </div>
    );
};

export default EssayPage;
