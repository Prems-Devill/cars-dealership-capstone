from django.contrib import admin
from django.urls import include, path
from djangoapp.views import home

urlpatterns = [
    path("admin/", admin.site.urls),
    # Keep the rubric's root-level service URLs available.
    path("", include("djangoapp.urls")),
    # Preserve the course's Django application URL prefix.
    path("djangoapp/", include("djangoapp.urls")),
    path("", home, name="home"),
]
