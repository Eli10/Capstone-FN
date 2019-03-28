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

friendDD = [];
fetch ('http://127.0.0.1:8000/maps/follow/Bob')
    .then((response) => response.json())
.then((frenData) => {

//console.log(frenData)
for(var i = 0; i < frenData.maps.length; i++)
{
  friendDD.push(frenData.maps[i].name);
}
//console.log(friendDD.length);


})
.catch((error) => console.log(error))
.done();

console.disableYellowBox = true;


export default class FriendScreen extends React.Component {
  static navigationOptions = {title: "Friends' Maps",};
  constructor(props) {
    super(props);

    this.state =
        {
          markers2 : []
        }
  };

  popList2 = (index) => {
    tempList = [];
    console.log(index);
    fetch ('http://10.0.2.2:8000/maps/follow/Bob')
    .then((response) => response.json())
    .then((resData2) => {
    console.log(resData2.maps[index].restaurants);
    console.log("i have made it here")
    this.setState({markers2 : resData2.maps[index].restaurants})
    console.log(this.state.markers2)
    })
    .catch((error) => console.log(error))
    }


  render() {
    return (
      <View style={styles.container}>

        <ModalDropdown
            defaultValue = 'Please select a List'
            style = {styles.MD}
            options = {friendDD}
            onSelect={(index, value) => {this.popList2(index)}}
            dropdownStyle = {{ height: 35 * friendDD.length}}
        />

        <MapView
           style={styles.map}
          initialRegion={{
               latitude: 40.7128,
              longitude: -74.0060,
              latitudeDelta: 0.055,
              longitudeDelta: 0.055,}}
  >


    {this.state.markers2.map(shop => (
    <MapView.Marker
      coordinate={{latitude: shop.lat,
        longitude: shop.lon}}
      title={shop.restaurant_name}
      description={shop.address}
      />
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
