//Author: Cesar Guzman
//
//Purpose: Friendscreen.js is a functional clone of HomeScreen.js
//that displays the maps of friends
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  BackHandler,
} from 'react-native';

import { WebBrowser } from 'expo';
import ModalDropdown from 'react-native-modal-dropdown';
import { MonoText } from '../components/StyledText';
import MapView from 'react-native-maps'
import RestaurantList from '../assets/files/TestRestaurants.json';

var restaurantObject = ['', '', '', ''];
var listnames = [];
var restList = [];
var pageID1 = 101;



for(var i = 0; i < RestaurantList.length; i++)
{
  listnames.push(RestaurantList[i].listname);
}

console.disableYellowBox = true;

export default class FriendScreen extends React.Component {
  static navigationOptions = {title: "Friends' Maps",};
    componentDidMount () {
        // The refresh function for this page, gets the mapnames that belong to friends
        this.props.navigation.addListener('willFocus', (route) => {this.getFriends()});
    }
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    const { navigation } = this.props;
    const username = navigation.getParam('username', 'Blah');
    const access_token = navigation.getParam('access_token', 'Blah');
    const refresh_token = navigation.getParam('refresh_token', 'Blah');
    this.state =
        {
          markers2 : [],
          username: username,
          access_token: access_token,
          refresh_token: refresh_token,
          friendsMaps: [],
        }
  };

  componentWillMount() {
    this.getFriends();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }
  handleBackButtonClick() {
      this.props.navigation.goBack(null);
      return true;
  }

  //  getFriends() loads the initial dropdown as stated above, using the same
  //
  //  get request as popList but only taking the map names from the return JSON object,
  //
  //  which contains mapnames as well as restaurant names and coords
  getFriends = () => {
    var friendDD = [];
    fetch (`https://capstone-express-gateway.herokuapp.com/maps/follow/${this.state.username}`,
      {
            method: 'GET',
            mode: 'no-cors',
            headers: { 'Authorization': 'Bearer '.concat(this.state.access_token) }
        })
    .then((response) => response.json())
    .then((frenData) => {
      for(var i = 0; i < frenData.maps.length; i++)
      {
        friendDD.push(frenData.maps[i].name);
      }
      this.setState({friendsMaps : friendDD});
    })
    .catch((error) => console.log(error))
    .done();
  }

  // popList2() is called when a map name in the dropdown
  //
  // is chosen, it used a get request on the maps endpoint
  //
  // to load the markers from its respective map.
  //
  // This can be noted in line 122
  //
  // @param index The index of the Map in the MapList chosen
  popList2 = (index) => {
    var tempList = [];
    let url = `https://capstone-express-gateway.herokuapp.com/maps/follow/${this.state.username}`;
    fetch(url, {
          method: 'GET',
          mode: 'no-cors',
          headers: { 'Authorization': 'Bearer '.concat(this.state.access_token) }
      })
    .then((response) => response.json())
    .then((resData2) => {
    this.setState({markers2 : resData2.maps[index].restaurants});
    })
    .catch((error) => console.log(error))
    }

  // The render function implements the mapview which shows the loaded markers from
  //
  // above as well as the drop down to select the maps, and the marker dialogues which
  //
  // can be pressed to be forwarded to the rating and review page
  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <ModalDropdown
            defaultValue = 'Please select a List'
            style = {styles.MD}
            options = {this.state.friendsMaps}
            onSelect={(index, value) => {this.popList2(index)}}
            dropdownStyle = {{ height: 35 * this.state.friendsMaps.length}}
        />
        <MapView
            style={styles.map}
            initialRegion={{
            latitude: 40.7128,
            longitude: -74.0060,
            latitudeDelta: 0.105,
            longitudeDelta: 0.305,}}>
            {this.state.markers2.map(shop => (
            <MapView.Marker
                coordinate={{latitude: shop.lat,
                longitude: shop.lon}}
                title={shop.name}
                description={shop.address}>
                <MapView.Callout style={styles.plainView}
                    tooltip onPress={() => navigate('Star', {
                    restname: shop.name,
                    PAGEID: pageID1,
                    restAddr: shop.address,
                    token: this.state.access_token,
                    user: this.state.username })}>
                    <View styles={{textAlign: 'center',}}>
                        <Text>{shop.name}{"\n"}{shop.address}</Text>
                    </View>
                </MapView.Callout>
            </MapView.Marker>
            ))}
        </MapView>
      </View>
    );
  }
  popList = (index) => {
  var tList = [];
  for(var i = 0; i < RestaurantList[index].list.length; i++)
{
  tList.push(RestaurantList[index].list[i]);
}
return tList;
}

}

// This is the styling sheet for the general view, the dropdown menu, the mapview,
//
// and the text bubbles generated by pressing markers
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  MD : {
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#98FB98',
    width: 145,
    position: 'absolute',
    borderRadius: 12,
  },
  map: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: Dimensions.get('window').height - 40,
    width: Dimensions.get('window').width,
    paddingTop: 100,
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 5,
    position: 'relative',
    zIndex: -1
  },
  plainView: {
    width: 'auto',
    backgroundColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    textAlign: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
});
