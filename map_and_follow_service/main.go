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

	// Create Map for User and The Relationship b/w User and Map {"username": string, "mapname": string}
	router.HandleFunc("/maps/", handlers.CreateMapandUserMapRelationshipHandler).Methods("POST")

	// Gets all Maps for a User
	router.HandleFunc("/maps/{username}", handlers.GetAllUserMapsHandler).Methods("GET")

	// Creates CONTAINS Relationship between Maps and Restuarants {"username": string, "restaurant_id": int}
	router.HandleFunc("/maps/contain", handlers.MapsContainsHandler).Methods("POST")

	// Removes CONTAINS Relationship between Maps and Restuarants {"username": string, "restaurant_id": int}
	router.HandleFunc("/maps/contain", handlers.RemoveMapsContainsHandler).Methods("DELETE")

	// Creates Follow Relationship between Users {"username": string, "follow": string}
	router.HandleFunc("/users/follow", handlers.UserFollowHandler).Methods("POST")




	// Test Create a Map Node
	router.HandleFunc("/map/{name}", handlers.PostMap).Methods("POST")

	// Test Get a Map by Name
	router.HandleFunc("/map/{name}", handlers.GetMap).Methods("GET")

	log.Fatal(http.ListenAndServe(":8000", router))
}
