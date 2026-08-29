import React, { useEffect, useState } from "react";
import axios from "axios";
import ConstellationBackground from "../ConstellationBackground";
import "../styles/result.css";
import { useNavigate } from "react-router-dom";

const ResultPage = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null); // from chatbot
    const [essayAnalysis, setEssayAnalysis] = useState(null);
    const [userEssay, setUserEssay] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // 1️⃣ Retrieve user info, essay, and analysis from sessionStorage
        const storedUser = sessionStorage.getItem("chatbotUserData");
        const storedAnalysis = sessionStorage.getItem("essayAnalysis");
        const storedEssay = sessionStorage.getItem("userEssay");

        if (!storedUser || !storedEssay) {
            navigate("/chat"); // redirect to chatbot if data missing
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        setEssayAnalysis(storedAnalysis ? JSON.parse(storedAnalysis) : null);
        setUserEssay(storedEssay);

        // 2️⃣ Fetch career recommendations from backend
        const fetchRecommendations = async () => {
            setLoading(true);
            setError("");

            try {
                const userFeatures = {
                    Age: parsedUser.age,
                    Education: parsedUser.education,
                    Hobbies: parsedUser.hobbies
                };

                const res = await axios.post(
                    "http://localhost:8000/recommend",
                    userFeatures
                );

                if (res.data.status === "success") {
                    setRecommendations(res.data.recommendations);
                } else {
                    setError("Failed to fetch career recommendations.");
                }
            } catch (err) {
                console.error("AxiosError:", err);
                setError("Error connecting to server. Make sure backend is running.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [navigate]);

    const goToRoadmap = (career) => {
        sessionStorage.setItem("selectedCareer", career);
        navigate("/roadmap");
    };

    return (
        <div className="result-page">
            <ConstellationBackground />
            <div className="gradient-overlay"></div>

            <div className="glass-result-panel">
                <h1 className="result-title">Your Career Recommendations</h1>

                {loading && <p>Loading recommendations...</p>}
                {error && <p className="error-message">{error}</p>}

                {!loading && !error && (
                    <>
                        {/* User Info */}
                        <div className="user-info-section">
                            <h2>Your Information</h2>
                            <p><strong>Name:</strong> {userData.name}</p>
                            <p><strong>Age:</strong> {userData.age}</p>
                            <p><strong>Education:</strong> {userData.education}</p>
                            <p><strong>Hobbies:</strong> {userData.hobbies}</p>
                        </div>

                        {/* User Essay */}
                        <div className="user-essay-section">
                            <h2>Your Essay</h2>
                            <p>{userEssay}</p>
                        </div>

                        {/* Essay Analysis */}
                        {essayAnalysis && (
                            <div className="essay-analysis-section">
                                <h2>Essay Analysis</h2>
                                <pre>{JSON.stringify(essayAnalysis, null, 2)}</pre>
                            </div>
                        )}

                        {/* Career Recommendations */}
                        <div className="recommendations-section">
                            <h2>Top 5 Career Suggestions</h2>
                            <ul>
                                {recommendations.map((career, idx) => (
                                    <li key={idx} className="career-item">
                                        {career}{" "}
                                        <button
                                            className="roadmap-button"
                                            onClick={() => goToRoadmap(career)}
                                        >
                                            View Roadmap
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResultPage;
