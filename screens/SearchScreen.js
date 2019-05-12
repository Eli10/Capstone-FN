/**
Author:Jasmine Wong
 file: this file implements the search maps (3rd icon on tab bar) that allows for searching and adding of restaurants
 to maps
 **/
import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Modal, Button} from 'react-native';
import { SearchBar } from 'react-native-elements';
import Dialog from "react-native-dialog";
import ModalDropdown from 'react-native-modal-dropdown';
import restaurantList from '../assets/files/search.json';

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
      console.log('HEILLO');

      fetch ('https://capstone-express-gateway.herokuapp.com/restaurants',{
          method: 'GET',
          mode: 'no-cors',
          headers: { 'Authorization': 'Bearer '.concat(this.state.access_token) }
      })
      .then((response) => response.json())
      .then((resData) => {
        console.log(resData.restaurants);
        this.setState({data: resData.restaurants});
      })

      .catch((error) => console.log(error))
    }

    getMapsForUser = () => {
      let url = 'https://capstone-express-gateway.herokuapp.com/maps/name/' + this.state.defaultUser;
      console.log(url);
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
      let url = 'https://capstone-express-gateway.herokuapp.com/restaurants/id/' + this.state.modalData.name + '/' + this.state.modalData.address;
      console.log(url);
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
      console.log(map);
      console.log(this.state.temporaryRestaurantId);
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
      });
    }

    showDialog = () => {
      this.setState({ dialogVisible: true });
    };

    handleClose = () => {
      this.setState({ dialogVisible: false });
    };

    createNewMapName= () => {
      this.showDialog();
    };

    createNewMap = () => {
      console.log(this.state.defaultUser);
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
        });
    }

    createMapAndAddRestaurant = () => {
      this.createNewMap();
      this.handleClose();
      console.log(this.state.temporaryMapName);
      this.addToExistingMap(this.state.temporaryMapName);
    }

    renderSeparator = () => {
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
        this.setState({
            value: text,
        });

        console.log("Suppose to change state");
        console.log(text);
        console.log(this.state.data);

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
        var resNameList = this.state.data.map(res => res.name);

        isRestaurantInList = resNameList.includes(resName);

        if (!isRestaurantInList) {
            this.googleNewRestaurants(resName);
        }
    }

    googleNewRestaurants = (resName) => {
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
      this.setState({ModalVisible: visible});
    }

    onPressShow(item) {
      this.showModal(true);
      this.setState({modalData: item});
    };

    showMapModal(visible) {
      console.log("Heeere");
      console.log(visible);
      this.setState({MapModalVisible: visible});
    }

    onPressShowMap(){
      console.log('e');
      this.showMapModal(true);
      // console.log(this.state.userMaps);
      this.setState({mapModalData: this.state.userMaps});
    }

    showMap = () => {
      console.log('hi');
      this.getMapsForUser();
      // console.log(this.state.userMaps);
      this.showModal(!this.state.ModalVisible);
      console.log('After show Modal');
      this.onPressShowMap();
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
            <View style={{top:40}}>
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

                      <TouchableOpacity onPress={() => { this.addToExistingMap(item) }}>
                        <View>
                          <Text style={styles.restaurant_name}>{item}</Text>

                        </View>
                      </TouchableOpacity>

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

const styles = StyleSheet.create({
  restaurant_name: {
    fontFamily: 'Verdana',
    fontSize: 20,
    fontWeight: 'bold'
  },
  resaturant_address: {
    fontSize:15,
    fontWeight: 'bold',
    color: 'grey'
  }
})
