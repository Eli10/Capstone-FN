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

/*
This method takes a http request.

@param httpRequest This is the first paramter to GetHello method

@return json
*/
func GetHello(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(types.Hello{Message: "Hi", OtherMessage: "Yoo"})
}

/*
This method takes a http request.

@param httpRequest This is the first paramter to GetRestaurantListHandler method

@return json Returns a List of Restaurants
*/
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
				Name:    restaurant_data["name"].(string),
				Address: restaurant_data["address"].(string),
				Lat:     restaurant_data["lat"].(float64),
				Lon:     restaurant_data["lon"].(float64)})
		}
	}
	fmt.Println(resList)
	json.NewEncoder(w).Encode(resList)

}

/*
This method takes a http request from /restaurants/{restaurant_name}.

@param httpRequest This is the first paramter to GetRestaurantHandler method

@return json Returns a Restaurant
*/
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

/*
This method takes a http request from /restaurants/id/{restaurant_name}/{address}.

@param httpRequest This is the first paramter to GetRestaurantHandler method

@return json Returns the id of Restaurant
*/
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

/*
This method takes a http request from /restaurants/discover/{username}.

@param httpRequest This is the first paramter to GetRestaurantHandler method

@return json Returns Recommened Restaurant for a User
*/
func GetDiscoveredRestaurantHandler(w http.ResponseWriter, r *http.Request) {
	var user types.User
	var resList types.RestaurantList
	params := mux.Vars(r)
	user.Username = params["username"]
	con := helpers.CreateConnection()
	st := helpers.PrepareStatement(nodes.GetDiscoveredRestaurant, con)
	rows := helpers.QueryDiscover(st, user)
	fmt.Println(rows)
	results := helpers.ConsumeRestaurant(rows, st)
	fmt.Println(results)

	for _, l := range results.([][]interface{}) {
		fmt.Println(l)
		fmt.Printf("Type of Results %T\n", l)

		for _, r := range l {
			restuatant_node := r.(graph.Node)
			restaurant_data := restuatant_node.Properties
			fmt.Println("DATA", restaurant_data)
			fmt.Printf("Type of the Data: %T\n", restaurant_data)
			resList.RestaurantList = append(resList.RestaurantList, types.Restaurant{
				Name:    restaurant_data["name"].(string),
				Address: restaurant_data["address"].(string),
				Lat:     restaurant_data["lat"].(float64),
				Lon:     restaurant_data["lon"].(float64)})
		}
	}

	if len(resList.RestaurantList) == 0 {
		var noRestaurant []types.Restaurant
		resList.RestaurantList = noRestaurant
	}

	json.NewEncoder(w).Encode(resList)

}
