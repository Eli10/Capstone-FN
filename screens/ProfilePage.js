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
                access_token: access_token,
                refresh_token: refresh_token,
                userMaps: [],
                userReviews: [],
            }
        }

  logoutToLogin = () => {
    console.log("Trying to logout");
    this.props.navigation.navigate("Home");
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', (route) => {
      this.getUserProfile();
      this.getMapsForUser();
      this.getRatings();
    });

    timer.setInterval(this, 'request-new-token', () => {
      console.log("need new token");
      this.getNewAccessToken()
    }, 720000)
  }

  componentWillUnmount() {
    timer.clearTimeout(this);
  }

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


        </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  	flexDirection: 'column',
    top:30,
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
    fontFamily: "Arial Rounded MT Bold",
  },
  mapNameContainer: {
    paddingTop: 5,
    paddingBottom: 5,
    fontFamily: "Arial Rounded MT Bold",
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
