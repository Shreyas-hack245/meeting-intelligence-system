from fastapi import APIRouter
from trello_integration.trello_client import create_trello_card

router = APIRouter()

@router.post("/push-to-trello")
def push_to_trello(data: dict):

    tasks = data["tasks"]

    results = []

    for task in tasks:
        card = create_trello_card(task)
        results.append(card)

    return {"cards_created": results}