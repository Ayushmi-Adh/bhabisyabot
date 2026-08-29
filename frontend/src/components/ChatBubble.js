import React from "react";
import botIcon from "../assets/bot.png"; // you can use any small round icon

export default function ChatBubble({ sender, text }) {
    return (
        <div className={`bubble-row ${sender}-row`}>

            {/* Avatar for bot only */}
            {sender === "bot" && (
                <img src={botIcon} alt="bot" className="bot-avatar" />
            )}

            <div
                className={`chat-bubble ${sender === "bot" ? "bot-bubble" : "user-bubble"}`}
            >
                {text}
            </div>
        </div>
    );
}
