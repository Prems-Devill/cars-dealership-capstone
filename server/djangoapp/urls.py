from django.urls import path

from . import views

app_name = "djangoapp"

urlpatterns = [
    path("login", views.login_user, name="login"),
    path("login/", views.login_user, name="login_slash"),
    path("logout", views.logout_request, name="logout"),
    path("logout/", views.logout_request, name="logout_slash"),
    path("register", views.registration, name="register"),
    path("register/", views.registration, name="register_slash"),
    path("get_cars/", views.get_cars, name="get_cars"),
    path("get_cars", views.get_cars, name="get_cars_no_slash"),
    path("analyze_review/", views.analyze_review, name="analyze_review"),
    path("add_review", views.add_review, name="add_review"),
    path("add_review/", views.add_review, name="add_review_slash"),
    path("fetchDealers", views.fetch_dealers, name="fetch_dealers"),\n    path("fetchDealers/<str:state>", views.fetch_dealers, name="fetch_dealers_by_state"),\n    path("get_dealers/", views.fetch_dealers, name="legacy_get_dealers"),\n    path("get_dealer/<int:dealer_id>/", views.fetch_dealer, name="legacy_get_dealer"),\n    path("get_dealer_reviews/<int:dealer_id>", views.fetch_reviews, name="legacy_get_dealer_reviews"),
    path("fetchDealer/<int:dealer_id>", views.fetch_dealer, name="fetch_dealer"),
    path("fetchReviews", views.fetch_reviews, name="fetch_reviews"),
    path("fetchReviews/dealer/<int:dealer_id>", views.fetch_reviews, name="fetch_dealer_reviews"),
    path("analyze/<path:text>", views.analyze_review, name="analyze_sentiment"),
]
