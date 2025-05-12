from django.db import models
from datetime import datetime

class User(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('others', 'Others'),
    ]

    user_id = models.CharField(max_length=255, unique=True, primary_key=True)
    username = models.CharField(max_length=255)
    email_id = models.EmailField(max_length=255, unique=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    password = models.CharField(max_length=255)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.TextField( blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(default=datetime.now)
    friends_id = models.JSONField(blank=True, null=True)
    request_received_id = models.JSONField(blank=True, null=True)
    request_sent_id = models.JSONField(blank=True, null=True)
  
    class Meta:
        db_table = 'users'
    def __str__(self):
        return self.username

from django.db import models
from django.utils import timezone
import uuid
from .models import User  # Ensure this is correct based on your project's structure

class Posts(models.Model):
    post_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    image_url = models.URLField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    edited_at = models.DateTimeField(auto_now=True)
    category = models.CharField(max_length=255, blank=True, null=True)
    tag_user_id = models.JSONField(blank=True, null=True)
    like_user_id = models.JSONField(default=list, blank=True)
    class Meta:
        db_table = 'posts'
    # def __str__(self):
        # return f"Post by {self.user.username} - {self.post_id}"