from django.contrib import admin
from django.urls import path, include
from rumergy_backend.rumergy.views.data_log_view import DataLogViewSet
from rumergy_backend.rumergy.views.data_points_view import DataPointViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"api/data_points", DataPointViewSet)
router.register(r"api/data_logs", DataLogViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
]
