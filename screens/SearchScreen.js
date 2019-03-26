import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Modal, Button} from 'react-native';
import { SearchBar } from 'react-native-elements';
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
            error: null,
            value: '',
            ModalVisible: false,
            modalData: '',
        };
    }

    componentDidMount(){
      console.log('HEILLO');
      fetch ('http://127.0.0.1:8000/restaurants')
      .then((response) => response.json())
      .then((resData) => {
        // console.log(resData.restaurants);
        this.setState({data: resData.restaurants});
      })

      .catch((error) => console.log(error))
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
            const itemData = `${item.toUpperCase()}`;
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
                 onRequestClose={ () => { this.ShowModalFunction(!this.state.ModalVisible)} } >
                 <View style={{ flex:1, justifyContent: 'center', alignItems: 'center' }}>
                  <View>
                     <Text style={styles.restaurant_name}>{this.state.modalData}</Text>
                    {/* <Text style={styles.resaturant_address}> Address: {this.state.modalData.address}</Text> */}
                    {/* <Text> Tags: {this.state.modalData.type}</Text> */}
                    <Button title="Add to an existing map"/>
                    <Button title="Create a new map"/>
                    <Button  title="Go back" onPress={() => { this.showModal(!this.state.ModalVisible)} } />
                  </View>
                </View>
              </Modal>
              
              <FlatList
                extraData={this.state}
                data={this.state.currentDataList}
                renderItem={({ item }) => 

                <TouchableOpacity onPress={() => { this.onPressShow(item) }}>
                  <View>
                    <Text style={styles.restaurant_name}>{item}</Text>
                    {/* <Text style={styles.resaturant_address}> Address: {item.address}</Text> */}
                    {/* <Text> Tags: {item.type}</Text> */}
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
