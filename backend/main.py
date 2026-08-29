from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from chatbot_logic import get_chat_response
from database import get_connection, insert_user, update_user_essay
from recommend import get_recommendations
from essay_analysis import analyze_essay

# ---------------------------
# App setup
# ---------------------------
app = FastAPI(title="BhabisyaBot API")

# Allow frontend (React) to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins during dev; restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Startup event: DB connection check
# ---------------------------


@app.on_event("startup")
def check_db_connection():
    conn = get_connection()
    if conn:
        print("✅ Connected to SQL Server successfully!")
        conn.close()
    else:
        print("❌ Failed to connect to SQL Server.")

# ---------------------------
# Pydantic models
# ---------------------------


class UserCreate(BaseModel):
    name: str
    age: int
    education: str
    hobbies: str


class EssaySubmit(BaseModel):
    user_id: int
    essay: str


class RecommendRequest(BaseModel):
    Age: int | None = None
    Education: str | None = None
    Hobbies: str | None = None


class EssayAnalysisRequest(BaseModel):
    user_id: int
    essay: str

# ---------------------------
# Chatbot endpoints
# ---------------------------


@app.get("/chatbot/start")
def start_chat():
    response = get_chat_response("greeting")
    return JSONResponse(content=response)


@app.post("/chatbot/respond")
async def chatbot_respond(step: str, user_input: str | None = None):
    response = get_chat_response(step, user_input)
    return JSONResponse(content=response)

# ---------------------------
# User + Essay endpoints
# ---------------------------


@app.post("/user")
async def create_user(user: UserCreate):
    success = insert_user(user.name, user.age, user.education, user.hobbies)
    if success:
        return {"message": "User saved successfully"}
    raise HTTPException(status_code=500, detail="Failed to save user")


@app.post("/essay")
async def submit_essay(essay: EssaySubmit):
    success = update_user_essay(essay.user_id, essay.essay)
    if success:
        return {"message": "Essay saved successfully"}
    raise HTTPException(status_code=500, detail="Failed to save essay")

# ---------------------------
# Essay analysis endpoint (updated)
# ---------------------------


@app.post("/essay/analyze")
async def analyze_user_essay(request: EssayAnalysisRequest):
    """
    Saves essay in DB and analyzes essay text using spaCy, TextBlob, and DistilBERT.
    Returns sentiment, keywords, and word count.
    """
    if not request.essay.strip():
        raise HTTPException(status_code=400, detail="Essay text is required")

    # Save essay in database first
    saved = update_user_essay(request.user_id, request.essay)
    if not saved:
        raise HTTPException(
            status_code=500, detail="Failed to save essay to DB")

    try:
        analysis = analyze_essay(request.essay)
        return {"status": "success", "analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------------------
# Career recommendation endpoint
# ---------------------------


@app.post("/recommend")
async def recommend_careers(request: RecommendRequest):
    """
    Recommend top 5 careers using trained Random Forest model
    based on user's education, hobbies, and age.
    """
    user_features = {
        "Age": request.Age,
        "Education": request.Education or "",
        "Hobbies": request.Hobbies or ""
    }

    try:
        recommendations = get_recommendations(user_features, top_n=5)
        return {"status": "success", "recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------------------
# Root
# ---------------------------


@app.get("/")
def home():
    return {"message": "🌱 BhabisyaBot API is running!"}
