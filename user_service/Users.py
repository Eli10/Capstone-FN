from py2neo import Graph, Node, Relationship, authenticate
from passlib.hash import bcrypt
import json
import uuid
import os
import googlemaps


# === DB Connections ===

"""
	For Connecting to NEO4j PROD DB on Heroku
"""
graphenedb_url = os.environ.get("GRAPHENEDB_BOLT_URL", 'blah')
graphenedb_user = os.environ.get("GRAPHENEDB_BOLT_USER", 'blah')
graphenedb_pass = os.environ.get("GRAPHENEDB_BOLT_PASSWORD", 'blah')
authenticate(graphenedb_url.strip("bolt://").replace("24787", "24780"), graphenedb_user, graphenedb_pass)
graph = Graph(graphenedb_url, user=graphenedb_user, password=graphenedb_pass, bolt = True, secure = True, http_port = 24789, https_port = 24780)


"""
	For Connecting to local host instance
"""
# graph = Graph(bolt=True, host=os.environ.get("NEO4J_PYTHON_HOST", 'n/a'), user=os.environ.get("NEO4J_PYTHON_USER", 'n/a'), password=os.environ.get("NEO4J_PYTHON_PASS", 'n/a'))

"""
	Google Maps Object for querying New Restaurants
"""
gmaps = googlemaps.Client(key=os.environ["GOOGLE_MAPS_API_KEY"])

# === User Model for UserService API ===

class User:
	"""
		Constructor Method - Must Supply
		1. Username
		2. First Name
		3. Last Name
		4. Age
		5. Gender
		6. Favorite Borough
	"""
	def __init__(self, username=None, fname=None, lname=None, age=None, gender=None, favBorough=None):
		self.username = username
		self.fname = fname
		self.lname = lname
		self.age = age
		self.gender = gender
		self.favBorough = favBorough

	"""
	Class Method that checks if user exists in DB

    :returns: User Object
    """
	def find(self):
		user_to_find = graph.find_one("User", property_key="username", property_value=self.username)
		print(user_to_find)
		if user_to_find == None:
			return None
		return user_to_find

	"""
	Static Method that returns all users in DB

    :returns: list of users
    """
	@staticmethod
	def all_users():
		users = graph.find("User")
		all_users_list = [u for u in users]
		if all_users_list == None:
			return []
		return all_users_list

	"""
	Class Method that registers a user

	:param password: password of user
    :returns: boolean
    """
	def register(self, password):
		if not self.find():
			user = Node('User', username=self.username, fname=self.fname, lname=self.lname, age=self.age, gender=self.gender, favBorough=self.favBorough, password=bcrypt.encrypt(password))
			graph.create(user)
			return True
		else:
			return False

	"""
	Class Method that verifies user password
	with what is in the DB

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

	"""
	Class Method creates user to user relationship

	:param follow_username: name of user to follow
    :returns: boolean
    """
	def follow_user(self, follow_username):
		primary_user = self.find()
		user_to_follow = User(follow_username).find()

		follow_relationship = Relationship(primary_user, "FOLLOWS", user_to_follow)
		if graph.match_one(start_node=primary_user, rel_type="FOLLOWS", end_node=user_to_follow, bidirectional=True) != None:
			return False
		else:
			graph.create(follow_relationship)
			return True

	"""
	Static Method search for new restaurants

	:param restaurant_name: name of
	restaurant to search for
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

	"""
	Class Method that returns all other
	user nodes connected to a user

    :returns: list of usernames
    """
	def return_friends(self):
		results = graph.data("MATCH (u:User {username:'"+self.username+"'})-[:FOLLOWS]-(u1:User) return u1.username as username")

		if results == None or results == []:
			return []
		else:
			cleaned_results = [u["username"] for u in results]
			return cleaned_results

	"""
	Class Method that returns user data

    :returns: dict of user information
    """
	def return_profile(self):
		results = graph.data("MATCH (u:User {username:'"+self.username+"'}) return u as user" )
		if results == None or results == []:
			return {"age": '', "username": '', "fname": '', "lname":'', "gender":'', "favBorough":''}
		else:
			profile = {}
			for r in results:
				profile["age"] =  r["user"]["age"]
				profile["username"] = r["user"]["username"]
				profile["fname"] = r["user"]["fname"]
				profile["lname"] = r["user"]["lname"]
				profile["gender"] = r["user"]["gender"]
				profile["favBorough"] = r["user"]["favBorough"]
			return profile
