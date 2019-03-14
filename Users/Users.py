

from py2neo import Graph, Node
from passlib.hash import bcrypt
import json
import uuid

graph = Graph(username="neo4j", password="neo4j")

class User:
	def __init__(self, username):
		self.username = username

	def find(self):
		user = graph.find_one('User', 'username', self.username)
		return user
	
	def register(self, password):
		if not self.find():
			user = Node('User', username=self.username, password=bcrypt.encrypt(password))
			graph,create(user)
			return true
		else:
			return false

	def verify_password(self, password):
		user = self.find()
		if user:
			return bcrypt.verify(password, user['password'])
		else:
			return false
