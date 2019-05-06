from py2neo import Graph, Node, Relationship, authenticate
from passlib.hash import bcrypt
import json
import uuid
import os
import googlemaps

# For Connecting to Heroku

# graphenedb_url = os.environ.get("GRAPHENEDB_BOLT_URL", 'blah')
# graphenedb_user = os.environ.get("GRAPHENEDB_BOLT_USER", 'blah')
# graphenedb_pass = os.environ.get("GRAPHENEDB_BOLT_PASSWORD", 'blah')
# authenticate(graphenedb_url.strip("bolt://").replace("24787", "24780"), graphenedb_user, graphenedb_pass)
# graph = Graph(graphenedb_url, user=graphenedb_user, password=graphenedb_pass, bolt = True, secure = True, http_port = 24789, https_port = 24780)
#

#For Connecting to local host instance
<<<<<<< HEAD
graph = Graph(bolt=True, host="127.0.0.1", user="neo4j", password="capstone")
=======
graph = Graph(bolt=True, host=os.environ.get("NEO4J_PYTHON_HOST", 'n/a'), user=os.environ.get("NEO4J_PYTHON_USER", 'n/a'), password=os.environ.get("NEO4J_PYTHON_PASS", 'n/a'))
>>>>>>> 564cdd642238f8dc1acccae60689c3d8b82fd1a3


# For Connecting to EC2 instance
# authenticate("52.91.176.33:7473", "neo4j", "i-0b894b0a765ce3877")
# graph = Graph("http://52.91.176.33:7474/db/data", user="neo4j", password="i-0b894b0a765ce3877", secure=False)

gmaps = googlemaps.Client(key=os.environ["GOOGLE_MAPS_API_KEY"])


class User:
	def __init__(self, username):
		self.username = username

	"""Class Method that checks if user exists in DB

    :returns: User Object
    """
	def find(self):
		# print(dir(graph))
		# user_to_find = Node("User", username=self.username)
		user_to_find = graph.find_one("User", property_key="username", property_value=self.username)
		print(user_to_find)
		if user_to_find == None:
			return None
		return user_to_find
		# user = graph.exists(user_to_find)
		# print("USER FOUND???: {}".format(user))
		# return user

	"""Static Method that returns all users in DB

    :returns: list of users
    """
	@staticmethod
	def all_users():
		users = graph.find("User")
		all_users_list = [u for u in users]
		if all_users_list == None:
			return []
		return all_users_list

	"""Class Method that registers a user

	:param password: password of user
    :returns: boolean
    """
	def register(self, password):
		if not self.find():
			user = Node('User', username=self.username, password=bcrypt.encrypt(password))
			graph.create(user)
			return True
		else:
			return False

	"""Class Method that verifies user password with what is in the DB

	:param password: password of user
    :returns: boolean
    """
	def verify_password(self, password):
		user = self.find()
		print(user)
		if user:
			return bcrypt.verify(password, user['password'])
		else:
			return False

	"""Class Method creates user to user relationship

	:param follow_username: name of user to follow
    :returns: boolean
    """
	def follow_user(self, follow_username):
		primary_user = self.find()
		user_to_follow = User(follow_username).find()

		follow_relationship = Relationship(primary_user, "FOLLOWS", user_to_follow)
		# graph.create does not return anything
		if graph.match_one(start_node=primary_user, rel_type="FOLLOWS", end_node=user_to_follow, bidirectional=True) != None:
			return False
		else:
			graph.create(follow_relationship)
			return True

	"""Static Method search for new restaurants

	:param restaurant_name: name of restaurant to search for
    :returns: list of restaurants
    """
	@staticmethod
	def user_google_search(restaurant_name):
		search_results = []
		places = gmaps.places_nearby(location=(40.768291, -73.964494), keyword=restaurant_name,
			language='eu-US', min_price=1, max_price=4,
			name='bar', rank_by='distance', type='food')
		results = places["results"]
		for r in results:
			res_dict = {}
			res_dict.update(r['geometry']['location'])
			print(res_dict)
			res_dict["lon"] = res_dict.pop("lng")
			res_dict.update({'name': r['name'], 'address': r['vicinity']})
			print(res_dict)
			search_results.append(res_dict)
			restaurant_node = Node("Restaurant", name=res_dict['name'], address=res_dict['address'], lat=res_dict['lat'], lon=res_dict['lon'])
			graph.create(restaurant_node)
		return search_results

	"""Class Method returns all user nodes connected to a iser

    :returns: list of usernames
    """
	def return_friends(self):
		results = graph.data("MATCH (u:User {username:'"+self.username+"'})-[:FOLLOWS]-(u1:User) return u1.username as username")

		if results == None or results == []:
			return []
		else:
			cleaned_results = [u["username"] for u in results]
			return cleaned_results
