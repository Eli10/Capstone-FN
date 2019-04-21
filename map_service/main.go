/**
* The Map Micoservice
* All map requests come through here.
*
* @author  Elijah Augustin
* @version 1.0
* @since   2019-02-01
*/
package main

import (
	"log"
	"net/http"
	"encoding/json"
	"os"
	"fmt"
	"strings"

	"map_service/handlers"
	"map_service/types"

	"github.com/gorilla/mux"
	jwt "github.com/dgrijalva/jwt-go"
)

/**
* JWT Secret Key
*/
var mySigningKey = []byte("very-secret-token-string")

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
	router.Handle("/hello", isAuthorized(handlers.GetHello) ).Methods("GET")

	// Create Map for User and The Relationship b/w User and Map
	// JSON Body -> {"username": string, "mapname": string}
	router.Handle("/maps/", isAuthorized(handlers.CreateMapandUserMapRelationshipHandler) ).Methods("POST")

	// Gets all Maps for a User
	// Map must have relations to restaurants. For the map to get returned in the query
	router.Handle("/maps/{username}", isAuthorized(handlers.GetAllUserMapsHandler) ).Methods("GET")

	// Return list of map names for user
	// Use this for any map downdown functions
	router.Handle("/maps/name/{username}" , isAuthorized(handlers.GetAllUserMapNamesHandler)).Methods("GET")

	// Creates CONTAINS Relationship between Maps and Restuarants
	// JSON Body -> {"mapname": string, "restaurant_id": int}
	router.Handle("/maps/contain", isAuthorized(handlers.MapsContainsHandler)).Methods("POST")

	// Gets all Friends Maps for a User
	router.Handle("/maps/follow/{username}", isAuthorized(handlers.GetAllFriendsMapsHandler)).Methods("GET")

	// Removes CONTAINS Relationship between Maps and Restuarants
	// JSON Body -> {"mapname": string, "restaurant_id": int}
	router.Handle("/maps/contain", isAuthorized(handlers.RemoveMapsContainsHandler)).Methods("DELETE")

	// Test Create a Map Node
	router.Handle("/map/{name}", isAuthorized(handlers.PostMap)).Methods("POST")

	// Test Get a Map by Name
	router.Handle("/map/{name}", isAuthorized(handlers.GetMap)).Methods("GET")


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
