package main

import (
	"log"
	"net/http"
	"os"
	"fmt"

	"map_service/handlers"

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

	// Gets all Friends Maps for a User
	router.HandleFunc("/maps/follow/{username}", handlers.GetAllFriendsMapsHandler).Methods("GET")

	// Removes CONTAINS Relationship between Maps and Restuarants
	// JSON Body -> {"mapname": string, "restaurant_id": int}
	router.HandleFunc("/maps/contain", handlers.RemoveMapsContainsHandler).Methods("DELETE")

	// Test Create a Map Node
	router.HandleFunc("/map/{name}", handlers.PostMap).Methods("POST")

	// Test Get a Map by Name
	router.HandleFunc("/map/{name}", handlers.GetMap).Methods("GET")


	port := os.Getenv("PORT") //Get port from .env file, we did not specify any port so this should return an empty string when tested locally
	if port == "" {
		port = "8000" //localhost
	}

	fmt.Println(port)

	log.Fatal(http.ListenAndServe(":" + port, router)) //Launch the app, visit localhost:8000/api
	// if err != nil {
	// 	fmt.Print(err)
	// }


	// log.Fatal(http.ListenAndServe(":8000", router))
}
