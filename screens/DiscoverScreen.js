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

for(var i = 0; i < RestaurantList.length; i++)
{
  listnames.push(RestaurantList[i].listname);
}


export default class DiscoverScreen extends React.Component {
  static navigationOptions = {title: "Discover New Restaurants",};
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const username = navigation.getParam('username', 'Blah');
    const access_token = navigation.getParam('access_token', 'Blah');
    const refresh_token = navigation.getParam('refresh_token', 'Blah');
    console.log(username);
    this.state =
    {
      markers : [],
      data: [],
      resNameList: [],
      username: username,
      access_token: access_token,
      refresh_token: refresh_token,

    }
  }

  componentDidMount(){
    this.props.navigation.addListener('willFocus', (route) => {
      this.getDiscoveredRestaurants();
    });

  }

  getDiscoveredRestaurants = () => {
    fetch ('https://capstone-express-gateway.herokuapp.com/restaurants/discover/' + this.state.username, {
      method: 'GET',
      mode: 'no-cors',
      headers: { 'Authorization': 'Bearer '.concat(this.state.access_token) }
    })
    .then((response) => response.json())
    .then((resData) => {
      console.log(resData.restaurants);
      this.setState({data: resData.restaurants});
      this.getRestaurantNameList();
    })
    .catch((error) => console.log(error))
  }

  getRestaurantNameList = () => {
    console.log('g');
    var restaurantNameList = [];

    if (this.state.data == null) {
      return []
    }

    for (var i = 0; i < this.state.data.length; i++){
      var currentRestaurant = this.state.data[i];
      restaurantNameList.push(currentRestaurant.name);
    }
    console.log(restaurantNameList);
    this.setState({resNameList: restaurantNameList});
  }

  popList = (index) => {
    var restaurantList = [];
    restaurantList.push(this.state.data[index]);
    this.setState({markers: restaurantList });
  }

  render() {
    return (
      <View style={styles.container}>
          <ModalDropdown
              defaultValue = 'Here are Restuarants we selected for you'
              style = {styles.MD}
              options = {this.state.resNameList}
              showsVerticalScrollIndicator = {true}
              dropdownStyle = {{ height: 35 * listnames.length}}
              onSelect={(index, value) => {this.popList(index);}}
          />
          <MapView
              style={styles.map}
              initialRegion={{
              latitude: 40.7128,
              longitude: -74.0060,
              latitudeDelta: 0.105,
              longitudeDelta: 0.305,}}>
              {this.state.markers.map(shop => (
              <MapView.Marker
                  coordinate={{latitude: shop.lat,
                  longitude: shop.lon}}
                  title={shop.name}
                  description={shop.address} >
              </MapView.Marker>
              ))}
          </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative',
      },
      customView: {
        width: 140,
        height: 140,
      },
      MD : {
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#98FB98',
        width: Dimensions.get('window').width,
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
