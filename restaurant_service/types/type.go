package types

type Hello struct {
	Message      string      `json:"message,omitempty"`
	OtherMessage interface{} `json:"othermessage"`
}

type User struct {
	Username string `json:"username"`
}

type RestaurantList struct {
	RestaurantList []Restaurant `json:"restaurants"`
}

type RestaurantId struct {
	ID int64 `json:"id"`
}

type Restaurant struct {
	Name 		string `json:"restaurant_name"`
	Address string `json:"address"`
	Lat 		float64 	`json:"lat,omitempty"`
	Lon 		float64 	`json:"lon,omitempty"`
}


type ErrorMessage struct {
	Message string `json:"message"`
}
