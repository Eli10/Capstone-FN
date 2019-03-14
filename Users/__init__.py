
from Users import graph
from functions import app

graph.schema.create_uniqueness_constraint("User", "username")
