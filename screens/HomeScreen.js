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
var pageID0 = 100;

    for(var i = 0; i < RestaurantList.length; i++)
        {
            listnames.push(RestaurantList[i].listname);
        }

console.disableYellowBox = true;


//refer to https://github.com/sohobloo/react-native-modal-dropdown/issues/198 to keep building functionality



export default class HomeScreen extends React.Component {
    static navigationOptions = {title: "Your Maps",};
    componentDidMount () {
        this.props.navigation.addListener('willFocus', (route) => {this.getmaps()});
    }
    navigationOptions = {title: 'My Maps',};

    constructor(props) {
        super(props)

        const { navigation } = this.props;
        const username = navigation.getParam('username', 'Blah');
        const access_token = navigation.getParam('access_token', 'Blah');
        const refresh_token = navigation.getParam('refresh_token', 'Blah');
        console.log(username);

        this.state =
            {
                markers : restList,
                dropdownlist : ['',''],
                username: username,
                access_token: access_token,
                refresh_token: refresh_token,
            }
    };

    popList = (index) => {
        var tList = [];
        //console.log(index);
        fetch (`http://localhost:3000/maps/${this.state.username}`, {
            method: 'GET',
            mode: 'no-cors',
            headers: { 'Authorization': 'Bearer '.concat(this.state.access_token) }
        })
        .then((response) => response.json())
        .then((resData) => {
            //console.log(resData.maps[0].restaurants);
            this.setState({markers : resData.maps[index].restaurants})
            //console.log(this.state.markers)
        })
        .   catch((error) => console.log(error))
    }
//this marker popilates the initial dropdown

    getmaps = ()=> {
        var dropdownv = [];
        fetch(`http://localhost:3000/maps/${this.state.username}`, {
            method: 'GET',
            mode: 'no-cors',
            headers: { 'Authorization': 'Bearer '.concat(this.state.access_token) }
        })
            .then((response) => response.json())
            .then((resData) => {
                for (var i = 0; i < resData.maps.length; i++) {
                    dropdownv.push(resData.maps[i].name);
                }
                //console.log(dropdownv);
                //console.log("here now");

            })
            .catch((error) => console.log(error))
            .done();
        this.setState({dropdownlist : dropdownv})
    }


    render() {

        var x = 1;
        const {navigate} = this.props.navigation;


        return (


           <View style={styles.container}>
               <ModalDropdown
                   defaultValue = 'Please select a Map'
                   style = {styles.MD}
                   options = {this.state.dropdownlist}
                   dropdownStyle = {{ height: 35 * listnames.length}}
                   onSelect={(index, value) => {this.popList(index)}}
               />


               <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 40.7128,
                  longitude: -74.0060,
                  latitudeDelta: 0.355,
                  longitudeDelta: 0.355,
              }}
            >


            {this.state.markers.map(shop => (
            <MapView.Marker
                coordinate={{latitude: shop.lat,
                longitude: shop.lon}}
                title={shop.restaurant_name}
                description={shop.address} >

                <MapView.Callout style={styles.plainView}
                 tooltip onPress={() => navigate('Star', {restname: shop.name, PAGEID: pageID0, restAddr: shop.address })}>
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
