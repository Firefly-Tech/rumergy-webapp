from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rumergy_backend.rumergy import views
from rest_framework.routers import DefaultRouter
from rumergy_backend.rumergy.views.data_log_view import DataLogViewSet
from rumergy_backend.rumergy.views.data_point_view import DataPointViewSet

router = DefaultRouter()
router.register(r"api/users", views.UserViewSet, basename="users")
router.register(r"api/access-request", views.AccessRequestViewSet)
router.register(r"api/buildings", views.BuildingViewSet)
router.register(r"api/data-log-measures", views.DataLogMeasuresViewSet)
router.register(r"api/meter-data", views.MeterDataViewSet)
router.register(r"api/meter-models", views.MeterModelViewSet)
router.register(r"api/meters", views.MeterViewSet)
router.register(r"api/data-points", DataPointViewSet)
router.register(r"api/data-logs", DataLogViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path(
        "api/token/",
        views.RumergyObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path(
        r"api/password_reset/",
        include("django_rest_passwordreset.urls", namespace="password_reset"),
    ),
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
]
