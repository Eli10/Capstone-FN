package main

import (
	"log"
	"net/http"

	"map_and_follow_service/handlers"

	"github.com/gorilla/mux"
)

// our main function
func main() {
	router := mux.NewRouter()

	// Test Hello
	router.HandleFunc("/hello", handlers.GetHello).Methods("GET")

	// Create Map for User and The Relationship b/w User and Map
	// JSON Body -> {"username": string, "mapname": string}
	router.HandleFunc("/maps/", handlers.CreateMapandUserMapRelationshipHandler).Methods("POST")

	// Gets all Maps for a User
	// Map must have relations to restaurants. For the map to get returned in the query
	router.HandleFunc("/maps/{username}", handlers.GetAllUserMapsHandler).Methods("GET")

	// Return list of map names for user
	// Use this for any map downdown functions
	router.HandleFunc("/maps/name/{username}" , handlers.GetAllUserMapNamesHandler).Methods("GET")

	// Creates CONTAINS Relationship between Maps and Restuarants
	// JSON Body -> {"mapname": string, "restaurant_id": int}
	router.HandleFunc("/maps/contain", handlers.MapsContainsHandler).Methods("POST")

	// Removes CONTAINS Relationship between Maps and Restuarants
	// JSON Body -> {"mapname": string, "restaurant_id": int}
	router.HandleFunc("/maps/contain", handlers.RemoveMapsContainsHandler).Methods("DELETE")

	// Creates Follow Relationship between Users
	// JSON Body -> {"username": string, "follow": string}
	router.HandleFunc("/users/follow", handlers.UserFollowHandler).Methods("POST")

	// Returns list of restaurants object with ({restaurant_name and address}) for searching purposes
	router.HandleFunc("/restaurants", handlers.GetRestaurantListHandler).Methods("GET")

	// Returns restaurant data for a restaurant name given
	router.HandleFunc("/restaurants/{restaurant_name}", handlers.GetRestaurantHandler).Methods("GET")

	// Returns Node Id for a restaurant using name and address
	router.HandleFunc("/restaurants/id/{restaurant_name}/{address}", handlers.GetRestaurantIdHandler).Methods("GET")

	// Test Create a Map Node
	router.HandleFunc("/map/{name}", handlers.PostMap).Methods("POST")

	// Test Get a Map by Name
	router.HandleFunc("/map/{name}", handlers.GetMap).Methods("GET")


	log.Fatal(http.ListenAndServe(":8000", router))
}
