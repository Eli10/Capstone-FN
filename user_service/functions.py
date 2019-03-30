
from Users import User
from flask import Flask, request, json, session, render_template, redirect, url_for
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

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


class HelloTest(Resource):
	def get(self):
		return {'message': 'Hello'}, 200

api.add_resource(createUser, '/users/register')
api.add_resource(loginUser, '/users/login')
api.add_resource(UserFollows, '/users/follows')
api.add_resource(HelloTest, '/users/hello')
