from Review import Review
from flask import Flask, request
from flask_restful import Resource, Api

from flask_jwt_extended import JWTManager
from flask_jwt_extended import (jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

import os

# === Review Service Api ===

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


class createReview(Resource):

	## === createReview Function ===

	"""
	Resource Class Method that handles
	creating a review

    :returns: json contain confirmation of
	review creation
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

	## === deleteReview Function ===

	"""
	Resource Class Method that handles
	creating a review

    :returns: json contain confirmation of
	review creation
    """
	@jwt_required
	def delete(self):
		req_data = request.get_json()
		username = req_data['username']
		restaurant_id = req_data['restaurant_id']

		if Review.delete_rating(username, restaurant_id):
			return {'message': "Review deleted"}, 200
		else:
			return {'message': "No review to delete"}, 200


class restaurantReview(Resource):

	## === restaurantReview Function ===

	"""
	Resource Class Method handles geting
	restaurant reviews

	:param restaurant_id: id of restaurant
    :returns: json containing list of
	restaurant objects
    """
	@jwt_required
	def get(self, restaurant_id):
		reviews = Review.get_reviews_for_restaurant(restaurant_id)
		if reviews != None:
			return {'reviews': reviews}, 200
		else:
			return {'message': 'Error getting reviews'}, 404

class userReview(Resource):

	## === userReview Function ===

	"""
	Resource Class Method handles
	geting user reviews

	:param username: name of user
    :returns: json containing reviews
	by user
    """
	@jwt_required
	def get(self, username):
		reviews = Review.get_reviews_for_user(username)
		if reviews != None:
			return {'reviews': reviews}, 200
		else:
			return {'message': 'Error getting reviews'}, 404

class HelloTest(Resource):

	## === HelloTest Function ===

	"""
	Resource Class Method handles hello message

    :returns: json
    """
	def get(self):
		return {'message': 'Hello'}, 200

## === API Routes ===

"""
	Registering routes to api

	:param HandlerClass: class of route handler
	:param route: name of route
"""
api.add_resource(createReview, '/reviews')
api.add_resource(restaurantReview, '/reviews/restaurant/<int:restaurant_id>')
api.add_resource(userReview, '/reviews/user/<string:username>')
