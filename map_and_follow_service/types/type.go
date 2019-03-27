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

type MapList struct {
	List []Map `json:"maps"`
}

type MapNameList struct {
	MapList []string `json:"map_names"`
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
