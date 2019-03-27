

from py2neo import Graph, Node
from passlib.hash import bcrypt
import json
import uuid

#Change the url, username, and pasword to match the ones in main.go
graph = Graph(bolt=True, host="127.0.0.1", user="neo4j", password="12345")

class User:
	def __init__(self, username):
		self.username = username

	def find(self):
		# print(dir(graph))
		# user_to_find = Node("User", username=self.username)
		user_to_find = graph.nodes.match("User", username=self.username).first()
		print(user_to_find)
		if user_to_find == None:
			return None
		return user_to_find
		# user = graph.exists(user_to_find)
		# print("USER FOUND???: {}".format(user))
		# return user

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
