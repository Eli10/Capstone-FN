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

var friendDD = [];
fetch ('http://localhost:3000/maps/follow/Bob')
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
    var tempList = [];
    let url = "http://localhost:3000/maps/follow/Bob";
    console.log(index);
    console.log(url);
    fetch(url)
    .then((response) => response.json())
    .then((resData2) => {
    // console.log(resData2.maps[index].restaurants);
    console.log("i have made it here");
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
            options = {friendDD}
            onSelect={(index, value) => {this.popList2(index)}}
            dropdownStyle = {{ height: 35 * friendDD.length}}
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
      title={shop.restaurant_name}
      description={shop.address}
      >

      <MapView.Callout style={styles.plainView}
                       tooltip onPress={() => navigate('Star')}>
        <View styles={{textAlign: 'center',}}>
          <Text>{shop.restaurant_name}{"\n"}{shop.address}</Text>
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
