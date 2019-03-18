import React from 'react';
import MapView from 'react-native-maps'
import {Header,createStackNavigator, createAppContainer} from 'react-navigation'
import {Dropdown} from 'react-native-material-dropdown';
                      

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

    var restaurantObject = ['', '', '', ''];
    var restList = [];
         
    for(var i = 0; i < RestaurantList.length; i++)
        {
            RestaurantObject = RestaurantList[i];
            restList.push(RestaurantObject);
            console.log(RestaurantObject);
        } 
        
    for(var i = 0; i < RestaurantList.length; i++)
        {
            console.log(restList[i]);
        } 

    var myLists = [{label: 'drinks', value: 'bubble tea'}, {label: 'drinks', value: 'pizza',}, {value: 'burgers',}, {label: 'drinks', value: 'im in a mood',}];




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
       
      
   
         
        <MapView style={styles.map}
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

 

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 400,
    width: 400,
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },

 
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});


