"""
URL routes for the tasks API.

The router registers list and detail URLs under /api/tasks/.
"""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import TaskViewSet

# DefaultRouter creates RESTful URLs with trailing slashes (Django convention)
router = DefaultRouter()
router.register(r"tasks", TaskViewSet, basename="task")

urlpatterns = [
    path("", include(router.urls)),
]
