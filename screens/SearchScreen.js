/**
Author:Jasmine Wong
 file: this file implements the search maps (3rd icon on tab bar) that allows for searching and adding of restaurants
 to maps
 **/
import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Modal, Button} from 'react-native';
import { SearchBar } from 'react-native-elements';
import Dialog from "react-native-dialog";

export default class SearchScreen extends React.Component {

    static navigationOptions = {
        title: 'Search for Restaurants',
    };
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const username = navigation.getParam('username', 'Blah');
        const access_token = navigation.getParam('access_token', 'Blah');
        const refresh_token = navigation.getParam('refresh_token', 'Blah');
        this.state = {
            loading: false,
            data: [],
            currentDataList: [],
            defaultUser: username,
            userMaps: [],
            error: null,
            value: '',
            ModalVisible: false,
            MapModalVisible: false,
            modalData: '',
            mapModalData:[],
            dialogVisible: false,
            confirmDialogVisible: false,
            temporaryMapName: '',
            temporaryRestaurantId: null,
            access_token: access_token,
            refresh_token: refresh_token,
        };
    }
    componentDidMount(){
      //this function calls the restaurants endpoint to pull all the restaurants in the database
      //
      //as soon as this page is loaded and every time the page is loaded
      //
      //the restaurants are saved into the data prop as an array
      fetch ('https://capstone-express-gateway.herokuapp.com/restaurants',{
          method: 'GET',
          mode: 'no-cors',
          headers: { 'Authorization': 'Bearer '.concat(this.state.access_token) }
      })
      .then((response) => response.json())
      .then((resData) => {
        //console.log(resData.restaurants);
        this.setState({data: resData.restaurants});
      })

      .catch((error) => console.log(error))
    }

    getMapsForUser = () => {
      //this function is called when a user is trying to add a restaurant to a map
      //
      //after the user selects on a restaurant
      //
      //this function calls the maps/name/ endpoint to pull all the users' maps to add the new restaurant

      let url = 'https://capstone-express-gateway.herokuapp.com/maps/name/' + this.state.defaultUser;
      var header = { 'Authorization': 'Bearer '.concat(this.state.access_token) };
      fetch(url, {
          method: 'GET',
          mode: 'no-cors',
          headers: header
      })
      .then((response) => response.json())
      .then((resData) => {
      this.setState({userMaps: resData.map_names});
    })
      .catch((error) => console.log(error))
    }


    getRestaurantId = () => {
      //this function is called when a user is trying to add a restaurant to
      //
      //an existing map or to a new map
      //
      //this function calls the restaurants/id/ endpoint to obtain the restaurant's id 
      let url = 'https://capstone-express-gateway.herokuapp.com/restaurants/id/' + this.state.modalData.name + '/' + this.state.modalData.address;
      fetch(url, {
          method: 'GET',
          mode: 'no-cors',
          headers: { 'Authorization': 'Bearer '.concat(this.state.access_token) }
      })
      .then((response) => response.json())
      .then((resData) => {this.setState({temporaryRestaurantId: resData.id});
      })
      .catch((error) => console.log(error))
    }

    addToExistingMap = (map) => { 
      //this function calls the maps/contain endpoint to add the selected restaurant
      //
      //to an existing map using the restaurant's id
      //
      //the "map" parameter is a temp name for a passed in restaurant id
      var header = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '.concat(this.state.access_token)
      };
      fetch('https://capstone-express-gateway.herokuapp.com/maps/contain', {
        method: 'POST',
        headers: header,
        body: JSON.stringify({
          mapname: map,
          restaurant_id: this.state.temporaryRestaurantId,
        }),
      }).then((res) => {
          console.log(res.status)
          this.props.navigation.navigate('Profile', {
          username: this.state.username,
          access_token: this.state.access_token,
          refresh_token: this.state.refresh_token})
      })


    }

    showDialog = () => {
      //this function is called when the user wants to add the restaurant to
      //
      //a new map a dialog box with pop up for the user to create a new map
      //
      //will appear
      this.setState({ dialogVisible: true });
    };
    handleClose = () => {
      //this function is called when the user closes the create new map
      //dialog box, either by creating or cancelling
      this.setState({ dialogVisible: false });
    };
    createNewMapName= () => {
      //tthis function calls the showDialog function

      this.showDialog();
    };

    createNewMap = () => {
      //this function called the maps/ endpoint to create a relationship
      //
      //between the user and the new map the user created
      fetch('https://capstone-express-gateway.herokuapp.com/maps/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '.concat(this.state.access_token)
        },
        body: JSON.stringify({
          username: this.state.defaultUser,
          mapname: this.state.temporaryMapName,
        }),
        }).then( () => this.addToExistingMap(this.state.temporaryMapName))
    }
    createMapAndAddRestaurant = () => {
      //this is the general function called that calls all related functions
      //
      //needed to create a new map and add the selected restaurant to the new map

      this.createNewMap();
      this.handleClose();


    }
    renderSeparator = () => {
      //this function is the stylistic component of each item rendered in the flatlist
      //
      //that displays the restaurant search results after a search made
      return (
          <View
              style={{
                height: 1,
                width: '100%',
                backgroundColor: '#CED0CE',
                marginLeft: '0%',
              }}
          />
        );
      };
    searchFilterFunction = text => {
      //this function dictates how restaurants are searched
      //
      //the information in the search input is matched the restaurant names
      //
      //with  a regex functionality. Results are filtered as the user is typing
        this.setState({
            value: text,
        });
        const newData = this.state.data.filter(item => {
          const itemData = `${item.name.toUpperCase()}`;
          // const itemData = `${item.name.toUpperCase()} ${item.type.toUpperCase()}`;
          const textData = text.toUpperCase();
          return itemData.includes(textData);
        });
        this.setState({
            currentDataList: newData,
        });
    };
    searchForRestaurant = (resName) => {
      //based on user input in search bar, the restaurant is searched for in the database
      //
      //if the restaurant is not in the database, the user input is searched in google
      //
      //resname is the passed in restaurant name
      //
      //precondition: a valid restaurant name is passed in as a parameter
        var resNameList = this.state.data.map(res => res.name);
        isRestaurantInList = resNameList.includes(resName);
        if (!isRestaurantInList) {
            this.googleNewRestaurants(resName);
        }
    }
    googleNewRestaurants = (resName) => {
      //this function calls the restaurant/search endpoint if a search input
      //
      //cannot be found in the database, and instead the retaurant is searched
      //
      //for on Google

        fetch ('https://capstone-express-gateway.herokuapp.com/users/restaurant/search/'+resName,{
            method: 'GET',
            mode: 'no-cors',
            headers: { 'Authorization': 'Bearer '.concat(this.state.access_token) }
        })
        .then((response) => response.json())
        .then((resData) => {
            this.setState({data: this.state.data.concat(resData.results)});
            this.searchFilterFunction(resName);
        })
        .catch((error) => console.log(error))
    }
    renderHeader = () => {
      //this is the header that displays the search bar at the top of the search page
        return (
            <SearchBar
                placeholder="Type..."
                value={this.state.value}
                onChangeText={text => this.searchFilterFunction(text)}
                onEndEditing={() => this.searchForRestaurant(this.state.value)}
                />
        );
    };
    showModal(visible) {
      //this function is called after a user selects a restaurant to
      //
      //show a modal that gives the user the option to add the restaurant
      //
      //to a current map, new map, or to go back

      this.setState({ModalVisible: visible});
    }
    onPressShow(item) {
      //this function is called when a user selects a restaurant
      //this function calls showModal
      this.showModal(true);
      this.setState({modalData: item});
    };
    showMapModal(visible) {
      //this function is called when a user wants to add a restaurant
      //
      //to an exisiting map the user has a relationship with
      //
      //this modal shows the list of available current maps
      this.setState({MapModalVisible: visible});
    }
    onPressShowMap(){
      //this function is called when a user wants to add a restaurant
      //
      //to an existing map
      //
      //this function calls showMapModal to show the list of maps on a modal
      this.showMapModal(true);
      this.setState({mapModalData: this.state.userMaps});
    }
    showMap = () => {
      //this function is called when a user clicks 'Add to an existing map'
      //
      //on the modal that pops up after the user clicks on a restaurant
      //
      //post condition: user's maps are shown

      this.getMapsForUser();
      this.showModal(!this.state.ModalVisible);
      this.onPressShowMap();

      /*
      this render function displays the initial search bar at the top of the page

      and also displays the search results and the dialogue/options that are open to the

      user when they have to create a  new map or add a restaurant to an existing map
       */
    }
    render() {
        if (this.state.loading) {
            return (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
              </View>
            );
        }
        return (
            <View>
              <Modal
                 transparent={false}
                 animationType={"slide"}
                 visible={this.state.ModalVisible}
                 onRequestClose={ () => { this.ShowModal(!this.state.ModalVisible)} } >
                 <View style={{ flex:1, justifyContent: 'center', alignItems: 'center' }}>
                  <View>
                     <Text style={styles.restaurant_name}>{this.state.modalData.name}</Text>
                     <Text style={styles.resaturant_address}> Address: {this.state.modalData.address}</Text>
                     <Button title="Add to an existing map" onPress = { () => {this.showMap(); this.getRestaurantId()}}/>
                     <Button title="Create a new map" onPress= { () => {this.createNewMapName(); this.getRestaurantId()}}/>
                     <Dialog.Container visible={this.state.dialogVisible}>
                        <Dialog.Title>Create a New Map</Dialog.Title>
                        <Dialog.Description>
                            Enter the map name.
                        </Dialog.Description>
                        <Dialog.Input onChangeText={(text) => this.setState({temporaryMapName: text})}/>
                        <Dialog.Button label="Cancel" onPress={this.handleClose} />
                        <Dialog.Button label="Add restaurant to map" onPress={this.createMapAndAddRestaurant}/>
                    </Dialog.Container>
                    <Button  title="Go back" onPress={() => { this.showModal(!this.state.ModalVisible)} } />
                  </View>
                 </View>
              </Modal>
              <Modal
                 transparent={false}
                 animationType={"slide"}
                 visible={this.state.MapModalVisible}
                 onRequestClose={ () => { this.ShowModal(!this.state.MapModalVisible)} } >
                 <View style={{ flex:1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>hello</Text>
                    <View style={{ flex:1, justifyContent: 'center', alignItems: 'center' }}>
                    <FlatList
                      contentContainerStyle={{ flex:1, justifyContent: 'center', alignItems: 'center' }}
                      data={this.state.userMaps}
                      renderItem={({ item }) =>
                      <Button onPress={() => { this.addToExistingMap(item) }} title={item}>
                      </Button>
                      }
                      ItemSeparatorComponent={this.renderSeparator}
                    />
                    </View>
                    <Button  title="Go back" onPress={() => { this.showMapModal(!this.state.MapModalVisible); this.showModal(!this.state.ModalVisible) } } />
                 </View>
              </Modal>
              <FlatList
                extraData={this.state}
                data={this.state.currentDataList}
                renderItem={({ item }) =>
                <TouchableOpacity onPress={() => { this.onPressShow(item) }}>
                  <View>
                    <Text style={styles.restaurant_name}>{item.name}</Text>
                    <Text style={styles.resaturant_address}> Address: {item.address}</Text>
                  </View>
                </TouchableOpacity>
                }
                ItemSeparatorComponent={this.renderSeparator}
                ListHeaderComponent={this.renderHeader}
              />
            </View>
          );
    }
}
/*
this is the styling sheet for how the restaurant name and address are displayed

in the flatlist

 */
const styles = StyleSheet.create({
  restaurant_name: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  resaturant_address: {
    fontSize:15,
    fontWeight: 'bold',
    color: 'grey'
  }
})
