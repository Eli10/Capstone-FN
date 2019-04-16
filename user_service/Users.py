

from py2neo import Graph, Node, Relationship, authenticate
from passlib.hash import bcrypt
import json
import uuid
import os

# For Connecting to Heroku

# graphenedb_url = os.environ.get("GRAPHENEDB_BOLT_URL", 'blah')
# graphenedb_user = os.environ.get("GRAPHENEDB_BOLT_USER", 'blah')
# graphenedb_pass = os.environ.get("GRAPHENEDB_BOLT_PASSWORD", 'blah')
# authenticate(graphenedb_url.strip("bolt://").replace("24787", "24780"), graphenedb_user, graphenedb_pass)
# graph = Graph(graphenedb_url, user=graphenedb_user, password=graphenedb_pass, bolt = True, secure = True, http_port = 24789, https_port = 24780)
#

#For Connecting to local host instance
graph = Graph(bolt=True, host="127.0.0.1", user="neo4j", password="12345")


# For Connecting to EC2 instance
# authenticate("52.91.176.33:7473", "neo4j", "i-0b894b0a765ce3877")
# graph = Graph("http://52.91.176.33:7474/db/data", user="neo4j", password="i-0b894b0a765ce3877", secure=False)


class User:
	def __init__(self, username):
		self.username = username

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

	@staticmethod
	def all_users():
		users = graph.find("User")
		all_users_list = [u for u in users]
		if all_users_list == None:
			return []
		return all_users_list

	def register(self, password):
		if not self.find():
			user = Node('User', username=self.username, password=bcrypt.encrypt(password))
			graph.create(user)
			return True
		else:
			return False

	def verify_password(self, password):
		user = self.find()
		print(user)
		if user:
			return bcrypt.verify(password, user['password'])
		else:
			return False

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
