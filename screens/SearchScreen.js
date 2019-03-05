import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { View, Text, FlatList, ActivityIndicator} from 'react-native';
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
            value: ''
        };
    }

    renderSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: '86%',
              backgroundColor: '#CED0CE',
              marginLeft: '14%',
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
              <FlatList
                extraData={this.state}
                data={this.state.data}
                renderItem={({ item }) => (
                  <Text>{item.name} {item.type}</Text>
                )}
                ItemSeparatorComponent={this.renderSeparator}
                ListHeaderComponent={this.renderHeader}
              />
            </View>
          );
    }
}
