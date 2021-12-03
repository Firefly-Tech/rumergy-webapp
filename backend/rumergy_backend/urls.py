from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rumergy_backend.rumergy import views
from rest_framework import permissions
from rest_framework.routers import DefaultRouter
from rumergy_backend.rumergy.views.data_log_view import DataLogViewSet
from rumergy_backend.rumergy.views.data_point_view import DataPointViewSet
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
import sys
sys.path.append('/Users/sebmrcd/Desktop/rumergy-webapp/backend/modbus')
from modbus.singleton import SchedulerHandler

scheduler = SchedulerHandler().retrieve_scheduler()

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

schema_view = get_schema_view(
    openapi.Info(
        title="RUMergy API",
        default_version="v1",
        description="API to support RUMergy's operations",
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

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
    path(
        r"api/docs(?P<format>\.json|\.yaml)/",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    path(
        r"api/docs/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
]
