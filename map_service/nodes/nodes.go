package nodes

/*

For Local access to Neo4j instance use

Local host bolt url -> bolt://neo4j:12345@127.0.0.1:7687

Change password to whatever you have locally

For Heroku Access Use
bolt://app129059723-YYTQIU:b.YHZyeRC7eFZf.m5yianH7o8NTkEjN@hobby-ggbgkgbadkkkgbkeedgpdpcl.dbs.graphenedb.com:24786?tls=true

*/

const (
	URI                          = "bolt://neo4j:12345@127.0.0.1:7687"
	CreateNode                   = "CREATE (n:Map {name: {name}})"
	CreateUserMapRelationship    = "MATCH (a:User {username: {username}}) MERGE (n:Map {mapname: {mapname}}) MERGE (a)-[r:HAS]->(n)"
	GetUserMapList               = "MATCH (u:User {username: {username}})-[]->(b:Map)-[]->(res:Restaurant) RETURN b.mapname, collect(res) AS restaurants"
	GetUserFriendMap    				 = "MATCH (u:User {username: {username}})-[]-(u1:User)-[]-(m:Map)-[]-(r:Restaurant) RETURN m.mapname, collect(r) AS restaurants"
	GetUserMapNameList           = "MATCH (u:User {username: {username}})-[]->(b:Map) RETURN b.mapname as map_name"
	GetMapNode                   = "MATCH(m:Map {mapname: {name}})-[]->(res:Restaurant) RETURN m.mapname, collect(res) AS restaurants"
	CreateMapRestaurantRelationship = "MATCH (res:Restaurant) WHERE id(res)={restaurant_id} MATCH (m:Map {mapname: {mapname}}) MERGE (m)-[r:CONTAINS]->(res)"
	RemoveMapRestaurantRelationship = "MATCH (m:Map {mapname: {mapname}})-[r:CONTAINS]-(res:Restaurant) WHERE id(res)={restaurant_id} DELETE r"
)
