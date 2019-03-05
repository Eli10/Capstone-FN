package nodes

const (
	URI                          = "bolt://neo4j:12345@127.0.0.1:7687"
	CreateNode                   = "CREATE (n:Map {name: {name}})"
	CreateUserMapRelationship    = "MATCH (a:User {username: {username}}) MERGE (n:Map {mapname: {mapname}}) MERGE (a)-[r:HAS]->(n)"
	GetUserMapList               = "MATCH (u:User {username: {username}})-[:HAS]->(b:Map) RETURN u.username,b.mapname"
	CreateUserFollowRelationship = "MATCH (a:User {username:{a_username}}), (b:User {username: {b_username}}) MERGE (a)-[r:FOLLOWS]->(b)"
	GetMapNode                   = "MATCH (n:Map {name: {name}}) RETURN n.name"
	CreateMapRestaurantRelationship = "MATCH (res:Restaurant) WHERE id(res)={restaurant_id} MATCH (m:Map {mapname: {mapname}}) MERGE (m)-[r:CONTAINS]->(res)"
	RemoveMapRestaurantRelationship = "MATCH (m:Map {mapname: {mapname}})-[r]-(res:Restaurant) WHERE id(res)={restaurant_id} DELETE r"
)
