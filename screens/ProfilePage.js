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
            const username = navigation.getParam('username', 'Blah');
            const access_token = navigation.getParam('access_token', 'Blah');
            const refresh_token = navigation.getParam('refresh_token', 'Blah');
            {console.log("Profile Params")};
            {console.log(this.props.navigation.state.params)};
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
      .then((resData) => {this.setState({userReviews: resData.reviews});
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
    console.log("getting new access token")
    fetch ('https://capstone-express-gateway.herokuapp.com/users/refresh-token', {
        method: 'GET',
        mode: 'no-cors',
        headers: { 'Authorization': 'Bearer '.concat(this.state.refresh_token) }
    })
    .then((response) => response.json())
    .then((resData) => {
      this.setState({access_token: resData.access_token});
      this.props.navigation.setParams({access_token: resData.access_token})
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
        <View style={{paddingTop: 100}}>
          <Text style={styles.mapTitle}>Reviews</Text>
          <FlatList
            extraData={this.state}
            data={this.state.userReviews}
            renderItem={({ item }) =>
              <TouchableOpacity>
                <View style={styles.mapNameContainer}>
                  <Text style={styles.reviewText}> Restaurant: {item.restaurant_name}</Text>
                  <Text style={styles.reviewText}> Rating: {item.rating}</Text>
                  <Text style={styles.reviewText}> Comment: {item.review}</Text>
                </View>
              </TouchableOpacity>
            }
            ItemSeparatorComponent={this.renderSeparator}
          />
        </View>
         <TouchableOpacity
              onPress={this.logoutToLogin}
              <Text>Logout</Text>
         />
        </ScrollView>
    );
  }
}
/*style sheets for profile and review display*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  	flexDirection: 'column',
  },
  header: {
   flexDirection: 'row',
   justifyContent: 'space-around',
   paddingBottom: 5,
  },
  secondLine: {
   fontSize: 12,
   color: '#808080',
   flexDirection: 'row',
   justifyContent: 'space-around',
   paddingBottom: 5,
  },
  loc: {
   fontSize: 12,
   color: '#808080',
   borderBottomColor: '#696969',
   borderBottomWidth: 1,
   flexDirection: 'row',
   justifyContent: 'space-around',
   paddingBottom: 5,
  },
  text: {
   fontSize: 40,
   color: '#000000',
   fontWeight: 'bold',
  },
  mapTitle: {
    color:"#0047ab",
    fontSize: 32,
  },
  mapNameContainer: {
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#F0FFFF',
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000'
  },
  mapName: {
    fontSize: 16,
    marginLeft: 10,
  },
  reviewText: {
    fontSize: 16,
    marginLeft: 10,
  },
});
