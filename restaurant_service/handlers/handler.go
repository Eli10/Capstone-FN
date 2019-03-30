package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"restaurant_service/helpers"
	"restaurant_service/nodes"
	"restaurant_service/types"

	"github.com/gorilla/mux"
	"github.com/johnnadratowski/golang-neo4j-bolt-driver/structures/graph"
)

// Returns JSON for /hello endpoint
func GetHello(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(types.Hello{Message: "Hi", OtherMessage: "Yoo"})
}


// Creates JSON for /restaurants endpoint
func GetRestaurantListHandler(w http.ResponseWriter, r *http.Request) {
	var resList types.RestaurantList
	con := helpers.CreateConnection()
	st := helpers.PrepareStatement(nodes.GetRestaurants, con)
	rows := helpers.QueryRestaurantNameList(st)
	results := helpers.ConsumeRestaurantNameRows(rows, st)

	for _, l := range results.([][]interface{}) {
		fmt.Println(l)
		fmt.Printf("Type of Results %T\n", l)

		for _, r := range l {
			restuatant_node := r.(graph.Node)
			restaurant_data := restuatant_node.Properties
			fmt.Println("DATA", restaurant_data)
			fmt.Printf("Type of the Data: %T\n", restaurant_data)
			resList.RestaurantList = append(resList.RestaurantList, types.Restaurant{
												Name: restaurant_data["name"].(string),
												Address: restaurant_data["address"].(string),
												Lat: restaurant_data["lat"].(float64),
												Lon: restaurant_data["lon"].(float64)})
		}
	}
	fmt.Println(resList)
	json.NewEncoder(w).Encode(resList)

}


// Creates JSON for /restaurants/{restaurant_name} endpoint
func GetRestaurantHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var res types.Restaurant
	res.Name = params["restaurant_name"]
	con := helpers.CreateConnection()
	st := helpers.PrepareStatement(nodes.GetRestaurant, con)
	// fmt.Println(params["restaurant_name"])
	rows := helpers.QueryRestaurantName(st, res)
	fmt.Println(rows)
	results := helpers.ConsumeRestaurant(rows, st)
	fmt.Println(results)

	for _, l := range results.([][]interface{}) {
		// data := l[0].(graph.Node)
		fmt.Println(l[0])
		res = helpers.CreateRestaurant(l[0])

	}
	json.NewEncoder(w).Encode(res)


}


func GetRestaurantIdHandler(w http.ResponseWriter, r *http.Request) {
	var res types.Restaurant
	params := mux.Vars(r)
	restaurant_name := params["restaurant_name"]
	address := params["address"]
	res.Name = restaurant_name
	res.Address = address
	con := helpers.CreateConnection()
	st := helpers.PrepareStatement(nodes.GetRestaurantId, con)
	rows := helpers.QueryRestaurantID(st, res)
	fmt.Println(rows)
	results := helpers.ConsumeRestaurantIDRows(rows, st)
	fmt.Println(results)

	var id int64
	for _, num := range results.([]interface{}) {
		id = num.(int64)
		fmt.Println(id)
	}
	json.NewEncoder(w).Encode(types.RestaurantId{ID: id})



}
