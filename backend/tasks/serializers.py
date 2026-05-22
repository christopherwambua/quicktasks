"""
Convert Task model instances to/from JSON for the REST API.

The response shape must match the frontend contract exactly.
"""

from rest_framework import serializers

from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    """
    Serializes Task objects to JSON.

    - id and created_at are read-only (set by the database).
    - title and completed can be sent on POST/PUT.
    """

    # Format created_at like "2026-05-22T10:30:00Z" (UTC, no microseconds)
    created_at = serializers.DateTimeField(
        format="%Y-%m-%dT%H:%M:%SZ",
        read_only=True,
    )

    class Meta:
        model = Task
        fields = ["id", "title", "completed", "created_at"]
        read_only_fields = ["id", "created_at"]
