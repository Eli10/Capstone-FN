package nodes


/*

For Local access to Neo4j instance use

Local host bolt url -> bolt://neo4j:12345@127.0.0.1:7687

Change password to whatever you have locally

For Heroku Access Use
bolt://app129059723-YYTQIU:b.YHZyeRC7eFZf.m5yianH7o8NTkEjN@hobby-ggbgkgbadkkkgbkeedgpdpcl.dbs.graphenedb.com:24786?tls=true

*/

const (
	URI                          		= "bolt://neo4j:12345@127.0.0.1:7687"
	GetRestaurants 								 	= "MATCH (res:Restaurant) RETURN res"
	GetRestaurant										= "MATCH (res:Restaurant {name: {restaurant_name}}) RETURN res"
	GetRestaurantId 								= "MATCH (res:Restaurant {name: {restaurant_name}, address: {address}}) RETURN id(res)"
	GetDiscoveredRestaurant 				= "MATCH (u:User {username: {username}})-[]-(u1:User)-[]-(m:Map)-[]-(res:Restaurant) WHERE not (u)-[]-()-[]-(res) RETURN res LIMIT 1"
)
