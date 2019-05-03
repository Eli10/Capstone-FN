package types

/**
* Object representing Hello Message
*/
type Hello struct {
	Message      string      `json:"message,omitempty"`
	OtherMessage interface{} `json:"othermessage"`
}

/**
* Object representing Authorized Message
*/
type Authorized struct {
	Message      string      `json:"message"`
}

/**
* Object representing a Map
*/
type Map struct {
	Name string `json:"name,omitempty"`
	RestaurantList []Restaurant `json:"restaurants"`
}

/**
* Object representing a List of Maps
*/
type MapList struct {
	List []Map `json:"maps"`
}

/**
* Object representing a List of Map Names
*/
type MapNameList struct {
	MapList []string `json:"map_names"`
}

/**
* Object representing a User
*/
type User struct {
	Username string `json:"username"`
}

/**
* Object representing a Error Message
*/
type ErrorMessage struct {
	Message string `json:"message"`
}

/**
* Object representing User to Map Relationship
*/
type UserMapRelationship struct {
	Username string `json:"username"`
	Mapname  string `json:"mapname"`
}

/**
* Object representing Map to Restuarant Relationship
*/
type MapRestaurantRelationship struct {
	Mapname string `json:"mapname"`
	RestaurantID int `json:"restaurant_id"`
}

/**
* Object representing a Restuarant
*/
type Restaurant struct {
	Name 		string `json:"name"`
	Address string `json:"address"`
	Lat 		float64 	`json:"lat,omitempty"`
	Lon 		float64 	`json:"lon,omitempty"`
}
