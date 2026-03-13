import requests

TRELLO_KEY = "YOUR_KEY"
TRELLO_TOKEN = "YOUR_TOKEN"
LIST_ID = "YOUR_LIST_ID"

def create_trello_card(task):

    url = "https://api.trello.com/1/cards"

    description = f"""
Team: {task['team']}
Priority: {task['priority']}
Status: {task['status']}

Description:
{task['description']}
"""

    query = {
        "key": TRELLO_KEY,
        "token": TRELLO_TOKEN,
        "idList": LIST_ID,
        "name": task["title"],
        "desc": description
    }

    response = requests.post(url, params=query)

    return response.json()