from rest_framework import serializers
from .models import User
from .models import Posts

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'username', 'email_id', 'gender', 'bio', 'profile_picture']  # Excluded 'password' for security

class postSerializer(serializers.ModelSerializer):
    class Meta:
        model= Posts
        fields=['post_id','user_id','content','image_url','created_at','edited_at','category','tag_user_id','like_user_id']


class searchSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'username', 'profile_picture']  # Excluded 'password' for security
class loginSerializer:
    class Meta :
        model =User,
        fields = ['user_id', 'username', 'email_id', 'gender', 'bio', 'profile_picture','password','friends_id','request_received_id','request_sent_id']

class adminSerializer(serializers.ModelSerializer):
    class Meta :
        model =User
        fields = ['user_id', 'username', 'email_id', 'gender', 'bio', 'profile_picture','friends_id','request_received_id','request_sent_id']

    def get_request_sent_count(self, obj):
        # Replace this with actual logic to get the length of request_sent_id
        return len(obj.request_sent_id) if obj.request_sent_id else 0

    def get_request_received_count(self, obj):
        # Replace this with actual logic to get the length of request_received_id
        return len(obj.request_received_id) if obj.request_received_id else 0

    def get_friends_count(self, obj):
        # Replace this with actual logic to get the length of friends_id
        return len(obj.friends_id) if obj.friends_id else 0    
