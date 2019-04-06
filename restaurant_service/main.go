package main

import (
	"log"
	"net/http"
	"os"
	"fmt"

	"restaurant_service/handlers"

	"github.com/gorilla/mux"
)

// our main function
func main() {
	router := mux.NewRouter()

	// Test Hello
	router.HandleFunc("/hello", handlers.GetHello).Methods("GET")

	// Returns list of restaurants object with ({restaurant_name and address}) for searching purposes
	router.HandleFunc("/restaurants", handlers.GetRestaurantListHandler).Methods("GET")

	// Returns restaurant data for a restaurant name given
	router.HandleFunc("/restaurants/{restaurant_name}", handlers.GetRestaurantHandler).Methods("GET")

	// Returns Node Id for a restaurant using name and address
	router.HandleFunc("/restaurants/id/{restaurant_name}/{address}", handlers.GetRestaurantIdHandler).Methods("GET")

	// Return possible restaurant for user to add to a map
	router.HandleFunc("/restaurants/discover/{username}", handlers.GetDiscoveredRestaurantHandler).Methods("GET")

	port := os.Getenv("PORT") //Get port from .env file, we did not specify any port so this should return an empty string when tested locally
	if port == "" {
		port = "8001" //localhost
	}

	fmt.Println(port)

	log.Fatal(http.ListenAndServe(":" + port, router)) //Launch the app, visit localhost:8000/api
	// if err != nil {
	// 	fmt.Print(err)
	// }


	// log.Fatal(http.ListenAndServe(":8000", router))
}
