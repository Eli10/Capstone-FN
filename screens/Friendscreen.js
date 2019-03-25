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

export default class FriendScreen extends React.Component {
  static navigationOptions = {title: "Friends' Maps",};


  render() {
    return (
      <View style={styles.container}>
        
        <ModalDropdown  
            defaultValue = 'Please select a List' 
            style = {styles.MD} 
            options = {['Friend 1', 'Friend 2', 'Friend 3', 'Friend 4']}   
            
        />

        <MapView
           style={styles.map}
          initialRegion={{
               latitude: 40.7128,
              longitude: -74.0060,
              latitudeDelta: 0.055,
              longitudeDelta: 0.055,}}
       />
       
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
