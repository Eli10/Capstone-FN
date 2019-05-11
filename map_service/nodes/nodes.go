package nodes

import "os"

/**
* For Local access to Neo4j instance use
* NEO4J_GO_LANG_LOCAL_DB_CREDS variable
* Change password to whatever you have locally
* For Heroku Prod access use
* NEO4J_GO_LANG_HEROKU_DB_CREDS variable
*/

/**
* Database Statments used for querying and execution.
*/

var URI string = os.Getenv("NEO4J_GO_LANG_HEROKU_DB_CREDS")

const (
	CreateNode                   = "CREATE (n:Map {name: {name}})"
	CreateUserMapRelationship    = "MATCH (a:User {username: {username}}) MERGE (n:Map {mapname: {mapname}}) MERGE (a)-[r:HAS]->(n)"
	GetUserMapList               = "MATCH (u:User {username: {username}})-[]->(b:Map)-[]->(res:Restaurant) RETURN b.mapname, collect(res) AS restaurants"
	GetUserFriendMap    				 = "MATCH (u:User {username: {username}})-[]-(u1:User)-[]-(m:Map)-[]-(r:Restaurant) RETURN m.mapname, collect(r) AS restaurants"
	GetUserMapNameList           = "MATCH (u:User {username: {username}})-[]->(b:Map) RETURN b.mapname as map_name"
	GetMapNode                   = "MATCH(m:Map {mapname: {name}})-[]->(res:Restaurant) RETURN m.mapname, collect(res) AS restaurants"
	CreateMapRestaurantRelationship = "MATCH (res:Restaurant) WHERE id(res)={restaurant_id} MATCH (m:Map {mapname: {mapname}}) MERGE (m)-[r:CONTAINS]->(res)"
	RemoveMapRestaurantRelationship = "MATCH (m:Map {mapname: {mapname}})-[r:CONTAINS]-(res:Restaurant) WHERE id(res)={restaurant_id} DELETE r"
)
