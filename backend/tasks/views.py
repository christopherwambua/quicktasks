"""
API views for tasks.

ModelViewSet provides the five endpoints required by the contract:
  GET    /api/tasks/       -> list all tasks
  POST   /api/tasks/       -> create a task
  GET    /api/tasks/{id}/  -> retrieve one task
  PUT    /api/tasks/{id}/  -> update a task
  DELETE /api/tasks/{id}/  -> delete a task
"""

from rest_framework import viewsets

from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for tasks.

    DRF maps HTTP methods to actions automatically and returns
    appropriate status codes (200, 201, 204, 404, etc.).
    """

    queryset = Task.objects.all()
    serializer_class = TaskSerializer
