from django.http import JsonResponse

class CheckCookieMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Define the URL path for the profile view
        profile_path = '/profile/'  # Adjust this path based on your URL configuration
        
        # Check if the request path matches the profile view path
        if request.path == profile_path:
            # Check if the specific cookie exists
            if 'user_cookie' not in request.COOKIES:
                # If the cookie is not present, return an error response
                return JsonResponse({
                    'error': 'Authentication required',
                    'message': 'Cookie "user_cookie" not found. Access denied.'
                }, status=403)  # 403 Forbidden status code

        # If the cookie exists or the request is not for the profile path, proceed with the request
        response = self.get_response(request)
        return response
