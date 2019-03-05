package types

type Hello struct {
	Message      string      `json:"message,omitempty"`
	OtherMessage interface{} `json:"othermessage"`
}

type Map struct {
	Name string `json:"name,omitempty"`
}

type MapList struct {
	List []UserMapRelationship `json:"maps"`
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
