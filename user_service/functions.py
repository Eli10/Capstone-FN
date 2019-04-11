
from Users import User
from flask import Flask, request, json, session, render_template, redirect, url_for
from flask_restful import Resource, Api
import googlemaps

app = Flask(__name__)
api = Api(app)
gmaps = googlemaps.Client(key='AIzaSyBYXfY11LybYeUzNeSi39xozg5YXKxSr-E')

class createUser(Resource):
	def post(self):
		req_data = request.get_json()
		username = req_data['username']
		password = req_data['password']

		if User(username).register(password):
			return {'message':'User has been registered'}, 200
		else:
			return {'message': "User already registered"}, 202

class loginUser(Resource):
	def post(self):
		req_data = request.get_json()
		username = req_data['username']
		password = req_data['password']

		if User(username).verify_password(password):
			# session['username'] = username
			return {'message': 'User verified'}, 200
		else:
			return {'message': 'User cannot be authenicated'}, 404


class UserFollows(Resource):
	def post(self):
		req_data = request.get_json()
		username = req_data['username']
		follow_user = req_data['follows']

		if User(username).follow_user(follow_user):
			return {'message':'Relationship created'}, 200
		else:
			return {'message': 'Relationship already created'}, 202

class PalaceSearch(Resource):
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


class HelloTest(Resource):
	def get(self):
		return {'message': 'Hello'}, 200

api.add_resource(createUser, '/users/register')
api.add_resource(loginUser, '/users/login')
api.add_resource(UserFollows, '/users/follows')
api.add_resource(HelloTest, '/users/hello')
api.add_resource(PalaceSearch, '/users/restaurant/search/<string:restaurant_name>')
