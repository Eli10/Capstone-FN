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
import {Rating, AirbnbRating } from 'react-native-elements';
import StarRating from 'react-native-star-rating';

import {StackNavigator} from 'react-navigation';
const timer = require('react-native-timer');



export default class ProfilePage extends React.Component {
        constructor(props) {
            super(props);

            const { navigation } = this.props;
            const username = navigation.getParam('username', 'Blah');
            // const fname = navigation.getParam('fname', 'Blah');
            // const age = navigation.getParam('age', 'Blah');
            // const gender = navigation.getParam('gender', 'Blah');
            // const favBorough = navigation.getParam('favBorough', 'Blah');
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
                refresh_token: refresh_token
            }
        }

  logoutToLogin = () => {
    console.log("Trying to logout");
    this.props.navigation.navigate("Home");
  }

  componentDidMount() {
    this.getUserProfile()
    timer.setInterval(this, 'request-new-token', () => {
      console.log("need new token");
      this.getNewAccessToken()
    }, 720000)
  }

  componentWillUnmount() {
    timer.clearTimeout(this);
  }

  getUserProfile = () => {
    console.log("getting user profile")
    fetch (`http://localhost:3000/users/${this.state.username}`, {
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
    fetch ('http://localhost:3000/users/refresh-token', {
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
             <Text style={styles.text}> Hello {this.state.fname} </Text>
            <View style= {{width: 50, backgroundColor: '#FF8C00'}}/>
        </View>
        <View style ={styles.secondLine}>
            <View style= {{width: 20, backgroundColor: '#FF8C00'}}/>
             <Text> {this.state.age} yrs</Text>
             <Text> {this.state.gender}</Text>
             <View style= {{width: 50, backgroundColor: '#FF8C00'}}/>
            <View style= {{width: 50, backgroundColor: '#FF8C00'}}/>
        </View>
        <View style={styles.loc}>
            <View style= {{width: 35, backgroundColor: '#FF8C00'}}/>
            <Text> {this.state.favBorough} </Text>
            <View style= {{width: 45, backgroundColor: '#FF8C00'}}/>
            <View style= {{width: 45, backgroundColor: '#FF8C00'}}/>
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
});
