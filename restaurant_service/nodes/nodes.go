/*
For Local access to Neo4j instance use
NEO4J_GO_LANG_LOCAL_DB_CREDS variable
Change password to whatever you have locally
For Heroku Prod access use
NEO4J_GO_LANG_HEROKU_DB_CREDS variable
*/
package nodes

import "os"

// URL for Connecting to Neo4j. Pulled from Environment variables
var URI string = os.Getenv("NEO4J_GO_LANG_HEROKU_DB_CREDS")

// Database Statments used for querying and execution
const (
	GetRestaurants          = "MATCH (res:Restaurant) RETURN res"
	GetRestaurant           = "MATCH (res:Restaurant {name: {restaurant_name}}) RETURN res"
	GetRestaurantId         = "MATCH (res:Restaurant {name: {restaurant_name}, address: {address}}) RETURN id(res)"
	GetDiscoveredRestaurant = "MATCH (u:User {username: {username}})-[]-(u1:User)-[]-(m:Map)-[]-(res:Restaurant) WHERE not (u)-[]-()-[]-(res) RETURN res"
)
