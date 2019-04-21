
from Users import User
from flask import Flask, request, json, session, render_template, redirect, url_for
from flask_restful import Resource, Api

from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token,
create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

import googlemaps

application = Flask(__name__)
api = Api(application)
gmaps = googlemaps.Client(key='AIzaSyBYXfY11LybYeUzNeSi39xozg5YXKxSr-E')

application.config['JWT_SECRET_KEY'] = "very-secret-token-string"
jwt = JWTManager(application)

class createUser(Resource):

	"""Class Method handles registering a user

    :returns: json
    """
	def post(self):
		req_data = request.get_json()
		username = req_data['username']
		password = req_data['password']

		if User(username).register(password):
			access_token = create_access_token(identity = username)
			refresh_token = create_refresh_token(identity = username)

			return {
				'message':'User has been registered',
				'access_token': access_token,
				'refresh_token': refresh_token}, 200
		else:
			return {'message': "User already registered"}, 202

class loginUser(Resource):

	"""Class Method handles logging in a user

    :returns: json
    """
	def post(self):
		req_data = request.get_json()
		username = req_data['username']
		password = req_data['password']

		if User(username).verify_password(password):
			# session['username'] = username
			access_token = create_access_token(identity = username)
			refresh_token = create_refresh_token(identity = username)
			return {
				'message':'User has been registered',
				'access_token': access_token,
				'refresh_token': refresh_token}, 200
		else:
			return {'message': 'User cannot be authenicated'}, 404


class NewAccessToken(Resource):

	"""Class Method handles refreshing jwt access tokens

    :returns: json
    """
	@jwt_refresh_token_required
	def get(self):
		current_user = get_jwt_identity()
		access_token = create_access_token(identity = current_user)
		return {'access_token': access_token}


class UserFollows(Resource):

	"""Class Method handles creating user to user relationship

    :returns: json
    """
	@jwt_required
	def post(self):
		req_data = request.get_json()
		username = req_data['username']
		follow_user = req_data['follows']

		if User(username).follow_user(follow_user):
			return {'message':'Relationship created'}, 200
		else:
			return {'message': 'Relationship already created'}, 202

class PalaceSearch(Resource):

	"""Class Method handles searching for new restaurant not in the DB for a user

    :returns: json
    """
	def get(self, restaurant_name):
		search_results = []
		places = gmaps.places_nearby(location=(40.768291, -73.964494), keyword=restaurant_name,
			language='eu-US', min_price=1, max_price=4,
			name='bar', rank_by='distance', type='food')
		results = places["results"]
		for r in results:
			res_dict = {}
			res_dict.update(r['geometry']['location'])
			res_dict.update({'name': r['name'], 'address': r['vicinity']})
			print(res_dict)
			search_results.append(res_dict)
		return {'results': search_results}, 200

class FindFriends(Resource):

	"""Class Method handles returning all users

    :returns: json
    """
	@jwt_required
	def get(self):
		users = User.all_users()
		return {'users': users}, 200

class HelloTest(Resource):

	"""Class Method handles hello message

    :returns: json
    """
	def get(self):
		return {'message': 'Hello'}, 200

class testWork(Resource):
	def get(self):
		return {'message': 'Working'}, 200

"""Registering routes to api

:param HandlerClass: class of route handler
:param route: name of route
"""
api.add_resource(testWork, '/')
api.add_resource(FindFriends, '/users/list')
api.add_resource(createUser, '/users/register')
api.add_resource(loginUser, '/users/login')
api.add_resource(UserFollows, '/users/follows')
api.add_resource(HelloTest, '/users/hello')
api.add_resource(PalaceSearch, '/users/restaurant/search/<string:restaurant_name>')
api.add_resource(NewAccessToken, '/users/refresh-token')
