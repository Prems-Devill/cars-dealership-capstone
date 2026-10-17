import os
from urllib.parse import quote

import requests

backend_url = os.getenv("backend_url", "http://127.0.0.1:3030").rstrip("/")
sentiment_analyzer_url = os.getenv(
    "sentiment_analyzer_url", "http://127.0.0.1:5050"
).rstrip("/")
REQUEST_TIMEOUT = float(os.getenv("REQUEST_TIMEOUT", "8"))


def get_request(endpoint, **kwargs):
    """GET JSON data from the dealership data API."""
    url = f"{backend_url}/{endpoint.lstrip('/')}"
    response = requests.get(url, params=kwargs or None, timeout=REQUEST_TIMEOUT)
    response.raise_for_status()
    return response.json()


def analyze_review_sentiments(text):
    """Call the sentiment service using its documented GET endpoint."""
    url = f"{sentiment_analyzer_url}/analyze/{quote(str(text), safe='')}"
    response = requests.get(url, timeout=REQUEST_TIMEOUT)
    response.raise_for_status()
    return response.json()


def post_review(data_dict):
    """Persist a review through the dealership data API."""
    url = f"{backend_url}/insert_review"
    response = requests.post(url, json=data_dict, timeout=REQUEST_TIMEOUT)
    response.raise_for_status()
    return response.json()
