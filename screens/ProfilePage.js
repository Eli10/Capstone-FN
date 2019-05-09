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
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
import {StackNavigator} from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import {Rating, AirbnbRating } from 'react-native-elements';
const timer = require('react-native-timer');
import StarRating from 'react-native-star-rating';

const {height}=Dimensions.get('windows');
export default class ProfilePage extends React.Component {
        constructor(props) {
            super(props);

            const { navigation } = this.props;
            const username = navigation.getParam('username', 'Blah');
            const fname=navigate.getParam('fname', 'Blah');
            const age=navigation.getParm('age', 'Blah');
            const gender=navigation.getParm('gender', 'Blah');
            const favBorough= navigation.getParam('favBorough', 'Blah');
            const access_token = navigation.getParam('access_token', 'Blah');
            const refresh_token = navigation.getParam('refresh_token', 'Blah');

            {console.log("Profile Params")};
            {console.log(this.props.navigation.state.params)};

            this.state={
                fname: fname,
                screenHeight: 0,
                username: username,
                age: age,
                gender: gender,
                favBorough: favBorough,
                access_token: access_token,
                refresh_token: refresh_token
            }
        }

  logoutToLogin = () => {
    console.log("Trying to logout");
    this.props.navigation.navigate("Home");
  }

  componentDidMount() {
    timer.setInterval(this, 'request-new-token', () => {
      console.log("need new token");
      this.getNewAccessToken()
    }, 720000)
  }

  componentWillUnmount() {
    timer.clearTimeout(this);
  }

  getNewAccessToken = () => {
    console.log("getting new access token")
    fetch ('http://10.0.2.2:3000/users/refresh-token', {
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
    const scrollEnable = this.state.screenHeight > height;
    return (
      <ScrollView style={styles.container}
         scrollEnabled = {scrollEnable}
         onContentSizeChange= {this.onContentSizeChange}>
        <View style ={styles.header}>       
            <Text style={styles.text}> Hello {this.state.fname} </Text>
            <View style= {{width: 50, backgroundColor: '#ffd200'}}/>         
        </View>
        <View style ={styles.secondLine}>
            <View style= {{width: 20, backgroundColor: '#ffd200'}}/>            
             <Text> {this.state.age} yrs</Text>
             <Text> {this.state.gender}</Text>
             <View style= {{width: 50, backgroundColor: '#ffd200'}}/>         
            <View style= {{width: 50, backgroundColor: '#ffd200'}}/>            
        </View>
        <View style={styles.loc}>
            <View style= {{width: 35, backgroundColor: '#ffd200'}}/>            
            <Text> {this.state.favBorough} </Text>
            <View style= {{width: 45, backgroundColor: '#ffd200'}}/>         
            <View style= {{width: 45, backgroundColor: '#ffd200'}}/>   
        </View>
        <Text> Access Token  {this.state.access_token} </Text>
         
         <Button
              onPress={this.logoutToLogin}
              title="Logout"
         />
        </ScrollView>
    );
  }
  onContentSizeChange = (contentWidth, contentHeight) => {
      this.setState({screenHeight: contentHeight});
  };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    flexDirection: 'column'
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
