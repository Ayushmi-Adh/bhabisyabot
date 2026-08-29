# backend/scraper.py

import requests
from bs4 import BeautifulSoup


def get_jobs(career_name):
    # Placeholder scraping logic
    jobs = []
    try:
        url = f"https://www.merojob.com/search/?q={career_name.replace(' ', '+')}"
        res = requests.get(url)
        soup = BeautifulSoup(res.text, "html.parser")
        for job in soup.select(".job-title"):
            jobs.append(job.text.strip())
    except:
        jobs = ["No jobs found (demo)"]
    return jobs


def get_colleges(career_name):
    # Placeholder scraping logic
    colleges = []
    try:
        url = f"https://www.example-colleges.com/search?course={career_name.replace(' ', '+')}"
        res = requests.get(url)
        soup = BeautifulSoup(res.text, "html.parser")
        for col in soup.select(".college-name"):
            colleges.append(col.text.strip())
    except:
        colleges = ["No colleges found (demo)"]
    return colleges
