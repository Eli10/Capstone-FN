package nodes

const (
	URI                          = "bolt://neo4j:12345@127.0.0.1:7687"
	CreateNode                   = "CREATE (n:Map {name: {name}})"
	CreateUserMapRelationship    = "MATCH (a:User {username: {username}}) MERGE (n:Map {mapname: {mapname}}) MERGE (a)-[r:HAS]->(n)"
	GetUserMapList               = "MATCH (u:User {username: {username}})-[]->(b:Map)-[]->(res:Restaurant) RETURN b.mapname, collect(res) AS restaurants"
	CreateUserFollowRelationship = "MATCH (a:User {username:{a_username}}), (b:User {username: {b_username}}) MERGE (a)-[r:FOLLOWS]->(b)"
	GetMapNode                   = "MATCH(m:Map {mapname: {name}})-[]->(res:Restaurant) RETURN m.mapname, collect(res) AS restaurants"
	CreateMapRestaurantRelationship = "MATCH (res:Restaurant) WHERE id(res)={restaurant_id} MATCH (m:Map {mapname: {mapname}}) MERGE (m)-[r:CONTAINS]->(res)"
	RemoveMapRestaurantRelationship = "MATCH (m:Map {mapname: {mapname}})-[r]-(res:Restaurant) WHERE id(res)={restaurant_id} DELETE r"
	GetRestaurants 									= "MATCH (res:Restaurant) RETURN res.name AS restaurants"
	GetRestaurant										= "MATCH (res:Restaurant {name: {restaurant_name}}) RETURN res"
)
