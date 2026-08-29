# recommend.py
import os
import joblib
import pandas as pd
from sklearn.preprocessing import LabelEncoder

# ----------------------------
# Paths
# ----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")

# ----------------------------
# Load trained model and encoders
# ----------------------------
model_data = joblib.load(MODEL_PATH)
model = model_data["model"]
# LabelEncoders for categorical features
encoders = model_data["encoders"]
target_encoder = model_data["target_encoder"]
all_hobbies = model_data.get("hobbies", [])  # list of all hobbies

# ----------------------------
# Recommendation function
# ----------------------------


def get_recommendations(user_features: dict, top_n: int = 5):
    """
    user_features: dict containing keys "Age", "Education", "Hobbies" (semicolon-separated)
        Example: {"Age": 20, "Education": "Bachelor", "Hobbies": "coding;reading"}
    top_n: number of top career recommendations
    """
    # 1️⃣ Create dataframe
    df = pd.DataFrame([user_features])

    # 2️⃣ One-hot encode hobbies
    for hobby in all_hobbies:
        df[f"Hobby_{hobby}"] = 0

    if "Hobbies" in df.columns and pd.notna(df.loc[0, "Hobbies"]):
        user_hobbies = df.loc[0, "Hobbies"].lower().split(";")
        for hobby in user_hobbies:
            col_name = f"Hobby_{hobby}"
            if col_name in df.columns:
                df.loc[0, col_name] = 1

    # Drop original Hobbies column
    if "Hobbies" in df.columns:
        df = df.drop(columns=["Hobbies"])

    # 3️⃣ Encode categorical features
    for col, le in encoders.items():
        if col in df.columns:
            if df.loc[0, col] in le.classes_:
                df[col] = le.transform([df.loc[0, col]])[0]
            else:
                df[col] = 0  # fallback for unseen category
        else:
            df[col] = 0

    # 4️⃣ Predict probabilities
    probs = model.predict_proba(df)[0]

    # 5️⃣ Get top N recommendations
    top_indices = probs.argsort()[-top_n:][::-1]
    recommended_careers = target_encoder.inverse_transform(top_indices)

    return recommended_careers.tolist()
