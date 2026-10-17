# Cars Dealership Capstone Project

## Project details
- Repository: `cars-dealership-capstone`
- Project: `Cars Dealership`

This repository contains the Cars Dealership capstone work, including the Django API, dealership data API, sentiment service, and static/frontend components.

## Run locally with Docker Compose

Requirements: Docker Desktop with Docker Compose enabled.

```bash
docker compose up --build
```

Services:
- Django API: http://127.0.0.1:8000
- Dealership data API: http://127.0.0.1:3030
- Sentiment API: http://127.0.0.1:5050

Stop the services with `Ctrl+C`; remove the containers with `docker compose down`.

## Key endpoints

Django authentication and app routes:
- `POST /djangoapp/login` — accepts JSON fields `userName` and `password`
- `GET /djangoapp/logout` — clears the session and returns an empty `userName`
- `POST /djangoapp/register` — creates a user
- `GET /djangoapp/get_cars/` — returns a `CarModels` array
- `POST /djangoapp/add_review` — submits a review with purchase and car details
- `GET /analyze/<review text>` — returns sentiment

Dealership data API:
- `GET /fetchDealers` — all dealers
- `GET /fetchDealers/<state>` — dealers filtered by state name or abbreviation
- `GET /fetchDealer/<id>` — one dealer
- `GET /fetchReviews/dealer/<id>` — reviews including purchase/car details
- `GET /fetchCarModels` — distinct car make/model pairs
- `POST /insert_review` — persist a review

## Admin screenshot preparation

After the web container is running, create the required Django admin user interactively (the password is entered locally and is not stored in Git):

```bash
docker compose exec web python manage.py createsuperuser --username root --email root@example.com
```

Then open `/admin/`, sign in as `root`, and capture the login screenshot. For the logout screenshot, use the admin site's **Log out** action and capture the resulting page. Do not use a fabricated screenshot.

## Configuration

For non-Docker runs, set these environment variables if services are not on localhost:
- `backend_url` (default `http://127.0.0.1:3030`)
- `sentiment_analyzer_url` (default `http://127.0.0.1:5050`)
- `DJANGO_SECRET_KEY`
- `DJANGO_ALLOWED_HOSTS`

Never commit real passwords, access tokens, or secret keys.

## CI

The GitHub Actions workflow at `.github/workflows/lint.yml` runs Python lint/compile checks and JavaScript lint/syntax checks on pushes and pull requests.
