import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Modal, List} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

export default class FindFriendsScreen extends React.Component {
    static navigationOptions = {
        title: 'Find Friends',
    };
    constructor(props){
        super(props);
        this.state = {
            tempFriends: [
                {"first": "Jasmine", "last": "Wong"},
                {"first": "Bob", "last": "Malone"},
                {"first": "Mikey", "last": "Lehman"},
            ]
        };
    }


    componentDidMount(){
      console.log('HEILLO');
      const { navigation } = this.props;
      const username = navigation.getParam('username', 'Blah');
      const access_token = navigation.getParam('access_token', 'Blah');
      const refresh_token = navigation.getParam('refresh_token', 'Blah');
      console.log(access_token);

      fetch ('http://localhost:3000/users/list', {
          method: 'GET',
          mode: 'no-cors',
          headers: { 'Authorization': 'Bearer '.concat(access_token) }
      })
      .then((response) => response.json())
      .then((resData) => {
        console.log(resData.users);
        this.setState({tempFriends: resData.users});
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

    render() {
        return(
            <View>
               <FlatList
                      data={this.state.tempFriends}
                      renderItem={({ item }) =>

                       <TouchableOpacity onPress={() => {console.log('hello')}}>
                        <View>
                          <Text style={styles.name}>{item.username}</Text>
                          <Button style={styles.btn}
                            icon={
                              <Icon
                                name="add-circle-outline"
                                size={15}
                                color="black"
                              />
                            }
                            type="outline"
                            iconLeft
                            title="Add Friend"
                            />
                        </View>
                       </TouchableOpacity>

                      }
                      ItemSeparatorComponent={this.renderSeparator}
                    />
           </View>
        )
    }
}

const styles = StyleSheet.create({

    name: {
      fontSize: 20,
      marginLeft:10,
    },

    btn : {
    marginTop:10,
    marginBottom:10,
    paddingTop:0.1,
    paddingBottom:0.1,
    marginLeft: 120,
    marginRight: 120,
    backgroundColor:'white',
    borderRadius:50,
    borderWidth: 0.2,
    borderColor: 'blue'
      },

    icon: {
        position: 'absolute',
        left:18,
        top:9,
        fontSize:30,
      },

      wrapper: {
        padding:5,
      }
})
