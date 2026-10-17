import json
import logging

import requests
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from . import restapis

logger = logging.getLogger(__name__)


def _json_body(request):
    try:
        return json.loads(request.body.decode("utf-8") or "{}")
    except (UnicodeDecodeError, json.JSONDecodeError):
        return None


def _proxy_error(exc):
    logger.exception("Dealership API request failed")
    return JsonResponse(
        {"error": "A dependent service is unavailable", "detail": str(exc)},
        status=502,
    )


@csrf_exempt
def login_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST method required"}, status=405)
    data = _json_body(request)
    if data is None:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    username = data.get("userName")
    password = data.get("password")
    if not username or not password:
        return JsonResponse({"error": "userName and password are required"}, status=400)
    user = authenticate(request, username=username, password=password)
    if user is None:
        return JsonResponse({"userName": username}, status=401)
    login(request, user)
    return JsonResponse({"userName": username, "status": "Authenticated"})


@csrf_exempt
def logout_request(request):
    if request.method != "GET":
        return JsonResponse({"error": "GET method required"}, status=405)
    logout(request)
    return JsonResponse({"userName": ""})


@csrf_exempt
def registration(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST method required"}, status=405)
    data = _json_body(request)
    if data is None:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    username = data.get("userName") or data.get("username")
    password = data.get("password")
    email = data.get("email", "")
    first_name = data.get("firstName", "")
    last_name = data.get("lastName", "")
    if not username or not password:
        return JsonResponse({"error": "userName and password are required"}, status=400)
    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Username already exists"}, status=409)
    user = User.objects.create_user(
        username=username, password=password, email=email,
        first_name=first_name, last_name=last_name
    )
    return JsonResponse({"userName": user.username, "status": "Registered"}, status=201)


def fetch_dealers(request, state=None):
    if request.method != "GET":
        return JsonResponse({"error": "GET method required"}, status=405)
    try:
        state = state or request.GET.get("state")
        endpoint = f"fetchDealers/{state}" if state else "fetchDealers"
        return JsonResponse(restapis.get_request(endpoint), safe=False)
    except (requests.RequestException, ValueError) as exc:
        return _proxy_error(exc)


def fetch_dealer(request, dealer_id):
    if request.method != "GET":
        return JsonResponse({"error": "GET method required"}, status=405)
    try:
        return JsonResponse(restapis.get_request(f"fetchDealer/{dealer_id}"))
    except requests.HTTPError as exc:
        status = exc.response.status_code if exc.response is not None else 502
        return JsonResponse({"error": "Dealer not found"}, status=status)
    except (requests.RequestException, ValueError) as exc:
        return _proxy_error(exc)


def fetch_reviews(request, dealer_id=None):
    if request.method != "GET":
        return JsonResponse({"error": "GET method required"}, status=405)
    try:
        endpoint = f"fetchReviews/dealer/{dealer_id}" if dealer_id is not None else "fetchReviews"
        return JsonResponse(restapis.get_request(endpoint), safe=False)
    except (requests.RequestException, ValueError) as exc:
        return _proxy_error(exc)


def get_cars(request):
    if request.method != "GET":
        return JsonResponse({"error": "GET method required"}, status=405)
    try:
        return JsonResponse(restapis.get_request("fetchCarModels"))
    except (requests.RequestException, ValueError) as exc:
        return _proxy_error(exc)


@csrf_exempt
def add_review(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST method required"}, status=405)
    data = _json_body(request)
    if data is None:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    required = ("name", "dealership", "review", "purchase", "purchase_date",
                "car_make", "car_model", "car_year")
    missing = [field for field in required if data.get(field) in (None, "")]
    if missing:
        return JsonResponse({"error": "Missing required fields", "fields": missing}, status=400)
    try:
        return JsonResponse(restapis.post_review(data), status=201)
    except (requests.RequestException, ValueError) as exc:
        return _proxy_error(exc)


def analyze_review(request, text=None):
    if text is None:
        data = _json_body(request)
        if data is None or not data.get("review"):
            return JsonResponse({"error": "review is required"}, status=400)
        text = data["review"]
    try:
        return JsonResponse(restapis.analyze_review_sentiments(text))
    except (requests.RequestException, ValueError) as exc:
        return _proxy_error(exc)
