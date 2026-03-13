import requests

SARVAM_API_KEY = "YOUR_API_KEY"

def convert_audio_to_text(file):

    url = "https://api.sarvam.ai/speech-to-text"

    headers = {
        "Authorization": f"Bearer {SARVAM_API_KEY}"
    }

    files = {
        "file": file.file
    }

    response = requests.post(url, headers=headers, files=files)

    return response.json()["transcript"]