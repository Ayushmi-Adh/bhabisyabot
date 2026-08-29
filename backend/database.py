# database.py

import os
import sqlite3
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_DB_PATH = os.path.join(BASE_DIR, "data", "bhabisyabot.db")

# Path to the SQLite database.
# On Vercel (serverless), the filesystem resets on cold starts, so set
# DB_PATH=/tmp/bhabisyabot.db to guarantee the file is writable.
DB_PATH = os.getenv("DB_PATH", DEFAULT_DB_PATH)


def get_connection():
    """
    Establish a connection to the SQLite database.
    Creates the database folder and the Users table on first use.
    """
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH, timeout=10)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS Users (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Name TEXT,
            Age INTEGER,
            Education TEXT,
            Hobbies TEXT,
            Essay TEXT
        )
    """)
    conn.commit()
    return conn


def insert_user(name, age, education, hobbies, essay=None):
    """
    Insert a new user into the Users table and return the new user ID.
    """
    conn = get_connection()
    try:
        cursor = conn.execute(
            """
            INSERT INTO Users (Name, Age, Education, Hobbies, Essay)
            VALUES (?, ?, ?, ?, ?)
            """,
            (name, age, education, hobbies, essay),
        )
        conn.commit()
        user_id = cursor.lastrowid
        print(f"✅ User '{name}' inserted successfully! ID: {user_id}")
        return user_id
    except Exception as e:
        print("❌ Failed to insert user:", e)
        return None
    finally:
        conn.close()


def update_user_essay(user_id, essay):
    """
    Update the essay field for a specific user by ID.
    """
    conn = get_connection()
    try:
        cursor = conn.execute(
            "UPDATE Users SET Essay = ? WHERE ID = ?",
            (essay, int(user_id)),
        )
        conn.commit()
        print(f"✅ Essay updated for user ID {user_id}")
        return cursor.rowcount > 0
    except Exception as e:
        print("❌ Failed to update essay:", e)
        return False
    finally:
        conn.close()