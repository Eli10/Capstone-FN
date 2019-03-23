package types

type Hello struct {
	Message      string      `json:"message,omitempty"`
	OtherMessage interface{} `json:"othermessage"`
}

type Map struct {
	Name string `json:"name,omitempty"`
	RestaurantList []Restaurant `json:"restaurants"`
}

type RestaurantList struct {
	NameList []string `json:"restaurants"`
}

type Restaurant struct {
	Name 		string `json:"restaurant_name"`
	Address string `json:"address"`
	Lat 		float64 	`json:"lat"`
	Lon 		float64 	`json:"lon"`
}

type MapList struct {
	List []Map `json:"maps"`
}

type User struct {
	Username string `json:"username"`
}

type ErrorMessage struct {
	Message string `json:"message"`
}

type UserMapRelationship struct {
	Username string `json:"username"`
	Mapname  string `json:"mapname"`
}

type UserFollowUserRelationship struct {
	Username string `json:"username"`
	Follows  string `json:"follows"`
}

type MapRestaurantRelationship struct {
	Mapname string `json:"mapname"`
	RestaurantID int `json:"restaurant_id"`
}
