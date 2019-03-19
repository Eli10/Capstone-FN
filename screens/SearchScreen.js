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
            data: restaurantList,
            error: null,
            value: '',
            ModalVisible: false
        };
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

        const newData = restaurantList.filter(item => {
            const itemData = `${item.name.toUpperCase()} ${item.type.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.includes(textData);
          });

        this.setState({
            data: newData,
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

    // onPress = (item) => {
    //   this.props.navigation.navigate('Details', {
    //     name: item.name,
    //     address: item.address,
    //     tags: item.type
    //   });
    // };

    showModal(visible) {
      this.setState({ModalVisible: visible});
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
 
          onRequestClose={ () => { this.ShowModalFunction(!this.state.ModalVisible)} } >
 
 
            <View style={{ flex:1, justifyContent: 'center', alignItems: 'center' }}>
 
 
                <View>
 
 
                    {/* Put All Your Components Here, Which You Want To Show Inside The Modal. */}
 
                    <Text>Text Component With Some Sample Text In Modal. </Text>
 
                    <Button  title="Click Here To Hide Modal" onPress={() => { this.showModal(!this.state.ModalVisible)} } />
 
                    {/* Put All Your Components Here, Which You Want To Show Inside The Modal. */}
 
 
                </View>
 
            </View>
 
 
        </Modal>
              <FlatList
                extraData={this.state}
                data={this.state.data}
                renderItem={({ item }) => 

                <TouchableOpacity onPress={() => { this.showModal(true) }}>
                  <View>
                    <Text style={styles.restaurant_name}>{item.name}</Text>
                    <Text style={styles.resaturant_address}> Address: {item.address}</Text>
                    <Text> Tags: {item.type}</Text>
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

// class DetailsScreen extends React.Component {
//   render() {
//     const { navigation } = this.props;
//     const name = navigation.getParam('name', 'NO-ID');
//     const address = navigation.getParam('address', 'no title');
//     const tags = navigation.getParam('tags', 'no tag');

//     return (
//       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <Text>Details Screen</Text>
//         <Text>Name: {JSON.stringify(name)}</Text>
//         <Text>Address: {JSON.stringify(address)}</Text>
//         <Text>Tags: {JSON.stringify(tags)}</Text>
//       </View>
//     );
//   }
// }

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
