from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rumergy_backend.rumergy import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"api/users", views.UserViewSet)
router.register(r"api/access-request", views.AccessRequestViewSet)
router.register(r"api/building", views.BuildingViewSet)
router.register(r"api/data-log-measures", views.DataLogMeasuresViewSet)
router.register(r"api/meter-data", views.MeterDataViewSet)
router.register(r"api/meter-model", views.MeterModelViewSet)
router.register(r"api/meter", views.MeterViewSet)
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
