/*
The Restaurant Micoservice

All requests dealing with manipulating or getting restaurants
get processsed through here.

@author  Elijah Augustin

@version 1.0

@since   2019-02-01

JWT Secret Key

Getting from Environment Variables
 	var envKey = os.Getenv("JWT_SECRET_KEY")
	var mySigningKey = []byte(envKey)
Then converts it to list of bytes


IsAuthorized

This method takes a http request.
First checks if request has a authenticaion value in headers.
Then authenticates the token in header.

@param httpRequest This is the first paramter to isAuthorized method

@return httpHandler Another type of request
	func isAuthorized(endpoint func(http.ResponseWriter, *http.Request)) http.Handler

Hello Endpoint

This method takes a http Handler object and routes the Handler to the proper function.
	router.Handle("/hello", isAuthorized(handlers.GetHello)).Methods("GET")

Restaurant Endpoint

This method takes a http Handler object and returns list of restaurants object
with ({restaurant_name and address}) for searching purposes
	router.Handle("/restaurants", isAuthorized(handlers.GetRestaurantListHandler)).Methods("GET")

Restaurant Data By Restauran Name Endpoint

This method takes a http Handler object and returns restaurant data for a restaurant name given
	router.Handle("/restaurants/{restaurant_name}", isAuthorized(handlers.GetRestaurantHandler)).Methods("GET")

Restaurant Id Endpoint

This method takes a http Handler object and returns the node id for a restaurant using name and address
	router.Handle("/restaurants/id/{restaurant_name}/{address}", isAuthorized(handlers.GetRestaurantIdHandler)).Methods("GET")

Discover Endpoint

This method takes a http Handler object and returns possible restaurants for user to add to a map
	router.Handle("/restaurants/discover/{username}", isAuthorized(handlers.GetDiscoveredRestaurantHandler)).Methods("GET")
*/
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"restaurant_service/handlers"
	"restaurant_service/types"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
)

/**
* JWT Secret Key
 */
var envKey = os.Getenv("JWT_SECRET_KEY")
var mySigningKey = []byte(envKey)

/**
* This method takes a http request.
* First checks if request has a authenticaion value in headers.
* Then authenticates the token in header.
* @param httpRequest This is the first paramter to isAuthorized method
* @return httpHandler Another type of request
 */
func isAuthorized(endpoint func(http.ResponseWriter, *http.Request)) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		if r.Header["Authorization"] != nil {

			authorization_values := r.Header["Authorization"][0]
			token_values := strings.Fields(authorization_values)
			if token_values[0] != "Bearer" {
				// return json.NewEncoder(w).Encode(types.Authorized{Message: "Token Error. Missing Bearer identifier."})
			}

			jwt_token := token_values[1]
			fmt.Println(jwt_token)

			token, err := jwt.Parse(jwt_token, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("There was an error")
				}
				return mySigningKey, nil
			})

			if err != nil {
				json.NewEncoder(w).Encode(types.Authorized{Message: "Token Error. Not Authorized"})
			}

			if token.Valid {
				endpoint(w, r)
			}
		} else {
			json.NewEncoder(w).Encode(types.Authorized{Message: "Not Authorized"})
		}
	})
}

/**
* This our main method. Entrypoint to the API
* Has many Handlers for different routes
 */
func main() {
	router := mux.NewRouter()

	// Test Hello
	router.Handle("/hello", isAuthorized(handlers.GetHello)).Methods("GET")

	// Returns list of restaurants object with ({restaurant_name and address}) for searching purposes
	router.Handle("/restaurants", isAuthorized(handlers.GetRestaurantListHandler)).Methods("GET")

	// Returns restaurant data for a restaurant name given
	router.Handle("/restaurants/{restaurant_name}", isAuthorized(handlers.GetRestaurantHandler)).Methods("GET")

	// Returns Node Id for a restaurant using name and address
	router.Handle("/restaurants/id/{restaurant_name}/{address}", isAuthorized(handlers.GetRestaurantIdHandler)).Methods("GET")

	// Return possible restaurant for user to add to a map
	router.Handle("/restaurants/discover/{username}", isAuthorized(handlers.GetDiscoveredRestaurantHandler)).Methods("GET")

	port := os.Getenv("PORT") //Get port from .env file, we did not specify any port so this should return an empty string when tested locally
	if port == "" {
		port = "8001" //localhost
	}

	fmt.Println(port)

	log.Fatal(http.ListenAndServe(":"+port, router)) //Launch the app, visit localhost:8000/api
	// if err != nil {
	// 	fmt.Print(err)
	// }

	// log.Fatal(http.ListenAndServe(":8000", router))
}
