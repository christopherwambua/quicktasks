"""
Root URL configuration.

Routes browser/admin traffic and mounts the tasks API at /api/tasks/.
"""

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    # All task endpoints live under /api/tasks/
    path("api/", include("tasks.urls")),
]
