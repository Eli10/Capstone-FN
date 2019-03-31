import React from 'react';
import MapView from 'react-native-maps'
import {Header,createStackNavigator, createAppContainer, StackNavigator} from 'react-navigation'
import ModalDropdown from 'react-native-modal-dropdown';
import StarRating from 'react-native-star-rating';


//you are bob for tesgting

import {
  Picker,
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AppRegistry,
  Dimensions,
  Component,
  Alert,
} from 'react-native';

import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import RestaurantList from '../assets/files/TestRestaurants.json';
import RNPickerSelect from 'react-native-picker-select';
import menu from '../components/DropDownClassForHomeScreen.js';

    var restaurantObject = ['', '', '', ''];
    var listnames = [];
    var restList = [];


    for(var i = 0; i < RestaurantList.length; i++)
        {
            listnames.push(RestaurantList[i].listname);
        }

dropdownv = [];
fetch ('http://10.0.2.2:8000/maps/Bob')
    .then((response) => response.json())
    .then((resData) => {
    //console.log("hello alina and eli ");
    for(var i = 0; i < resData.maps.length; i++)
    {
        dropdownv.push(resData.maps[i].name);
    }
    console.log(dropdownv);
    console.log("here now");

    })
    .catch((error) => console.log(error))
    .done();

console.disableYellowBox = true;


//refer to https://github.com/sohobloo/react-native-modal-dropdown/issues/198 to keep building functionality



export default class HomeScreen extends React.Component {
    static navigationOptions = {title: 'My Maps',};

    constructor(props) {
    super(props);

    this.state =
    {
        markers : restList,
        dropdownlist : ['',''],
    }
  };




    popList = (index) => {
        tList = [];
        console.log(index);
        fetch ('http://10.0.2.2:8000/maps/Bob')
        .then((response) => response.json())
        .then((resData) => {
            //console.log(resData.maps[0].restaurants);
            this.setState({markers : resData.maps[index].restaurants})
            //console.log(this.state.markers)
            })
        .   catch((error) => console.log(error))
        }
            //this marker popilates the initial dropdown




  render() {

     const {navigate} = this.props.navigation;

     return (

       <View style={styles.container}>


       <ModalDropdown
            defaultValue = 'Please select a Map'
            style = {styles.MD}
            options = {dropdownv}
            dropdownStyle = {{ height: 35 * listnames.length}}
            onSelect={(index, value) => {this.popList(index)}}
        />



        <MapView
            style={styles.map}
            initialRegion={{
              latitude: 40.7128,
              longitude: -74.0060,
              latitudeDelta: 0.055,
              longitudeDelta: 0.055,
          }}
        >


        {this.state.markers.map(shop => (
        <MapView.Marker
            coordinate={{latitude: shop.lat,
            longitude: shop.lon}}
            title={shop.restaurant_name}
            description={shop.address}
         >
            <MapView.Callout style={styles.plainView}
             tooltip onPress={() => navigate('Star')}

            >
                    <View>
                        <Text>{shop.restaurant_name}{"\n"}{shop.address}</Text>
                    </View>
            </MapView.Callout>
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
        },
        customView: {
            width: 140,
            height: 140,
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
            plainView: {
            width: 'auto',
            backgroundColor: 'white',
            paddingHorizontal: 6,
            paddingVertical: 6,
            borderRadius: 12,
            alignItems: 'center',
            marginHorizontal: 10,
            marginVertical: 10,
            },
    });