from Review import Review
from flask import Flask, request
from flask_restful import Resource, Api

from flask_jwt_extended import JWTManager
from flask_jwt_extended import (jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

import os

application = Flask(__name__)
api = Api(application)

application.config['JWT_SECRET_KEY'] = os.environ["JWT_SECRET_KEY"]
jwt = JWTManager(application)


class createReview(Resource):

	"""Class Method handles creating a review

    :returns: json
    """
	@jwt_required
	def post(self):
		req_data = request.get_json()
		username = req_data['username']
		restaurant_id = req_data['restaurant_id']
		restaurant_name = req_data['restaurant_name']
		comment = req_data['comment']
		rating = req_data['rating']

		if Review.post_rating(username, restaurant_name, restaurant_id, comment, rating):
			return {'message': "Review created"}, 200
		else:
			return {'message': "Already reviewed restaurant"}, 200


class restaurantReview(Resource):

	"""Class Method handles geting restaurant reviews

	:param restaurant_id: id of restaurant
    :returns: json
    """
	@jwt_required
	def get(self, restaurant_id):
		reviews = Review.get_reviews_for_restaurant(restaurant_id)
		if reviews != None:
			return {'reviews': reviews}, 200
		else:
			return {'message': 'Error getting reviews'}, 404

class userReview(Resource):

	"""Class Method handles geting user reviews

	:param username: name of user
    :returns: json
    """
	@jwt_required
	def get(self, username):
		reviews = Review.get_reviews_for_user(username)
		if reviews != None:
			return {'reviews': reviews}, 200
		else:
			return {'message': 'Error getting reviews'}, 404

class HelloTest(Resource):

	"""Class Method handles hello message

    :returns: json
    """
	def get(self):
		return {'message': 'Hello'}, 200

"""Registering routes to api

:param HandlerClass: class of route handler
:param route: name of route
"""
api.add_resource(createReview, '/reviews')
api.add_resource(restaurantReview, '/reviews/restaurant/<int:restaurant_id>')
api.add_resource(userReview, '/reviews/user/<string:username>')
