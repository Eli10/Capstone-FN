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

// Returns JSON for /hello endpoint
func GetHello(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(types.Hello{Message: "Hi", OtherMessage: "Yoo"})
}


// Creates JSON for /maps/ endpoint
func CreateMapandUserMapRelationshipHandler(w http.ResponseWriter, r *http.Request) {
	var mr types.UserMapRelationship
	json.NewDecoder(r.Body).Decode(&mr)
	fmt.Println(mr)
	con := helpers.CreateConnection()
	st := helpers.PrepareStatement(nodes.CreateUserMapRelationship, con)
	helpers.ExecuteUserMapStatement(st, mr)
}

// Creates JSON for /maps/{username} endpoint
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

// Creates JSON for /maps/contain POST endpoint
func MapsContainsHandler(w http.ResponseWriter, r *http.Request) {
	var mapContains types.MapRestaurantRelationship
	json.NewDecoder(r.Body).Decode(&mapContains)
	con := helpers.CreateConnection()
	st := helpers.PrepareStatement(nodes.CreateMapRestaurantRelationship, con)
	helpers.ExecuteMapContainsStatement(st, mapContains)
}

// Creates JSON for /maps/contain DELETE endpoint
func RemoveMapsContainsHandler(w http.ResponseWriter, r *http.Request) {
	var mapContains types.MapRestaurantRelationship
	json.NewDecoder(r.Body).Decode(&mapContains)
	fmt.Println(mapContains)
	fmt.Printf("%T\n", mapContains.RestaurantID)
	con := helpers.CreateConnection()
	st := helpers.PrepareStatement(nodes.RemoveMapRestaurantRelationship, con)
	helpers.ExecuteMapContainsStatement(st, mapContains)
}



// Creates JSON for /maps/name/{username} endpoint
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




// ----------------------------------------------

// POST Method Handler for /maps/{name}
// Takes name and uses it to create a Map Node with a name property
func PostMap(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var my_map types.Map
	my_map.Name = params["name"]
	con := helpers.CreateConnection()
	st := helpers.PrepareStatement(nodes.CreateNode, con)
	helpers.ExecuteMapStatement(st, my_map)
}

// Get Method Handler for /maps/{name}
// Takes name and uses it to find Map Node with same name property
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
