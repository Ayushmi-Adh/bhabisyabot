# database.py

import pyodbc
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

DB_SERVER = os.getenv("DB_SERVER")
DB_NAME = os.getenv("DB_NAME")
DB_DRIVER = os.getenv("DB_DRIVER", "ODBC Driver 17 for SQL Server")

# Connection string using Windows Authentication
connection_string = f"""
    DRIVER={{{DB_DRIVER}}};
    SERVER={DB_SERVER};
    DATABASE={DB_NAME};
    Trusted_Connection=yes;
    TrustServerCertificate=yes;
"""


def get_connection():
    """
    Establish connection to SQL Server using Windows Authentication.
    Returns a pyodbc connection object.
    """
    try:
        conn = pyodbc.connect(connection_string)
        print("✅ Connected to SQL Server successfully!")
        return conn
    except Exception as e:
        print("❌ Database connection failed:", e)
        return None


def insert_user(name, age, education, hobbies, essay=None):
    """
    Insert a new user into the Users table and return the new user ID.
    """
    conn = get_connection()
    if not conn:
        print("❌ No DB connection. Cannot insert user.")
        return None

    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Users (Name, Age, Education, Hobbies, Essay)
            OUTPUT INSERTED.ID
            VALUES (?, ?, ?, ?, ?)
        """, (name, age, education, hobbies, essay))
        user_id = cursor.fetchone()[0]  # Get the inserted user ID
        conn.commit()
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
    if not conn:
        print("❌ No DB connection. Cannot update essay.")
        return False

    try:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE Users
            SET Essay = ?
            WHERE ID = ?
        """, (essay, int(user_id)))
        conn.commit()
        print(f"✅ Essay updated for user ID {user_id}")
        return True
    except Exception as e:
        print("❌ Failed to update essay:", e)
        return False
    finally:
        conn.close()
