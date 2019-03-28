import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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

    this.state =
        {
          markers : [],
          data: [],
        }
  }

  componentDidMount(){
    console.log('HEILLO');
    fetch ('http://127.0.0.1:8000/restaurants')
    .then((response) => response.json())
    .then((resData) => {
      // console.log(resData.restaurants);
      this.setState({data: resData.restaurants});
    })

    .catch((error) => console.log(error))
  }

  getRestaurantNameList = () => {
    console.log('g');
    var restaurantNameList = [];
    for (var i = 0; i < this.state.data.length; i++){
      var currentRestaurant = this.state.data[i];
      restaurantNameList.push(currentRestaurant.restaurant_name);
    }
    console.log(restaurantNameList);
    return restaurantNameList;
  }

      popList = (index) => {
      this.setState({markers: this.state.data[index]});
      }

  render() {
    console.log(this.state.data);
    return (
        <View style={styles.container}>

        <ModalDropdown
    defaultValue = 'Please select a Randomly Generated Restaurant'
    style = {styles.MD}
    options = {this.getRestaurantNameList()}
    showsVerticalScrollIndicator = {true}
    dropdownStyle = {{ height: 35 * listnames.length}}
    onSelect={(index, value) => {this.popList(index);}}
    />

    <MapView
    style={styles.map}
    initialRegion={{
      latitude: 40.7128,
          longitude: -74.0060,
          latitudeDelta: 0.055,
          longitudeDelta: 0.055,}}
  >


  {this.state.markers.map(item => (
    <MapView.Marker
      coordinate={{latitude: item.lat,
      longitude: item.lon}}
      title={item.restaurant_name}
      description={item.address}
      /> 
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
    },

    MD : {
      paddingBottom: 30,
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingTop: 30,

    },
    map: {
      position: 'relative',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      height: 485,
      width: 400,
      paddingTop: 100,
    },
  });
