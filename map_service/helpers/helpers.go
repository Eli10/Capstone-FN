package helpers

import (
	"fmt"
	"map_service/nodes"
	"map_service/types"

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

func ExecuteMapContainsStatement(st bolt.Stmt, obj types.MapRestaurantRelationship) {
	result, err := st.ExecNeo(map[string]interface{}{"restaurant_id": obj.RestaurantID, "mapname": obj.Mapname})
	HandleError(err)
	numResult, err := result.RowsAffected()
	HandleError(err)
	fmt.Printf("CREATED ROWS: %d\n", numResult)

	// Closing the statment will also close the rows
	st.Close()
}

func ExecuteUserMapStatement(st bolt.Stmt, obj types.UserMapRelationship) {
	result, err := st.ExecNeo(map[string]interface{}{"username": obj.Username, "mapname": obj.Mapname})
	HandleError(err)
	numResult, err := result.RowsAffected()
	HandleError(err)
	fmt.Printf("CREATED ROWS: %d\n", numResult)

	// Closing the statment will also close the rows
	st.Close()
}

func QueryUserMapListStatement(st bolt.Stmt, obj types.User) bolt.Rows {
	// Even once I get the rows, if I do not consume them and close the
	// rows, Neo will discard and not send the data
	rows, err := st.QueryNeo(map[string]interface{}{"username": obj.Username})
	HandleError(err)
	return rows
}

func ConsumeUserMapRows(rows bolt.Rows, st bolt.Stmt) interface{} {
	// This interface allows you to consume rows one-by-one, as they
	// come off the bolt stream. This is more efficient especially
	// if you're only looking for a particular row/set of rows, as
	// you don't need to load up the entire dataset into memory
	data, _, err := rows.All()
	HandleError(err)
	fmt.Println("DATA: ",data, "\n")
	fmt.Printf("COLUMNS: %#v\n", rows.Metadata()["fields"].([]interface{}))
	// fmt.Printf("FIELDS: %s %s \n", data[0].(string), data[1].(string))

	st.Close()
	fmt.Printf("Type of the Data: %T", data)
	return data
}

// Executing a statement just returns summary information
func ExecuteMapStatement(st bolt.Stmt, obj types.Map) {
	result, err := st.ExecNeo(map[string]interface{}{"name": obj.Name})
	HandleError(err)
	numResult, err := result.RowsAffected()
	HandleError(err)
	fmt.Printf("CREATED ROWS: %d\n", numResult) // CREATED ROWS: 1

	// Closing the statment will also close the rows
	st.Close()
}

func QueryMapStatement(st bolt.Stmt, obj types.Map) bolt.Rows {
	// Even once I get the rows, if I do not consume them and close the
	// rows, Neo will discard and not send the data
	fmt.Println(st)
	rows, err := st.QueryNeo(map[string]interface{}{"name": obj.Name})
	HandleError(err)
	return rows
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



func QueryMapNameList(st bolt.Stmt, obj types.User) bolt.Rows {
	rows, err := st.QueryNeo(map[string]interface{}{"username": obj.Username})
	HandleError(err)
	return rows
}

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
