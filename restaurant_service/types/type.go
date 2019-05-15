package types

/*
Object representing Hello Message
*/
type Hello struct {
	Message      string      `json:"message,omitempty"`
	OtherMessage interface{} `json:"othermessage"`
}

/*
Object representing Authorized Message
*/
type Authorized struct {
	Message string `json:"message"`
}

/*
Object representing a User
*/
type User struct {
	Username string `json:"username"`
}

/*
Object representing a List of Restaurants
*/
type RestaurantList struct {
	RestaurantList []Restaurant `json:"restaurants"`
}

/*
Object representing a Restaurant ID
*/
type RestaurantId struct {
	ID int64 `json:"id"`
}

/*
Object representing a Restuarant
*/
type Restaurant struct {
	Name    string  `json:"name"`
	Address string  `json:"address"`
	Lat     float64 `json:"lat,omitempty"`
	Lon     float64 `json:"lon,omitempty"`
}

/*
Object representing a Error Message
*/
type ErrorMessage struct {
	Message string `json:"message"`
}
