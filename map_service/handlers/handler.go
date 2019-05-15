package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"map_service/helpers"
	"map_service/nodes"
	"map_service/types"

	"github.com/gorilla/mux"
)

/*
This method takes a http request from the /hello

@param httpRequest This is the first paramter to GetHello method

@return None
*/
func GetHello(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(types.Hello{Message: "Hi", OtherMessage: "Yoo"})
}

/*
This method takes a http request from /maps/. Creates the relationship between Users and Maps

@param httpRequest This is the first paramter to CreateMapandUserMapRelationshipHandler method

@return None
*/
func CreateMapandUserMapRelationshipHandler(w http.ResponseWriter, r *http.Request) {
	var mr types.UserMapRelationship
	json.NewDecoder(r.Body).Decode(&mr)
	fmt.Println(mr)
	con := helpers.CreateConnection()
	st := helpers.PrepareStatement(nodes.CreateUserMapRelationship, con)
	helpers.ExecuteUserMapStatement(st, mr)
}

/*
This method takes a http request from /maps/{username}

@param httpRequest This is the first paramter to GetAllUserMapsHandler method

@return json Returns all the maps for a Users
*/
func GetAllUserMapsHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var user types.User
	user.Username = params["username"]
	con := helpers.CreateConnection()
	st := helpers.PrepareStatement(nodes.GetUserMapList, con)
	rows := helpers.QueryUserMapListStatement(st, user)
	fmt.Println("ROWS: ", rows.Metadata(), "\n")
	results := helpers.ConsumeUserMapRows(rows, st)
	fmt.Println("\nRESULTS: ", results, "\n")

	var maplist []types.Map
	for _, l := range results.([][]interface{}) {
		restaurant_list := helpers.CreateRestaurantList(l[1].([]interface{}))
		u_r := types.Map{Name: l[0].(string), RestaurantList: restaurant_list}
		maplist = append(maplist, u_r)
	}
	json.NewEncoder(w).Encode(types.MapList{List: maplist})
}

/*
This method takes a http request from /maps/follow/{username}

@param httpRequest This is the first paramter to GetAllFriendsMapsHandler method

@return json Returns all the friend's maps for a Users
*/
func GetAllFriendsMapsHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var user types.User
	user.Username = params["username"]
	con := helpers.CreateConnection()
	st := helpers.PrepareStatement(nodes.GetUserFriendMap, con)
	rows := helpers.QueryUserMapListStatement(st, user)
	fmt.Println("ROWS: ", rows.Metadata(), "\n")
	results := helpers.ConsumeUserMapRows(rows, st)
	fmt.Println("\nRESULTS: ", results, "\n")

	var maplist []types.Map
	for _, l := range results.([][]interface{}) {
		restaurant_list := helpers.CreateRestaurantList(l[1].([]interface{}))
		u_r := types.Map{Name: l[0].(string), RestaurantList: restaurant_list}
		maplist = append(maplist, u_r)
	}
	json.NewEncoder(w).Encode(types.MapList{List: maplist})
}

/*
This method takes a http request from /map/contain.Creates the Relationship between Maps and Restaurants

@param httpRequest This is the first paramter to MapsContainsHandler method

@return None
*/
func MapsContainsHandler(w http.ResponseWriter, r *http.Request) {
	var mapContains types.MapRestaurantRelationship
	json.NewDecoder(r.Body).Decode(&mapContains)
	con := helpers.CreateConnection()
	st := helpers.PrepareStatement(nodes.CreateMapRestaurantRelationship, con)
	helpers.ExecuteMapContainsStatement(st, mapContains)
}

/*
This method takes a DELETE http request from /maps/contain. Removes the Relationship between Maps and Restaurants

@param httpRequest This is the first paramter to RemoveMapsContainsHandler method

@return None
*/
func RemoveMapsContainsHandler(w http.ResponseWriter, r *http.Request) {
	var mapContains types.MapRestaurantRelationship
	json.NewDecoder(r.Body).Decode(&mapContains)
	fmt.Println(mapContains)
	fmt.Printf("%T\n", mapContains.RestaurantID)
	con := helpers.CreateConnection()
	st := helpers.PrepareStatement(nodes.RemoveMapRestaurantRelationship, con)
	helpers.ExecuteMapContainsStatement(st, mapContains)
}

/*
This method takes a http request from /maps/name/{username}

@param httpRequest This is the first paramter to GetAllUserMapNamesHandler method

@return MapList a list of user map names
*/
func GetAllUserMapNamesHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var mapList types.MapNameList
	var user types.User
	user.Username = params["username"]
	con := helpers.CreateConnection()
	st := helpers.PrepareStatement(nodes.GetUserMapNameList, con)
	rows := helpers.QueryMapNameList(st, user)

	fmt.Printf("%T\n", rows)
	fmt.Println(rows)

	results := helpers.ConsumeMapNameRows(rows, st)

	fmt.Printf("%T\n", results)
	fmt.Println(results)

	for _, l := range results.([][]interface{}) {
		fmt.Println(l[0])
		mapList.MapList = append(mapList.MapList, l[0].(string))
	}
	fmt.Println(mapList)
	json.NewEncoder(w).Encode(mapList)
}

/*
This method takes a POST http request from /map/{name} and creates a Map

@param httpRequest This is the first paramter to GetAllUserMapNamesHandler method

@return None
*/
func PostMap(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var my_map types.Map
	my_map.Name = params["name"]
	con := helpers.CreateConnection()
	st := helpers.PrepareStatement(nodes.CreateNode, con)
	helpers.ExecuteMapStatement(st, my_map)
}

/*
This method takes a GET http request from /map/{name} returns a Map By name

@param httpRequest This is the first paramter to GetAllUserMapNamesHandler method

@return json Map Object
*/
func GetMap(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var my_map types.Map
	my_map.Name = params["name"]
	fmt.Println(my_map)
	con := helpers.CreateConnection()
	st := helpers.PrepareStatement(nodes.GetMapNode, con)
	fmt.Println(st)
	rows := helpers.QueryMapStatement(st, my_map)
	mapname, list := helpers.ConsumeRows(rows, st)
	fmt.Println(mapname)
	restaurant_list := helpers.CreateRestaurantList(list)
	var result_map types.Map
	result_map.Name = mapname.(string)
	result_map.RestaurantList = restaurant_list
	fmt.Println(result_map)
	json.NewEncoder(w).Encode(result_map)
}
