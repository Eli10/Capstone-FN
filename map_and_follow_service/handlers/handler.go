package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"map_and_follow_service/helpers"
	"map_and_follow_service/nodes"
	"map_and_follow_service/types"

	"github.com/gorilla/mux"
)

func GetHello(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(types.Hello{Message: "Hi", OtherMessage: "Yoo"})
}

func CreateMapandUserMapRelationshipHandler(w http.ResponseWriter, r *http.Request) {
	// params := mux.Vars(r)
	var mr types.UserMapRelationship
	json.NewDecoder(r.Body).Decode(&mr)
	// m_r.Username = params["username"]
	// m_r.Mapname = params["mapname"]
	fmt.Println(mr)
	con := helpers.CreateConnection()
	st := helpers.PrepareStatement(nodes.CreateUserMapRelationship, con)
	helpers.ExecuteUserMapStatement(st, mr)
}

func GetAllUserMapsHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var user types.User
	user.Username = params["username"]
	con := helpers.CreateConnection()
	st := helpers.PrepareStatement(nodes.GetUserMapList, con)
	rows := helpers.QueryUserMapListStatement(st, user)
	fmt.Println(rows)
	results := helpers.ConsumeUserMapRows(rows, st)
	fmt.Println(results)

	var maplist []types.UserMapRelationship
	// fmt.Println(results.([]string))
	for _, l := range results.([][]interface{}) {
		// inner_l := l.([]string)
		// fmt.Printf("Type of the Data: %T\n", l)
		// fmt.Println(l[0])
		u_r := types.UserMapRelationship{Username: l[0].(string), Mapname: l[1].(string)}
		maplist = append(maplist, u_r)
		// for _, r := range l.([]interface{}) {
		// 	fmt.Println(r)
		// }
	}
	// fmt.Println(list)
	// fmt.Println(maplist)
	// list.List = maplist
	// fmt.Println(list)
	// json.Marshal(maplist)
	json.NewEncoder(w).Encode(types.MapList{List: maplist})

}

func UserFollowHandler(w http.ResponseWriter, r *http.Request) {
	var userFollow types.UserFollowUserRelationship
	json.NewDecoder(r.Body).Decode(&userFollow)
	fmt.Println(userFollow)
	con := helpers.CreateConnection()
	st := helpers.PrepareStatement(nodes.CreateUserFollowRelationship, con)
	helpers.ExecuteUserFollowStatement(st, userFollow)
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
	// new_string := fmt.Sprintf(GetNode2, params["name"])
	// fmt.Println(new_string)
	// fmt.Println(GetNode)
	var my_map types.Map
	my_map.Name = params["name"]
	fmt.Println(my_map)
	con := helpers.CreateConnection()
	st := helpers.PrepareStatement(nodes.GetMapNode, con)
	fmt.Println(st)
	rows := helpers.QueryMapStatement(st, my_map)
	result := helpers.ConsumeRows(rows, st)
	fmt.Println(result)
	var result_map types.Map
	result_map.Name = result.(string)
	fmt.Println(result_map)
	json.NewEncoder(w).Encode(result_map)
	// json.Marshal(result_map)
}
