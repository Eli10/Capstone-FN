/**
Author: Alina Zhong
 file: this file implements the profile page, which is the fifth tab on the icon bar, as well as the page the login sends you to when you successfully login
 **/
import React from 'react';
import {
  Image,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
  Alert
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
import Icon from "react-native-vector-icons/Ionicons";
import {StackNavigator} from 'react-navigation';
import {Rating, AirbnbRating } from 'react-native-elements';
const timer = require('react-native-timer');
import StarRating from 'react-native-star-rating';

export default class ProfilePage extends React.Component {
        constructor(props) {
            super(props);
            const { navigation } = this.props;
            const { navigate } = this.props.navigation;
            const username = navigation.getParam('username', 'Blah');
            const access_token = navigation.getParam('access_token', 'Blah');
            const refresh_token = navigation.getParam('refresh_token', 'Blah');
            {console.log("Profile Params")};
            {console.log(this.props.navigation.state.params)};
            console.log(username);
            this.state={
                fname: '',
                lname: '',
                username: username,
                age: 0,
                gender: 'Unknown',
                favBorough: 'None',
                numOfFriends: 0,
                access_token: access_token,
                refresh_token: refresh_token,
                userMaps: [],
                userReviews: [],
            }
        }
/*logs out and redirects to login page*/
  logoutToLogin = () => {
    console.log("Trying to logout");
    this.props.navigation.navigate("Home");
  }
/*pulls user profile info from backend*/
  componentDidMount() {
    this.props.navigation.addListener('willFocus', (route) => {
      this.getUserProfile();
      this.getNumOfFriends();
      this.getMapsForUser();
      this.getRatings();
    });
/*gets new user token*/
    timer.setInterval(this, 'request-new-token', () => {
      console.log("need new token");
      this.getNewAccessToken()
    }, 720000)
  }

/*clears user token*/
  componentWillUnmount() {
    timer.clearTimeout(this);
  }
/*gets number of friends from backend*/
  getNumOfFriends = () => {
    let url = 'https://capstone-express-gateway.herokuapp.com/users/friends/' + this.state.username;
    console.log(url);
    var header = { 'Authorization': 'Bearer '.concat(this.state.access_token) };
    fetch(url, {
        method: 'GET',
        mode: 'no-cors',
        headers: header
    })
    .then((response) => response.json())
    .then((resData) => {
    this.setState({numOfFriends: resData.friends.length});
  })
    .catch((error) => console.log(error))
  }
/*fetches user map info from backend*/
  getMapsForUser = () => {
    let url = 'https://capstone-express-gateway.herokuapp.com/maps/name/' + this.state.username;
    console.log(url);
    var header = { 'Authorization': 'Bearer '.concat(this.state.access_token) };
    fetch(url, {
        method: 'GET',
        mode: 'no-cors',
        headers: header
    })
    .then((response) => response.json())
    .then((resData) => {
    this.setState({userMaps: resData.map_names});
  })
    .catch((error) => console.log(error))
  }
/*renders each map separate*/
  renderSeparator = () => {
      return (
        <View
          style={{
            height: 1,
            width: '100%',
            backgroundColor: '#CED0CE',
            marginLeft: '0%',
          }}
        />
      );
    };

    deleteReview = (usern, resID) => {
            var header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '.concat(this.state.access_token)
            };
            fetch('https://capstone-express-gateway.herokuapp.com/reviews', {
                method: 'DELETE',
                headers: header,
                body: JSON.stringify({
                    username: this.state.username,
                    restaurant_id: resID,
                }),
            })
                .then((response) => response.json())
                .catch(err => console.log(err))
        }


    getRestaurantId = (name,add) => {
        //this function is called when a user is trying to add a restaurant to
        //an existing map or to a new map
        //this function calls the restaurants/id/ endpoint to obtain the restaurant's id
        let url = 'https://capstone-express-gateway.herokuapp.com/restaurants/id/' + name + '/' + add;
        fetch(url, {
            method: 'GET',
            mode: 'no-cors',
            headers: { 'Authorization': 'Bearer '.concat(this.state.access_token) }
        })
            .then((response) => response.json())
            .then((resData) => {this.deleteReview(this.state.username, resData.id)}
            )
            .catch((error) => console.log(error))
    }

  deleteHandler = (name,add) =>{
        var usern = this.state.username;
          Alert.alert("Delete",
              "Delete this comment?",[
                  {text: 'Dismiss'}, {text:'Delete Comment', onPress: () =>
                      {
                          this.getRestaurantId(name,add);
                          this.props.navigation.navigate('Maps', {
                            
                          token: this.state.access_token,
                          user: this.state.username })
                      }}
              ],{cancelable: false},);



  }


/*fetches user review info from backend*/
  getRatings = () => {
      let url = 'https://capstone-express-gateway.herokuapp.com/reviews/user/' + this.state.username;
      console.log(url);
      fetch(url, {
          method: 'GET',
          mode: 'no-cors',
          headers: { 'Authorization': 'Bearer '.concat(this.state.access_token) }
      })
      .then((response) => response.json())
      .then((resData) => {this.setState({userReviews: resData.reviews})
      })
    .catch((error) => console.log(error))
  }

/*fetches user profile info from backend*/
  getUserProfile = () => {
    console.log("getting user profile")
    fetch (`https://capstone-express-gateway.herokuapp.com/users/${this.state.username}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: { 'Authorization': 'Bearer '.concat(this.state.access_token) }
    })
    .then((response) => response.json())
    .then((resData) => {
      this.setState({
        fname: resData.profile.fname,
        lname: resData.profile.lname,
        age: resData.profile.age,
        gender: resData.profile.gender,
        favBorough: resData.profile.favBorough
      });
    })
    .catch((error) => console.log(error))
  }

/*creates new access token*/
  getNewAccessToken = () => {
    console.log("getting new access token");
    fetch ('https://capstone-express-gateway.herokuapp.com/users/refresh-token', {
        method: 'GET',
        mode: 'no-cors',
        headers: { 'Authorization': 'Bearer '.concat(this.state.refresh_token) }
    })
    .then((response) => response.json())
    .then((resData) => {
      this.setState({access_token: resData.access_token});
      this.props.navigation.setParams({access_token: resData.access_token});
      console.log(this.state.access_token)
    })
    .catch((error) => console.log(error))
  }

  render() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
         <View style ={styles.header}>
             <Text style={styles.text}> {this.state.fname} {this.state.lname}</Text>
            <View style= {{width: 50}}/>
        </View>
        <View style ={styles.secondLine}>
            <View style= {{width: 20}}/>
             <Text> {this.state.age} yrs</Text>
             <Text> {this.state.gender}</Text>
             <View style= {{width: 50}}/>
            <View style= {{width: 50}}/>
        </View>
        <View style={styles.loc}>
            <View style= {{width: 35}}/>
            <Text>Friend Count: {this.state.numOfFriends} </Text>
            <Text> {this.state.favBorough} </Text>
            <View style= {{width: 45}}/>
            <View style= {{width: 45}}/>
        </View>
        <View>
          <View>
            <TouchableOpacity onPress={this.logoutToLogin}>
              <View style={styles.logoutContainer}>
                  <Text style={styles.logoutText}>Logout</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.mapTitle}>Maps</Text>
          </View>
          <FlatList
            extraData={this.state}
            data={this.state.userMaps}
            renderItem={({ item }) =>
            <TouchableOpacity>
              <View style={styles.mapNameContainer}>
                <Text style={styles.mapName}>{item}</Text>
              </View>
            </TouchableOpacity>
            }
            ItemSeparatorComponent={this.renderSeparator}
          />
        </View>
        <View style={{paddingTop: 100, alignItems:'center'}}>
          <Text style={styles.mapTitle}>Reviews</Text>
          <FlatList
            extraData={this.state}
            data={this.state.userReviews}
            renderItem={({ item }) =>
              <TouchableOpacity onPress={()=> {this.deleteHandler(item.restaurant_name, item.restaurant_address)}}>
                <View style={styles.mapNameContainer2}>
                  <Text style={styles.reviewText}> Rating:</Text>
                      <StarRating
                          disabled={true}
                          emptyStar="md-pizza"
                          fullStar="md-pizza"
                          iconSet="Ionicons"
                          maxStars={item.rating}
                          rating={this.state.customStarCount}
                          fullStarColor="red"
                          starSize={20}
                          emptyStarColor="red"
                      />
                  <Text style={styles.reviewText2}> {'\nRestaurant: '}
                  {item.restaurant_name}{'\n'}
                  {'Comment: '}{item.review}</Text>
                </View>

              </TouchableOpacity>
            }
            ItemSeparatorComponent={this.renderSeparator}
          />
        </View>




        </ScrollView>
    );
  }
}
/*style sheets for profile and review display*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
  	flexDirection: 'column',
    backgroundColor:'rgb(246,192,99)',
  },
  header: {
   alignItems:'center',
   justifyContent: 'space-around',
   paddingBottom: 5,
  },
  secondLine: {
   fontSize: 12,
   color: '#808080',
   justifyContent: 'space-around',
   paddingBottom: 5,
   alignItems:'center'
  },
  loc: {
   fontSize: 12,
   color: '#808080',
   borderBottomColor: '#696969',
   borderBottomWidth: 1,
   alignItems:'center',
   justifyContent: 'space-around',
   paddingBottom: 5,
  },
  text: {
   fontSize: 30,
   color: '#000000',
   fontWeight: 'bold',
   textAlign: 'center',
  },
  mapTitle: {
    color:"#0047ab",
    fontSize: 32,
    textAlign:'center',
  },
  mapNameContainer: {
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#F0FFFF',
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000',
    flexDirection:'row',
    textAlign:'left',
      justifyContent:'flex-start',
  },
    mapNameContainer2: {
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#F0FFFF',
        margin: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000000',
        flexDirection:'row',
        height:120,
        position:'relative',
        marginLeft:0,
        width: Dimensions.get('window').width - 10,
    },
  mapName: {
    fontSize: 16,
    marginLeft: 10,
  },
  reviewText: {
    fontSize: 16,
    paddingTop: 0,
    marginLeft:2,

  },
 reviewText2: {
    fontSize: 16,
    marginLeft:5,
    justifyContent:'flex-start',
    paddingTop: 0,
    position:'absolute',
    flex:1,
    top:2,
 },
  logoutText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  logoutContainer: {
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#B22222',
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
});
