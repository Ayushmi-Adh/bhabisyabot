# BhabisyaBot - AI Career Guidance Assistant

A full-stack career guidance web app that chats with users to learn about their interests, analyzes their essays, and recommends the top careers that fit them using machine learning.
<img width="400" height="300" alt="original-3875c9416d79c861a9827a67f38ce4eb" src="https://github.com/user-attachments/assets/944fbeaf-1872-40e5-bc42-d5761d1b1546" />


## Tech Stack

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Frontend   | React 19, Create React App, Tailwind CSS, tsparticles, React Router |
| Backend    | FastAPI, Uvicorn                                |
| Database   | SQL Server (Windows Authentication via pyodbc)  |
| ML         | scikit-learn (Random Forest), pandas, joblib    |
| NLP        | spaCy, TextBlob, DistilBERT (transformers)      |

## Features

- **Interactive Chatbot** - A guided conversation that collects the user's name, age, education, and hobbies before saving their profile to the database.
- **Essay Analysis** - Users write an essay about their goals; the app analyzes it for word count, keywords, and sentiment (via spaCy and TextBlob).
- **Career Recommendations** - A trained Random Forest model recommends the top 5 suitable careers based on the user's age, education, and hobbies.
- **Data Scraping** - Includes a web scraper used to build the career dataset.
- **Animated UI** - Constellation particle background built with tsparticles.

## Project Structure

```
bhabisyabot/
├── backend/                 # FastAPI backend
│   ├── main.py              # API routes & app setup
│   ├── chatbot_logic.py     # Chatbot conversation flow
│   ├── essay_analysis.py    # Essay NLP analysis
│   ├── recommend.py         # Career recommendation logic
│   ├── train_model.py       # Trains the Random Forest model
│   ├── scraper.py           # Data scraping script
│   ├── database.py          # SQL Server connection & queries
│   ├── data/
│   │   └── career_dataset.csv
│   └── requirements.txt
├── frontend/                # React frontend
│   └── src/
│       ├── pages/           # Chatbot, Essay, Result pages
│       ├── components/      # ChatBubble, TypingBubble, etc.
│       └── styles/
└── assets/
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- SQL Server (local or remote instance)

### 1. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt

# Download the spaCy model
python -m spacy download en_core_web_sm
```

Create a `.env` file in the `backend/` folder (see `.env.example`):

```env
DB_SERVER=your_server_name
DB_NAME=your_database_name
DB_DRIVER=ODBC Driver 17 for SQL Server
DB_TRUSTED_CONNECTION=yes
```

Make sure the `Users` table exists in your database:

```sql
CREATE TABLE Users (
    ID INT IDENTITY PRIMARY KEY,
    Name NVARCHAR(100),
    Age INT,
    Education NVARCHAR(100),
    Hobbies NVARCHAR(255),
    Essay NVARCHAR(MAX)
);
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

Open [http://localhost:3000](http://localhost:3000) in your browser.

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

## Future Enhancements

- Use a real transformer model (DistilBERT) instead of the lightweight sentiment fallback
- Add user authentication
- Deploy backend and frontend to a cloud platform
- Expand the career dataset with more samples and countries

## License

This project is for educational purposes.
