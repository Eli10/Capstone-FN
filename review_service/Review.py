from py2neo import Graph, Node, Relationship, authenticate
import json

# For Connecting to Heroku

# graphenedb_url = os.environ.get("GRAPHENEDB_BOLT_URL", 'blah')
# graphenedb_user = os.environ.get("GRAPHENEDB_BOLT_USER", 'blah')
# graphenedb_pass = os.environ.get("GRAPHENEDB_BOLT_PASSWORD", 'blah')
# authenticate(graphenedb_url.strip("bolt://").replace("24787", "24780"), graphenedb_user, graphenedb_pass)
# graph = Graph(graphenedb_url, user=graphenedb_user, password=graphenedb_pass, bolt = True, secure = True, http_port = 24789, https_port = 24780)
#

#For Connecting to local host instance
graph = Graph(bolt=True, host=os.environ.get("NEO4J_PYTHON_HOST", 'n/a'), user=os.environ.get("NEO4J_PYTHON_USER", 'n/a'), password=os.environ.get("NEO4J_PYTHON_PASS", 'n/a'))

# For Connecting to EC2 instance
# authenticate("52.91.176.33:7473", "neo4j", "i-0b894b0a765ce3877")
# graph = Graph("http://52.91.176.33:7474/db/data", user="neo4j", password="i-0b894b0a765ce3877", secure=False)


class Review:
    def __init__(self, username, restaurant_id):
        self.username = username
        self.restaurant_id = restaurant_id

    """Static Method creates a user review for a restaurant

    :param username: name of user
    :param restaurant_name: number of restaurant
    :param restaurant_id: id of restaurant
    :param comment: user comment
    :param rating: user rating (1-5)
    :returns: boolean
    """
    @staticmethod
    def post_rating(username, restaurant_name, restaurant_id, comment, rating):
        query = """MATCH(u:User {username: \'"""+username+"""\'}) MATCH (r:Restaurant) WHERE id(r)="""+str(restaurant_id)+""" MERGE (u)-[:GAVE_REVIEW {rating: """+str(rating)+""", review: \'"""+comment+"""\' }]->(r)"""
        user = graph.find_one("User", property_key="username", property_value=username)
        print(user)
        restaurant = graph.find_one("Restaurant", property_key="name", property_value=restaurant_name)
        print(restaurant)
        print(query)
        if graph.match_one(start_node=user, rel_type="GAVE_REVIEW", end_node=restaurant):
            return False
        else:
            graph.data(query)
            return True

    """Static Method that gets user reviews for a restaurant

    :param restaurant_id: id of restaurant
    :returns: list of reviews
    """
    @staticmethod
    def get_reviews_for_restaurant(restaurant_id):
        query = "MATCH (r:Restaurant)-[c:GAVE_REVIEW]-(u:User) WHERE id(r)={} RETURN u.username as username, c.rating as rating, c.review as review".format(restaurant_id)
        print(query)
        return graph.data(query)

    """Static Method that gets all reviews for a user

    :param user: username
    :returns: list of reviews
    """
    @staticmethod
    def get_reviews_for_user(user):
        query = "MATCH (u:User)-[c:GAVE_REVIEW]-(r:Restaurant) WHERE u.username = '{}' RETURN u.username as username, r.name as restaurant_name, c.rating as rating, c.review as review".format(user)
        print(query)
        return graph.data(query)
