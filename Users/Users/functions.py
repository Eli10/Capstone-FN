
from .Users import User
from flask import Flask, request, json, session, render_template, redirect, url_for
from flask_restful import resource, Api

app = Flask(__name__)
api = Api(app)

class createUser(Resource):
	def post(self):
		req_data = request.get_json()
		username = req_data['username']
		password = req_data['password']

		if User(username).register(password):
			session['username'] = username
			return 200
		else
			return 404			

class loginUser(Resource)
	def post(self):
		req_data = request.get_json()
		username = req_data['username']
		password = req_data['password']

		if User(username).verify_password(password):
			session['username'] = username
			return 200
		else
			return 404


api.add_resource(createUser, '/register')
api.add_resource(loginUser, '/login')


