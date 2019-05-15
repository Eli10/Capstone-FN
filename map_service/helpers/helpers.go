package helpers

import (
	"fmt"
	"map_service/nodes"
	"map_service/types"

	bolt "github.com/johnnadratowski/golang-neo4j-bolt-driver"
	"github.com/johnnadratowski/golang-neo4j-bolt-driver/structures/graph"
)

/*
This method creates a connection to the Neo4j DB

@return bolt.Conn Connection to DB
*/
func CreateConnection() bolt.Conn {
	driver := bolt.NewDriver()
	con, err := driver.OpenNeo(nodes.URI)
	HandleError(err)
	return con
}

/*
This method prepares a query string for execution in the DB.

@param query The String representing the query

@param bolt.Conn Connection to DB

@return bolt.Stmt Statement to run in the DB
*/
func PrepareStatement(query string, con bolt.Conn) bolt.Stmt {
	st, err := con.PrepareNeo(query)
	HandleError(err)
	return st
}

/*

This method handles any error when preparing or executing statments.

@param err The Error object
*/
func HandleError(err error) {
	if err != nil {
		panic(err)
		// return ErrorMessage{Message: err.Error()}
	}
}

/*

This method excutes DB Statement to create the Map to Restaurant Relationship

@param bolt.Stmt Statement to run in the DB

@param MapRestuarantObject Object representing the relationship
*/
func ExecuteMapContainsStatement(st bolt.Stmt, obj types.MapRestaurantRelationship) {
	result, err := st.ExecNeo(map[string]interface{}{"restaurant_id": obj.RestaurantID, "mapname": obj.Mapname})
	HandleError(err)
	numResult, err := result.RowsAffected()
	HandleError(err)
	fmt.Printf("CREATED ROWS: %d\n", numResult)

	// Closing the statment will also close the rows
	st.Close()
}

/*

This method excutes DB Statement to create the User to Map Relationship

@param bolt.Stmt Statement to run in the DB

@param UserMapObject Object representing the relationship
*/
func ExecuteUserMapStatement(st bolt.Stmt, obj types.UserMapRelationship) {
	result, err := st.ExecNeo(map[string]interface{}{"username": obj.Username, "mapname": obj.Mapname})
	HandleError(err)
	numResult, err := result.RowsAffected()
	HandleError(err)
	fmt.Printf("CREATED ROWS: %d\n", numResult)

	// Closing the statment will also close the rows
	st.Close()
}

/*
This method query the DB for Maps belonging to a User

@param bolt.Stmt Statement to run in the DB

@param UserObject Object representing the user

@return bolt.Rows Rows representing the result of the query
*/
func QueryUserMapListStatement(st bolt.Stmt, obj types.User) bolt.Rows {
	// Even once I get the rows, if I do not consume them and close the
	// rows, Neo will discard and not send the data
	rows, err := st.QueryNeo(map[string]interface{}{"username": obj.Username})
	HandleError(err)
	return rows
}

/*
This method allows you to consume rows one-by-one, as they
come off the bolt stream. This is more efficient especially
if you're only looking for a particular row/set of rows, as
you don't need to load up the entire dataset into memory

@param bolt.Rows Rows representing the result of the query

@param bolt.Stmt Statement to run in the DB

@return interface{} This represents the rows you want to keep
*/
func ConsumeUserMapRows(rows bolt.Rows, st bolt.Stmt) interface{} {
	data, _, err := rows.All()
	HandleError(err)
	fmt.Println("DATA: ", data, "\n")
	fmt.Printf("COLUMNS: %#v\n", rows.Metadata()["fields"].([]interface{}))
	// fmt.Printf("FIELDS: %s %s \n", data[0].(string), data[1].(string))

	st.Close()
	fmt.Printf("Type of the Data: %T", data)
	return data
}

/*

This method excutes DB Statement to create a Map

@param bolt.Stmt Statement to run in the DB

@param MapObject Object representing the map
*/
func ExecuteMapStatement(st bolt.Stmt, obj types.Map) {
	result, err := st.ExecNeo(map[string]interface{}{"name": obj.Name})
	HandleError(err)
	numResult, err := result.RowsAffected()
	HandleError(err)
	fmt.Printf("CREATED ROWS: %d\n", numResult) // CREATED ROWS: 1

	// Closing the statment will also close the rows
	st.Close()
}

/*

This method query the DB for a Map by Name

@param bolt.Stmt Statement to run in the DB

@param MapObject Object representing the map

@return bolt.Rows Rows representing the result of the query
*/
func QueryMapStatement(st bolt.Stmt, obj types.Map) bolt.Rows {
	fmt.Println(st)
	rows, err := st.QueryNeo(map[string]interface{}{"name": obj.Name})
	HandleError(err)
	return rows
}

/*

This method allows you to consume rows one-by-one, as they
come off the bolt stream. This is more efficient especially
if you're only looking for a particular row/set of rows, as
you don't need to load up the entire dataset into memory

@param bolt.Rows Rows representing the result of the query

@param bolt.Stmt Statement to run in the DB

@return interface{} This represents the rows you want to keep
*/
func ConsumeRows(rows bolt.Rows, st bolt.Stmt) (interface{}, []interface{}) {
	data, _, err := rows.NextNeo()
	HandleError(err)
	fmt.Println(data)
	fmt.Printf("COLUMNS: %#v\n", rows.Metadata()["fields"].([]interface{}))
	fmt.Printf("FIELDS: %s \n", data[0].(string))
	st.Close()
	return data[0], data[1].([]interface{})
}

/*
This method query the DB for all User Map Names for a User

@param bolt.Stmt Statement to run in the DB

@param UserObject Object representing the user

@return bolt.Rows Rows representing the result of the query
*/
func QueryMapNameList(st bolt.Stmt, obj types.User) bolt.Rows {
	rows, err := st.QueryNeo(map[string]interface{}{"username": obj.Username})
	HandleError(err)
	return rows
}

/*
This method allows you to consume rows one-by-one, as they
come off the bolt stream. This is more efficient especially
if you're only looking for a particular row/set of rows, as
you don't need to load up the entire dataset into memory

@param bolt.Rows Rows representing the result of the query

@param bolt.Stmt Statement to run in the DB

@return interface{} This represents the rows you want to keep
*/
func ConsumeMapNameRows(rows bolt.Rows, st bolt.Stmt) interface{} {
	data, _, err := rows.All()
	HandleError(err)
	fmt.Println(data)
	fmt.Printf("COLUMNS: %#v\n", rows.Metadata()["fields"].([]interface{}))
	// fmt.Printf("FIELDS: %s %s \n", data[0].(string), data[1].(string))
	st.Close()
	fmt.Printf("Type of the Data: %T", data)
	return data

}

/*
This method takes a list of restuarant row results from the DB
and formats each row into a Restuarant Object that can be
show in JSON.

@param rows Row Results from a query executed

@return RestaurantList A list of Restaurant Objects
*/
func CreateRestaurantList(list []interface{}) []types.Restaurant {
	var restaurant_list []types.Restaurant

	for _, r := range list {
		restuatant_node := r.(graph.Node)
		restaurant_data := restuatant_node.Properties
		fmt.Println("DATA", restaurant_data)
		fmt.Printf("Type of the Data: %T\n", restaurant_data)
		restaurant_list = append(restaurant_list, types.Restaurant{
			Name:    restaurant_data["name"].(string),
			Address: restaurant_data["address"].(string),
			Lat:     restaurant_data["lat"].(float64),
			Lon:     restaurant_data["lon"].(float64)})
	}

	return restaurant_list
}
