from Users import User
from flask import Flask, request, json, session, render_template, redirect, url_for, request
from flask_restful import Resource, Api

from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token,
create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

import os


# === User Service Api ===

"""
	Flask set up to get the Api running
"""
application = Flask(__name__)
api = Api(application)

"""
	Set-up for JWT Authentication
"""
application.config['JWT_SECRET_KEY'] = os.environ["JWT_SECRET_KEY"]
jwt = JWTManager(application)

class createUser(Resource):

	## === createUser Function ===

	"""
	Resource Class Method that handles registering a user
	Check if user already exists or not to avoid
	creating duplicate Users.

    :returns: json containing confirmation message,
	access_token for further api requests and
	resfresh_token for obtaining a new access_token
    """
	def post(self):
		req_data = request.get_json()
		fname = req_data['fname']
		lname = req_data['lname']
		age = req_data['age']
		gender = req_data['gender']
		favBorough = req_data['favBorough']
		username = req_data['username']
		password = req_data['password']

		if User(username, fname, lname, age, gender, favBorough).register(password):
			access_token = create_access_token(identity = username)
			refresh_token = create_refresh_token(identity = username)

			return {
				'message':'User has been registered',
				'access_token': access_token,
				'refresh_token': refresh_token}, 200
		else:
			return {'message': "User already registered"}, 202

class loginUser(Resource):

	## === loginUser Function ===

	"""
	Resource Class Method that handles logging in a user.
	Check the hashed password against the database

    :returns: json containing confirmation message,
	access_token for further api requests and
	resfresh_token for obtaining a new access_token
    """
	def post(self):
		req_data = request.get_json()
		username = req_data['username']
		password = req_data['password']

		if User(username=username).verify_password(password):
			access_token = create_access_token(identity = username)
			refresh_token = create_refresh_token(identity = username)
			return {
				'message':'User has been registered',
				'access_token': access_token,
				'refresh_token': refresh_token}, 200
		else:
			return {'message': 'User cannot be authenicated'}, 404


class NewAccessToken(Resource):

	## === NewAccessToken Function ===

	"""
	Resource Class Method handles refreshing
	jwt access tokens.
    :returns: json containing new access token
	for api requests
    """
	@jwt_refresh_token_required
	def get(self):
		current_user = get_jwt_identity()
		access_token = create_access_token(identity = current_user)
		return {'access_token': access_token}


class UserFollows(Resource):

	## === UserFollows Function ===

	"""
	Resource Class Method handles creating
	user to user relationship.
	Check if the relationship already exists
	before creation
    :returns: json contain confirmation of relationship
    """
	@jwt_required
	def post(self):
		req_data = request.get_json()
		username = req_data['username']
		follow_user = req_data['follows']

		if User(username=username).follow_user(follow_user):
			return {'message':'Relationship created'}, 200
		else:
			return {'message': 'Relationship already created'}, 202

class PlaceSearch(Resource):

	## === PlaceSearch Function ===

	"""
	Resource Class Method handles searching
	for new restaurants currently not in
	the DB for a user

    :returns: json containing result of the search
    """
	def get(self, restaurant_name):
		search_results = User.user_google_search(restaurant_name)

		return {'results': search_results}, 200

class FindFriends(Resource):

	## === FindFriends Function ===

	"""
	Resource Class Method handles returning
	all users in database.

    :returns: json containing list of all users
    """
	@jwt_required
	def get(self):
		print(request.headers)
		users = User.all_users()
		return {'users': users}, 200


class UserFriends(Resource):

	## === UserFriends Function ===

	"""
	Resource Class Method handles returning
	all friends of a user

    :returns: json conataining list of friend objects
    """
	@jwt_required
	def get(self, username):
		friends = User(username=username).return_friends()
		return {'friends': friends}, 200

class getUser(Resource):

	## === getUser Function ===

	"""
	Resource Class Method that handles
	returning user profile data

    :returns: json contain user information
    """
	@jwt_required
	def get(self, username):
		profile = User(username=username).return_profile()
		return {'profile': profile}, 200

class HelloTest(Resource):

	## === HelloTest Function ===

	"""
	Resource Class Method handles hello message

    :returns: json
    """
	def get(self):
		return {'message': 'Hello'}, 200

class testWork(Resource):

	## === testWork Function ===

	"""
	Resource Class Method for testing
	the status of the Api

    :returns: json
    """
	def get(self):
		return {'message': 'Working'}, 200

## === API Routes ===

"""
	Registering routes to api

	:param HandlerClass: class of route handler
	:param route: name of route
"""
api.add_resource(testWork, '/')
api.add_resource(FindFriends, '/users/list')
api.add_resource(createUser, '/users/register')
api.add_resource(getUser, '/users/<string:username>')
api.add_resource(loginUser, '/users/login')
api.add_resource(UserFollows, '/users/follows')
api.add_resource(UserFriends, '/users/friends/<string:username>')
api.add_resource(HelloTest, '/users/hello')
api.add_resource(PlaceSearch, '/users/restaurant/search/<string:restaurant_name>')
api.add_resource(NewAccessToken, '/users/refresh-token')
