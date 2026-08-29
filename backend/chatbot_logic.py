# chatbot_logic.py

from database import insert_user  # insert_user should return the inserted user ID

# In-memory temporary storage (optional; can replace with DB)
user_data = {}


def get_chat_response(step: str, user_input: str | None = None):
    """
    Handles chatbot conversation flow and decision-making logic.
    """

    # 1️⃣ Start conversation
    if step == "greeting":
        return {
            "bot": "Hello! 👋 I’m BhabisyaBot — your career guidance assistant. What’s your name, explorer?",
            "next_step": "ask_name"
        }

    # 2️⃣ Ask name
    elif step == "ask_name":
        user_data["name"] = user_input
        return {
            "bot": f"Nice to meet you, {user_input}! 😊 How old are you?",
            "next_step": "ask_age"
        }

    # 3️⃣ Ask age
    elif step == "ask_age":
        try:
            user_data["age"] = int(user_input)
        except ValueError:
            return {"bot": "Please enter a valid number for your age.", "next_step": "ask_age"}

        return {
            "bot": "Got it! What’s your highest level of education?",
            "next_step": "ask_education"
        }

    # 4️⃣ Ask education
    elif step == "ask_education":
        user_data["education"] = user_input
        return {
            "bot": "Interesting! What are some of your hobbies or things you enjoy doing?",
            "next_step": "ask_hobbies"
        }

    # 5️⃣ Ask hobbies and save user
    elif step == "ask_hobbies":
        user_data["hobbies"] = user_input

        # Save user data to database and get inserted user_id
        user_id = insert_user(
            user_data["name"],
            user_data["age"],
            user_data["education"],
            user_data["hobbies"]
        )

        if user_id:
            user_data["id"] = user_id  # store for frontend
            return {
                "bot": "Thanks! I’ve saved your details. Now, click OK to write your full essay about your goals or interests.",
                "next_step": "ask_essay",
                "user_id": user_id
            }
        else:
            return {
                "bot": "Oops 😢 I couldn’t save your info to the database. Please check your backend connection.",
                "next_step": "ask_name"
            }

    # 6️⃣ Essay step — guide user to EssayPage
    elif step == "ask_essay":
        return {
            "bot": "Please proceed to write your essay on the next page.",
            "next_step": "essay_page"
        }

    # 7️⃣ End conversation
    elif step == "end":
        return {"bot": "That’s all from me! 🎓 Good luck with your future — you’re on the right path!"}

    # Default fallback
    else:
        return {"bot": "I’m not sure what you mean. Let’s start over?", "next_step": "greeting"}
