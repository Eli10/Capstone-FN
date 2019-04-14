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
        this.state = {
            loading: false,
            data: [],
            currentDataList: [],
            defaultUser: "jamie",
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
        };
    }

    componentDidMount(){
      console.log('HEILLO');
      fetch ('http://localhost:3000/restaurants')
      .then((response) => response.json())
      .then((resData) => {
        // console.log(resData.restaurants);
        this.setState({data: resData.restaurants});
      })

      .catch((error) => console.log(error))
    }

    getMapsForUser = () => {
      let url = 'http://localhost:3000/maps/name/' + this.state.defaultUser;
      console.log(url);
      fetch(url)
      .then((response) => response.json())
      .then((resData) => {
      this.setState({userMaps: resData.map_names});
    })
      .catch((error) => console.log(error))
    }

    getRestaurantId = () => {
      let url = 'http://localhost:3000/restaurants/id/' + this.state.modalData.restaurant_name + '/' + this.state.modalData.address;
      console.log(url);
      fetch(url)
      .then((response) => response.json())
      .then((resData) => {this.setState({temporaryRestaurantId: resData.id});
      })
      .catch((error) => console.log(error))
    }

    addToExistingMap = (map) => {
      console.log(map);
      console.log(this.state.temporaryRestaurantId);
      fetch('http://localhost:3000/maps/contain', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
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
      fetch('http://localhost:3000/maps/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
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

    searchFilterFunction = text =>{
        this.setState({
            value: text,
        });

            const newData = this.state.data.filter(item => {
            const itemData = `${item.restaurant_name.toUpperCase()}`;
            // const itemData = `${item.name.toUpperCase()} ${item.type.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.includes(textData);
          });

        this.setState({
            currentDataList: newData,
        });
    };

    renderHeader = () => {
        return (
            <SearchBar
                placeholder="Type..."
                value={this.state.value}
                onChangeText={text => this.searchFilterFunction(text)}
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
            <View>
              <Modal
                 transparent={false}
                 animationType={"slide"}
                 visible={this.state.ModalVisible}
                 onRequestClose={ () => { this.ShowModal(!this.state.ModalVisible)} } >
                 <View style={{ flex:1, justifyContent: 'center', alignItems: 'center' }}>
                  <View>
                     <Text style={styles.restaurant_name}>{this.state.modalData.restaurant_name}</Text>
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
                    <Text style={styles.restaurant_name}>{item.restaurant_name}</Text>
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
