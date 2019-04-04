package helpers

import (
	"fmt"
	"restaurant_service/nodes"
	"restaurant_service/types"

	bolt "github.com/johnnadratowski/golang-neo4j-bolt-driver"
	"github.com/johnnadratowski/golang-neo4j-bolt-driver/structures/graph"
)

func CreateConnection() bolt.Conn {
	driver := bolt.NewDriver()
	con, err := driver.OpenNeo(nodes.URI)
	HandleError(err)
	return con
}

func PrepareStatement(query string, con bolt.Conn) bolt.Stmt {
	st, err := con.PrepareNeo(query)
	HandleError(err)
	return st
}
func HandleError(err error) {
	if err != nil {
		panic(err)
		// return ErrorMessage{Message: err.Error()}
	}
}

func ConsumeRows(rows bolt.Rows, st bolt.Stmt) ( interface{}, []interface{}) {
	// This interface allows you to consume rows one-by-one, as they
	// come off the bolt stream. This is more efficient especially
	// if you're only looking for a particular row/set of rows, as
	// you don't need to load up the entire dataset into memory
	data, _, err := rows.NextNeo()
	HandleError(err)
	fmt.Println(data)
	fmt.Printf("COLUMNS: %#v\n", rows.Metadata()["fields"].([]interface{}))
	fmt.Printf("FIELDS: %s \n", data[0].(string))

	// This query only returns 1 row, so once it's done, it will return
	// the metadata associated with the query completion, along with
	// io.EOF as the error
	// _, _, err = rows.NextNeo()
	// handleError(err)
	// fmt.Printf("COLUMNS: %#v\n", rows.Metadata()["fields"].([]interface{})) // COLUMNS: n.foo,n.bar
	// fmt.Printf("FIELDS: %s \n", data[0].(string))                           // FIELDS: 1 2.2

	st.Close()
	return data[0], data[1].([]interface{})
}

func CreateRestaurantList(list []interface{}) []types.Restaurant {
	var restaurant_list []types.Restaurant

	for _, r := range list {
		restuatant_node := r.(graph.Node)
		restaurant_data := restuatant_node.Properties
		fmt.Println("DATA", restaurant_data)
		fmt.Printf("Type of the Data: %T\n", restaurant_data)
		restaurant_list = append(restaurant_list, types.Restaurant{
											Name: restaurant_data["name"].(string),
											Address: restaurant_data["address"].(string),
											Lat: restaurant_data["lat"].(float64),
											Lon: restaurant_data["lon"].(float64)})
	}

	return restaurant_list
}

func CreateRestaurant(data interface{}) types.Restaurant {
	var res types.Restaurant

	restuarant_node := data.(graph.Node)
	restaurant_data := restuarant_node.Properties
	fmt.Println(restaurant_data)
	fmt.Printf("Type of the Data: %T\n", restaurant_data)
	res.Name = restaurant_data["name"].(string)
	res.Address = restaurant_data["address"].(string)
	res.Lat =  restaurant_data["lat"].(float64)
	res.Lon =  restaurant_data["lon"].(float64)

	return res
}

func QueryRestaurantNameList(st bolt.Stmt) bolt.Rows {
	rows, err := st.QueryNeo(map[string]interface{}{})
	HandleError(err)
	return rows
}

func QueryRestaurantName(st bolt.Stmt, obj types.Restaurant) bolt.Rows {
	rows, err := st.QueryNeo(map[string]interface{}{"restaurant_name": obj.Name})
	HandleError(err)
	return rows
}

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

func QueryRestaurantID(st bolt.Stmt, obj types.Restaurant) bolt.Rows {
	rows, err := st.QueryNeo(map[string]interface{}{"restaurant_name": obj.Name, "address": obj.Address})
	HandleError(err)
	return rows

}

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
