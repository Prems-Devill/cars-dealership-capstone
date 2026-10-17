from django.urls import path\nfrom django.views.generic import RedirectView

from . import views

app_name = "djangoapp"

urlpatterns = [
    path("", views.home, name="home"),\n    path("about", RedirectView.as_view(url="/static/About.html", permanent=False), name="about"),\n    path("contact", RedirectView.as_view(url="/static/Contact.html", permanent=False), name="contact"),
    path("dealer/<int:dealer_id>/", views.dealer_page, name="dealer_page"),
    path("dealer/<int:dealer_id>/review/", views.post_review_page, name="post_review_page"),
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
    path("fetchDealers", views.fetch_dealers, name="fetch_dealers"),
    path("fetchDealers/<str:state>", views.fetch_dealers, name="fetch_dealers_by_state"),
    path("get_dealers/", views.fetch_dealers, name="legacy_get_dealers"),
    path("get_dealer/<int:dealer_id>/", views.fetch_dealer, name="legacy_get_dealer"),
    path("get_dealer_reviews/<int:dealer_id>", views.fetch_reviews, name="legacy_get_dealer_reviews"),
    path("fetchDealer/<int:dealer_id>", views.fetch_dealer, name="fetch_dealer"),
    path("fetchReviews", views.fetch_reviews, name="fetch_reviews"),
    path("fetchReviews/dealer/<int:dealer_id>", views.fetch_reviews, name="fetch_dealer_reviews"),
    path("analyze/<path:text>", views.analyze_review, name="analyze_sentiment"),
]
