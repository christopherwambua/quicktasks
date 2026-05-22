"""
Database model for a single task.

Fields match the API contract: id, title, completed, created_at.
"""

from django.db import models


class Task(models.Model):
    """A todo item stored in SQLite."""

    title = models.CharField(max_length=255)
    # New tasks are not completed until the client marks them done
    completed = models.BooleanField(default=False)
    # Set automatically when the row is first saved
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
