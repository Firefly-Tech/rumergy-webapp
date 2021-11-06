from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rumergy_backend.rumergy import views
from rest_framework.routers import DefaultRouter
from rumergy_backend.rumergy.views.data_log_view import DataLogViewSet
from rumergy_backend.rumergy.views.data_point_view import DataPointViewSet

router = DefaultRouter()
router.register(r"api/users", views.UserViewSet)
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
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
]
