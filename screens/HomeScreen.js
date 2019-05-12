/*
    Author: Cesar Guzman
    Purpose: HomeScreen.js implements the first tab on the tabbar, showing the user their maps and their respective
    map markers

*/
import React from 'react';
import MapView from 'react-native-maps'
import {Header,createStackNavigator, createAppContainer, StackNavigator} from 'react-navigation'
import ModalDropdown from 'react-native-modal-dropdown';
import StarRating from 'react-native-star-rating';



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
var restList = [];
var pageID0 = 100;



console.disableYellowBox = true;


//refered to https://github.com/sohobloo/react-native-modal-dropdown/issues/198 to keep building functionality
//for modal dropdowns


export default class HomeScreen extends React.Component {
    static DefaultNavigationOptions = {title: "Your Maps"};
    componentDidMount () {
        //this function is the implementation of the "on tab refresh",
        // as it calls the getmaps function as soon
        //as soon as the component mounts, i.e. as soon as it is viewed
        // by the userthis allows for maps generated
        // in other tabs to be made available in the
        //in their latest form by users who click back to the
        // homescreen-yourmaps tab
        //the componentdidmount event listener runs the getmaps function that populates the

        this.props.navigation.addListener('willFocus', (route) => {this.getmaps();});
    }

    constructor(props) {
        super(props)

        //parameters for endpoint access are passed throughout the app
        // using the react native navigation prop
        const { navigation } = this.props;
        const username = navigation.getParam('username', 'Blah');
        const access_token = navigation.getParam('access_token', 'Blah');
        const refresh_token = navigation.getParam('refresh_token', 'Blah');
        console.log(`Your Maps State User: ${username}`);
        console.log(`Your Maps State Token: ${access_token}`);


        /*
        markers is the list that wll have coords and restaurant names
        dropdown list will be the names of the markers that is populated by getmaps
         */
        this.state =
            {
                markers : restList,
                dropdownlist : ['',''],
                username: username,
                access_token: access_token,
                refresh_token: refresh_token,
            }
    };

    /*
    popList() is called when a map name in the dropdown
    is chosen, it used a get request on the maps endpoint
    to load the markers from its respective map.
    This can be noted in line 113
     */
    popList = (index) => {
        var tList = [];
        //console.log(index);
        fetch (`https://capstone-express-gateway.herokuapp.com/maps/${this.state.username}`, {
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


    /*getmaps() loads the initial dropdown as stated above, using the same
    get request as popList but only taking the map names from the return JSON object,
    which contains mapnames as well as restaurant names and coords
     */
    getmaps = ()=> {
        var dropdownv = [];
        fetch(`https://capstone-express-gateway.herokuapp.com/maps/${this.state.username}`, {
            method: 'GET',
            mode: 'no-cors',
            headers: { 'Authorization': 'Bearer '.concat(this.state.access_token) }
        })
            .then((response) => response.json())
            .then((resData) => {
                for (var i = 0; i < resData.maps.length; i++) {
                    dropdownv.push(resData.maps[i].name);
                }
                console.log(dropdownv);
                console.log("here now");
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
                   dropdownStyle = {{ height:'auto'}}
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
                 tooltip onPress={() => navigate('Star', {restname: shop.name,
                     PAGEID: pageID0,
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
}


/*
this is the styling sheet for the general view, the dropdown menu, the mapview,
and the text bubbles generated by pressing markers
 */


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative',
    },
    MD: {
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
