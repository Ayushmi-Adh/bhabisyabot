import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "career_dataset.csv")
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")

# Load dataset
data = pd.read_csv(DATA_PATH)

TARGET_COL = "TargetCareer"

X = data.drop(columns=[TARGET_COL])
y = data[TARGET_COL]

# Encode categorical features
encoders = {}
for col in X.select_dtypes(include='object').columns:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    encoders[col] = le

# Encode target
target_encoder = LabelEncoder()
y = target_encoder.fit_transform(y)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save everything in one dict
joblib.dump({
    "model": model,
    "encoders": encoders,
    "target_encoder": target_encoder
}, MODEL_PATH)

print("✅ Model trained and saved successfully!")
