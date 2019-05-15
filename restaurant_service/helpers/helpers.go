package helpers

import (
	"fmt"
	"restaurant_service/nodes"
	"restaurant_service/types"

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

/*
This method takes a row result from the DB
and formats the row into a Restuarant Object that can be
show in JSON.

@param rows Row Results from a query executed

@return Restaurant A Restaurant Objects
*/
func CreateRestaurant(data interface{}) types.Restaurant {
	var res types.Restaurant
	restuarant_node := data.(graph.Node)
	restaurant_data := restuarant_node.Properties
	fmt.Println(restaurant_data)
	fmt.Printf("Type of the Data: %T\n", restaurant_data)
	res.Name = restaurant_data["name"].(string)
	res.Address = restaurant_data["address"].(string)
	res.Lat = restaurant_data["lat"].(float64)
	res.Lon = restaurant_data["lon"].(float64)
	return res
}

/*
This method query the DB for a List of Restaurant Names

@param bolt.Stmt Statement to run in the DB

@return bolt.Rows Rows representing the result of the query
*/
func QueryRestaurantNameList(st bolt.Stmt) bolt.Rows {
	rows, err := st.QueryNeo(map[string]interface{}{})
	HandleError(err)
	return rows
}

/*
This method query the DB for a Restaurant By Name

@param bolt.Stmt Statement to run in the DB

@param RestaurantObject Object representing the restuarant

@return bolt.Rows Rows representing the result of the query
*/
func QueryRestaurantName(st bolt.Stmt, obj types.Restaurant) bolt.Rows {
	rows, err := st.QueryNeo(map[string]interface{}{"restaurant_name": obj.Name})
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
func ConsumeRestaurant(rows bolt.Rows, st bolt.Stmt) interface{} {
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
This method allows you to consume rows one-by-one, as they
come off the bolt stream. This is more efficient especially
if you're only looking for a particular row/set of rows, as
you don't need to load up the entire dataset into memory

@param bolt.Rows Rows representing the result of the query

@param bolt.Stmt Statement to run in the DB

@return interface{} This represents the rows you want to keep
*/
func ConsumeRestaurantNameRows(rows bolt.Rows, st bolt.Stmt) interface{} {
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
This method query the DB for the id of a restuarant

@param bolt.Stmt Statement to run in the DB

@param RestuarantObject Object representing the restaurant

@return bolt.Rows Rows representing the result of the query
*/
func QueryRestaurantID(st bolt.Stmt, obj types.Restaurant) bolt.Rows {
	rows, err := st.QueryNeo(map[string]interface{}{"restaurant_name": obj.Name, "address": obj.Address})
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
func ConsumeRestaurantIDRows(rows bolt.Rows, st bolt.Stmt) interface{} {
	data, _, err := rows.NextNeo()
	HandleError(err)
	fmt.Println(data)
	fmt.Printf("COLUMNS: %#v\n", rows.Metadata()["fields"].([]interface{}))
	// fmt.Printf("FIELDS: %s %s \n", data[0].(string), data[1].(string))

	st.Close()
	fmt.Printf("Type of the Data: %T", data)
	return data

}

/*
This method query the DB for a recommended restuarant

@param bolt.Stmt Statement to run in the DB

@param UserObject Object representing the user

@return bolt.Rows Rows representing the result of the query
*/
func QueryDiscover(st bolt.Stmt, obj types.User) bolt.Rows {
	rows, err := st.QueryNeo(map[string]interface{}{"username": obj.Username})
	HandleError(err)
	return rows
}
