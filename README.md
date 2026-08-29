
# BhabisyaBot - AI Career Guidance Assistant

A full-stack career guidance web app that chats with users to learn about their interests, analyzes their essays, and recommends the top careers that fit them using machine learning.
<img width="400" height="300" alt="original-3875c9416d79c861a9827a67f38ce4eb" src="https://github.com/user-attachments/assets/957c49c4-341a-4724-8ef3-4d88397b4987" />
## Tech Stack

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Frontend   | React 19, Create React App, Tailwind CSS, tsparticles, React Router |
| Backend    | FastAPI, Uvicorn                                |
| Database   | SQLite (stdlib `sqlite3`)                       |
| ML         | scikit-learn (Random Forest), pandas, joblib    |
| NLP        | spaCy, TextBlob                                 |

## Features

- **Interactive Chatbot** - A guided conversation that collects the user's name, age, education, and hobbies before saving their profile to the database.
- **Essay Analysis** - Users write an essay about their goals; the app analyzes it for word count, keywords, and sentiment (via spaCy and TextBlob).
- **Career Recommendations** - A trained Random Forest model recommends the top 5 suitable careers based on the user's age, education, and hobbies.
- **Animated UI** - Constellation particle background built with tsparticles.

## Project Structure

```
bhabisyabot/
├── backend/                 # FastAPI backend (deployed as a Vercel Function)
│   ├── main.py              # API routes & app setup
│   ├── chatbot_logic.py     # Chatbot conversation flow
│   ├── essay_analysis.py    # Essay NLP analysis
│   ├── recommend.py         # Career recommendation logic
│   ├── train_model.py       # Trains the Random Forest model
│   ├── scraper.py           # Data scraping script
│   ├── database.py          # SQLite connection & queries
│   ├── data/
│   │   └── career_dataset.csv
│   ├── vercel.json          # Vercel function config
│   └── requirements.txt
├── frontend/                # React frontend (deployed as a static site)
│   └── src/
│       ├── pages/           # Chatbot, Essay, Result pages
│       ├── components/      # ChatBubble, TypingBubble, etc.
│       └── api.js           # API base URL config (REACT_APP_API_URL)
└── assets/
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+

### 1. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt

# Download the spaCy model
python -m spacy download en_core_web_sm
```

SQLite needs no server. The database file defaults to `backend/data/bhabisyabot.db` and the `Users` table is created automatically. To use a different path, create a `.env` file in `backend/` (see `.env.example`):

```env
DB_PATH=data/bhabisyabot.db
```

**(Optional)** Retrain the recommendation model:

```bash
python train_model.py
```

Run the API server:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000` (docs at `/docs`).

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The frontend calls the backend at `http://localhost:8000` by default. To point it at a deployed API, set `REACT_APP_API_URL` before building.

## API Endpoints

| Method | Endpoint          | Description                                   |
| ------ | ----------------- | --------------------------------------------- |
| GET    | `/chatbot/start`  | Start the chat (greeting message)             |
| POST   | `/chatbot/respond`| Get the next bot response in the conversation |
| POST   | `/user`           | Save a user profile                          |
| POST   | `/essay`          | Save a user essay                            |
| POST   | `/essay/analyze`  | Analyze essay (sentiment, keywords, length)   |
| POST   | `/recommend`      | Get top 5 career recommendations             |
| GET    | `/`               | API health check                             |

## Deploying to Vercel

Vercel auto-detects FastAPI from `backend/requirements.txt` and React from `frontend/package.json`. Deploy the repo as **two separate projects** (one per subfolder).

### Backend project (API)

1. In the Vercel dashboard, choose **Import Project** and select this repo.
2. Set **Root Directory** to `backend`.
3. Add the environment variable:
   - `DB_PATH` → `/tmp/bhabisyabot.db` (see note below)
4. Deploy. Vercel builds the FastAPI app as a single Function and takes care of the spaCy model download.

### Frontend project (web)

1. Import the repo again.
2. Set **Root Directory** to `frontend`.
3. Add the environment variable:
   - `REACT_APP_API_URL` → `https://<your-backend-project>.vercel.app`
4. Deploy. Vercel builds the React app and serves it as a static site.

> **Note on data persistence:** Vercel Functions have a read-only filesystem except `/tmp`, and `/tmp` is reset on cold starts. With `DB_PATH=/tmp/bhabisyabot.db` the app runs, but stored users/essays may reset when the function idles. For production data, replace `database.py`'s SQLite layer with a hosted database (e.g., Turso/libSQL, Supabase, or Neon).

## License

This project is for educational purposes.
