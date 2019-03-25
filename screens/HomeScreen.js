import React from 'react';
import MapView from 'react-native-maps'
import {Header,createStackNavigator, createAppContainer} from 'react-navigation'
import ModalDropdown from 'react-native-modal-dropdown';


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



console.disableYellowBox = true;

var myLists = ['bubble tea', 'pizza', 'burgers', 'pizza'];
var myLists2 = ['bubble tea', 'pizza', 'burgers', 'burgers2'];
var myLists3 = ['bubble tea', 'pizza', 'burgers', 'food'];
//refer to https://github.com/sohobloo/react-native-modal-dropdown/issues/198 to keep building functionality



export default class HomeScreen extends React.Component {
    static navigationOptions = {title: 'My Maps',}; 
    
    constructor(props) {
    super(props);

    this.state = 
    { 
        markers : restList
    }
  };


  render() {
    


  

     return (
         
       <View style={styles.container}>
       
       <ModalDropdown  
            defaultValue = 'Please select a Map'
            style = {styles.MD} 
            options = {listnames}
            dropdownStyle = {{ height: 35 * listnames.length}}
            onSelect={(index, value) => {this.setState({markers : popList(index)})}}
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
            coordinate={{latitude: shop.latitude,
            longitude: shop.longitude}}
            title={shop.name}
            description={shop.address}
         /> ))}
      </MapView> 

         
 </View>

 
    );
  }

 


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