import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ChatBubble from "../components/ChatBubble";
import TypingBubble from "../components/TypingBubble";
import ConstellationBackground from "../ConstellationBackground";
import "../styles/chatbot.css";

const ChatbotPage = () => {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi, I am BhabisyaBot!" }
    ]);
    const [userInput, setUserInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showEssayPrompt, setShowEssayPrompt] = useState(false);
    const [chatStep, setChatStep] = useState("greeting");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () =>
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    useEffect(scrollToBottom, [messages, isTyping]);

    const sendToBackend = async (text) => {
        setIsTyping(true);
        try {
            const res = await axios.post(
                `http://localhost:8000/chatbot/respond?step=${chatStep}&user_input=${encodeURIComponent(text)}`
            );

            const botReply = res.data.bot || "No reply from server";
            const nextStep = res.data.next_step;
            const userId = res.data.user_id;

            // Append bot reply
            setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);

            // If chatbot reached essay prompt, show OK button and store user info
            if (nextStep === "ask_essay" && userId) {
                // Store userId
                sessionStorage.setItem("userId", userId);

                // Store full user info from backend
                const userData = {
                    name: res.data.name || "",
                    age: res.data.age || "",
                    education: res.data.education || "",
                    hobbies: res.data.hobbies || ""
                };
                sessionStorage.setItem("chatbotUserData", JSON.stringify(userData));

                setShowEssayPrompt(true);
            }

            // Update step for next user input
            if (nextStep) setChatStep(nextStep);

        } catch (err) {
            console.error(err);
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Error connecting to server." }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSend = () => {
        if (!userInput.trim() || showEssayPrompt) return;

        const text = userInput.trim();
        setMessages((prev) => [...prev, { sender: "user", text }]);
        setUserInput("");

        sendToBackend(text);
    };

    const goToEssayPage = () => {
        window.location.href = "/essay";
    };

    return (
        <div className="chatbot-container">
            <ConstellationBackground />

            <div className="glass-chat-panel">
                <h1 className="chatbot-title">BhabisyaBot</h1>

                <div className="messages-box">
                    {messages.map((msg, i) => (
                        <ChatBubble key={i} sender={msg.sender} text={msg.text} />
                    ))}
                    {isTyping && <TypingBubble />}
                    <div ref={messagesEndRef}></div>
                </div>

                {/* Input box for normal conversation */}
                {!showEssayPrompt && (
                    <div className="input-box">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Type your response…"
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                )}

                {/* OK button to redirect to EssayPage */}
                {showEssayPrompt && (
                    <div className="essay-button-area">
                        <button className="ok-button" onClick={goToEssayPage}>
                            OK
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatbotPage;
