import requests
import os

# Get API key from environment variable
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")

def analyze_with_llm(transcript):

    # Prompt sent to Sarvam LLM
    prompt = f"""
You are an AI assistant that analyzes engineering meetings.

Transcript:
{transcript}

Extract the following information:

1. Meeting summary
2. Key discussion points
3. Engineering decisions
4. Actionable tasks

Return the response in JSON format like this:

{{
  "meeting_summary": "",
  "discussion_points": [],
  "decisions": [],
  "tasks": [
    {{
      "title": "",
      "description": "",
      "team": "",
      "priority": "",
      "status": "Pending"
    }}
  ]
}}
"""

    url = "https://api.sarvam.ai/llm"

    headers = {
        "Authorization": f"Bearer {SARVAM_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "prompt": prompt
    }

    response = requests.post(url, headers=headers, json=data)

    # Check if request succeeded
    if response.status_code == 200:
        return response.json()
    else:
        return {
            "error": "Sarvam API request failed",
            "status_code": response.status_code,
            "details": response.text
        }