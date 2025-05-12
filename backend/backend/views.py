from django.http import JsonResponse
from .models import User
from django.http import HttpResponse
from django.contrib.auth.hashers import check_password
from .models import Posts
from django.views.decorators.csrf import csrf_exempt
from .serializers import UserSerializer
from .serializers import postSerializer
from .serializers import searchSerializer
from .serializers import loginSerializer
from .serializers import adminSerializer
import bcrypt;
from django.contrib.auth.hashers import make_password
import json
from django.core.exceptions import ValidationError
from rest_framework.decorators import api_view
from django.middleware.csrf import get_token
from django.db.models import Q


@api_view(['POST', 'GET'])
@csrf_exempt
def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})

@csrf_exempt
def user_post_list(request):
    user_id = request.GET.get('user_id', None)
    
    if not user_id:
        return JsonResponse({'error': 'user_id is required'}, status=400)
    
    posts = Posts.objects.filter(user_id=user_id)
    serializer = postSerializer(posts, many=True)
    
    if serializer.data:  # Check if the serializer data is not empty
        response_data = {
            'Message': 'Posts fetched successfully',
            'Success': True,
            'data': serializer.data
        }
    else:
        response_data = {
            'Message': 'Posts not found',
            'Success': False,
            'data': []
        }

    return JsonResponse(response_data, safe=False)
@csrf_exempt
def feed_post_list(request):
    posts = Posts.objects.order_by('?')[:10]
    # posts = Posts.objects.all()

    serializer = postSerializer(posts, many=True)
    
    if serializer.data:  # Check if the serializer data is not empty
        response_data = {
            'Message': 'Posts fetched successfully',
            'Success': True,
            'data': serializer.data
        }
    else:
        response_data = {
            'Message': 'Posts not found',
            'Success': False,
            'data': []
        }

    return JsonResponse(response_data, safe=False)
@csrf_exempt
def user_list(request):

    users = User.objects.order_by('?')[:7]
    serializer = searchSerializer(users, many=True)
    
    if serializer.data:  
        response_data = {
            'Message': 'users fetched successfully',
            'Success': True,
            'data': serializer.data
        }
    else:
        response_data = {
            'Message': 'users not found',
            'Success': False,
            'data': []
        }

    return JsonResponse(response_data, safe=False)
@csrf_exempt
def search_user(request):
    search = request.GET.get('search', '')
    users = User.objects.filter(Q(user_id__icontains=search) | Q(username__icontains=search)).order_by('?')[:10]
    serializer = searchSerializer(users, many=True)
    
    if serializer.data:  
        response_data = {
            'Message': 'users Searched successfully',
            'Success': True,
            'data': serializer.data
        }
    else:
        response_data = {
            'Message': 'Cannot Search',
            'Success': False,
            'data': []
        }

    return JsonResponse(response_data, safe=False)


@csrf_exempt
def login(request):
    if request.method != 'POST':
        return JsonResponse({"message": "Invalid request method", "user_id": None}, status=405)

    try:
        data = json.loads(request.body)
        user_id = data.get('user_id')
        user_pass = data.get('password')
    except json.JSONDecodeError:
        return JsonResponse({"message": "Invalid JSON", "user_id": None, "Success": False}, status=400)

    if not user_id or not user_pass:
        return JsonResponse({"message": "Invalid input", "user_id": None, "Success": False}, status=400)

    try:
        user = User.objects.get(user_id=user_id)
    except User.DoesNotExist:
        return JsonResponse({"message": "User does not exist", "user_id": None, "Success": False}, status=404)

    if check_password(user_pass, user.password):
        # Successful login
        response = JsonResponse({
            'message': 'Login successful',
            'user_id': user.user_id,
            "Success": True
        })
      
        response.set_cookie(
            'user_data',
            user.user_id,
            max_age=3600,
            path='/',
            domain=None,  # Default to the current domain
            secure=False,  # Set to True in production with HTTPS
            httponly=False,
            samesite=None  
        )
        print("Setting cookie:", response.cookies)

        return response
    else:
        return JsonResponse({"message": "Password incorrect", "user_id": None, "Success": False}, status=401)


from django.shortcuts import get_object_or_404


def signup(request):
    if request.method == 'POST':
        try:

            data = json.loads(request.body)

            user_id = data.get('user_id')
            username = data.get('username')
            email_id = data.get('email_id')
            password = data.get('password')
            gender = data.get('gender', '')
            bio = data.get('bio', '')
            profile_picture = data.get('profile_picture', '')

            # Validate input
            if not all([user_id, username, email_id, password]):
                return JsonResponse({'Message': 'All fields are required', 'Success': False}, status=400)

            if User.objects.filter(user_id=user_id).exists():
                return JsonResponse({'Message': 'User ID already exists', 'Success': False}, status=400)

            # Hash the password
            hashed_password = make_password(password)

            # Create a new user
            user = User(
                user_id=user_id,
                username=username,
                email_id=email_id,
                password=hashed_password,
                gender=gender,
                bio=bio,
                profile_picture=profile_picture
            )
            user.save()


            serializer = UserSerializer(user)

            response_data = {
                'Message': 'User registered successfully',
                'Success': True,
                'data': serializer.data
            }

            return JsonResponse(response_data)

        except json.JSONDecodeError:
            return JsonResponse({'Message': 'Invalid JSON', 'Success': False}, status=400)
        except ValidationError as e:
            return JsonResponse({'Message': str(e), 'Success': False}, status=400)
        except Exception as e:
            return JsonResponse({'Message': str(e), 'Success': False}, status=500)
    
    return JsonResponse({'Message': 'Method not allowed', 'Success': False}, status=405)


@csrf_exempt
def user(request):
    # Retrieve user_id from cookies
    print("Cookies received:", request.COOKIES)

    # Retrieve user_id from cookies
    # user_id = request.COOKIES.get('user_data', None)
    user_id = request.COOKIES.get('user_data', None)

    # user_id = request.GET.get('user_id', None)

    if not user_id:
        return JsonResponse({'message': 'Please log in first', 'success': False}, status=401)

    try:
        # Filter users based on user_id
        users = User.objects.filter(user_id=user_id)
        
        # Serialize the user data
        serializer = adminSerializer(users, many=True)
        
        # Check if any user data was serialized
        if serializer.data:
            response_data = {
                'message': 'User fetched successfully',
                'success': True,
                'data': serializer.data
            }
        else:
            response_data = {
                'message': 'User not found',
                'success': False,
                'data': []
            }
    except Exception as e:
        # Handle unexpected errors
        response_data = {
            'message': 'An error occurred while fetching user data',
            'success': False,
            'error': str(e)
        }
        return JsonResponse(response_data, status=500)

    return JsonResponse(response_data, safe=False)

@csrf_exempt
def like(request):
    # Get user_id from cookies
    user_id = request.COOKIES.get('user_data', None)
    if not user_id:
        return JsonResponse({"message": "User ID not found in cookies", "Success": False}, status=400)

    try:
        data = json.loads(request.body)
        post_id = data.get('post_id')
    except json.JSONDecodeError:
        return JsonResponse({"message": "Invalid JSON", "Success": False}, status=400)

    if not post_id:
        return JsonResponse({"message": "Post ID is required", "Success": False}, status=400)

    # Retrieve all posts and iterate to find the one with matching post_id
    all_posts = Posts.objects.all()  # Get all posts from the database
    postt = None

    for post in all_posts:
        if str(post.post_id) == str(post_id):  # Compare the post_id (converted to string)
            postt = post
            break
    print(postt,post_id)
    if not postt:
        return JsonResponse({"message": "Post not found", "Success": False}, status=404)

    print(f"Liked users before update: {postt.like_user_id}")  # Print current list of liked users

    if user_id in postt.like_user_id:
        # User has already liked the post, so we unlike it
        postt.like_user_id.remove(user_id)
    else:
        # User has not liked the post, so we like it
        postt.like_user_id.append(user_id)

    # Save the post object to persist changes
    postt.save()

    # Re-query the post from the database to verify the update
    updated_post = None
    for post in Posts.objects.all():
        if str(post.post_id) == str(post_id):
            updated_post = post
            break

    print(f"Liked users after update: {updated_post.like_user_id}")  # Print the updated list of liked users

    return JsonResponse({
        "message": "Post like status updated successfully",
        "Success": True if user_id in updated_post.like_user_id else False,
        "Updated Likes": updated_post.like_user_id
    })
