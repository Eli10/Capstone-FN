from Review import Review
from flask import Flask, request
from flask_restful import Resource, Api

application = Flask(__name__)
api = Api(application)


class createReview(Resource):
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
	def get(self, restaurant_id):
		reviews = Review.get_reviews_for_restaurant(restaurant_id)
		if reviews != None:
			return {'reviews': reviews}, 200
		else:
			return {'message': 'Error getting reviews'}, 404

class userReview(Resource):
	def get(self, username):
		reviews = Review.get_reviews_for_user(username)
		if reviews != None:
			return {'reviews': reviews}, 200
		else:
			return {'message': 'Error getting reviews'}, 404

class HelloTest(Resource):
	def get(self):
		return {'message': 'Hello'}, 200

api.add_resource(createReview, '/reviews')
api.add_resource(restaurantReview, '/reviews/restaurant/<int:restaurant_id>')
api.add_resource(userReview, '/reviews/user/<string:username>')