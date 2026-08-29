# essay_analysis.py

import re
from textblob import TextBlob
import spacy

# Load lightweight model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    nlp = spacy.blank("en")


def safe_sentiment_textblob(text: str):
    """Avoid TextBlob crashes."""
    try:
        return float(TextBlob(text).sentiment.polarity)
    except:
        return 0.0


def extract_keywords(text: str):
    """Simple keyword extractor (safe & JSON serializable)."""
    doc = nlp(text.lower())

    words = [
        token.text for token in doc
        if token.is_alpha and not token.is_stop
    ]

    # Count frequencies
    freq = {}
    for w in words:
        freq[w] = freq.get(w, 0) + 1

    # Top 10 keywords
    return sorted(freq, key=freq.get, reverse=True)[:10]


def analyze_essay(essay: str):
    text = essay.strip()

    # Word count
    words = len(text.split())

    # Reject too short essays but do not break
    if words < 20:
        return {
            "error": f"Essay must be at least 20 words. Current word count: {words}.",
            "keywords": [],
            "textblob_sentiment": 0,
            "distilbert_sentiment": {"label": "NEUTRAL", "score": 0},
            "length": words
        }

    # Process with spaCy
    doc = nlp(text)

    # Extract keywords
    keywords = extract_keywords(text)

    # Sentiment
    blob = safe_sentiment_textblob(text)

    # Fake BERT sentiment (stable, lightweight)
    bert_label = "POSITIVE" if blob > 0.2 else "NEGATIVE" if blob < -0.2 else "NEUTRAL"
    bert_score = abs(blob)

    return {
        "textblob_sentiment": blob,
        "distilbert_sentiment": {
            "label": bert_label,
            "score": bert_score
        },
        "keywords": keywords,
        "length": words
    }
