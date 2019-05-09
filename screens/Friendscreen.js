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
        this.props.navigation.addListener('willFocus', (route) => {this.getFriends()});
    }
  constructor(props) {
    super(props);

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
  }

  getFriends = () => {
    var friendDD = [];
    fetch (`http://localhost:3000/maps/follow/${this.state.username}`,
      {
            method: 'GET',
            mode: 'no-cors',
            headers: { 'Authorization': 'Bearer '.concat(this.state.access_token) }
        })
    .then((response) => response.json())
    .then((frenData) => {

      //console.log(frenData)
      for(var i = 0; i < frenData.maps.length; i++)
      {
        friendDD.push(frenData.maps[i].name);
      }
      //console.log(friendDD.length);
      this.setState({friendsMaps : friendDD});

    })
    .catch((error) => console.log(error))
    .done();
  }

  popList2 = (index) => {
    var tempList = [];
    let url = `http://localhost:3000/maps/follow/${this.state.username}`;
    console.log(index);
    console.log(url);
    fetch(url, {
          method: 'GET',
          mode: 'no-cors',
          headers: { 'Authorization': 'Bearer '.concat(this.state.access_token) }
      })
    .then((response) => response.json())
    .then((resData2) => {
    // console.log(resData2.maps[index].restaurants);
    //console.log("i have made it here");
    this.setState({markers2 : resData2.maps[index].restaurants});
    // console.log(this.state.markers2);
    })
    .catch((error) => console.log(error))


    }


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
              longitudeDelta: 0.305,}}
  >

  {console.log(this.state.markers2)}

    {this.state.markers2.map(shop => (
    <MapView.Marker
      coordinate={{latitude: shop.lat,
        longitude: shop.lon}}
      title={shop.name}
      description={shop.address}
      >

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

//console.log(tList);
return tList;
}


}

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
