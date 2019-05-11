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

        const { navigation } = this.props;
        const username = navigation.getParam('username', 'Blah');
        const access_token = navigation.getParam('access_token', 'Blah');
        const refresh_token = navigation.getParam('refresh_token', 'Blah');
        console.log(username);

        this.state = {
            tempFriends: [],
            usersCurrentFriends: [],
            username: username,
            access_token: access_token,
            refresh_token: refresh_token,
        };
    }

    componentDidMount(){
      console.log('HEILLO');
      this.getUsersCurrentFriends();
      this.populateFindFriendsList();
    }

    populateFindFriendsList = () => {
        fetch ('https://capstone-express-gateway.herokuapp.com/users/list', {
            method: 'GET',
            mode: 'no-cors',
            headers: { 'Authorization': 'Bearer '.concat(this.state.access_token) }
        })
        .then((response) => response.json())
        .then((resData) => {
          //Filter Friends List to Remove Current user logged in and current friends of user
          var filteredUserList = resData.users.filter(user => user.username != this.state.username);
          var filteredFriendsList = filteredUserList.filter(user => this.state.usersCurrentFriends.includes(user.username) == false);
          this.setState({tempFriends: filteredFriendsList});
        })
        .catch((error) => console.log(error))
    }

    getUsersCurrentFriends = () => {
        fetch ("https://capstone-express-gateway.herokuapp.com/users/friends/"+this.state.username, {
            method: 'GET',
            mode: 'no-cors',
            headers: { 'Authorization': 'Bearer '.concat(this.state.access_token) }
        })
        .then((response) => response.json())
        .then((resData) => {
          console.log(resData.friends);
          this.setState({usersCurrentFriends: resData.friends});
        })
        .catch((error) => console.log(error))
    }

    followNewFriend = (userToFollow) => {

        console.log(`New friend to follow: ${userToFollow}`)

        fetch ('https://capstone-express-gateway.herokuapp.com/users/follows', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Authorization': 'Bearer '.concat(this.state.access_token),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.username,
                follows: userToFollow,
            })
        })
        .then((response) => console.log(`Now Following: ${userToFollow}`))
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

                       <TouchableOpacity onPress={() => {console.log('Touched Button')}}>
                        <View>
                          <Text style={styles.name}>{item.username}</Text>
                          <Button style={styles.btn}
                            onPress={() => { this.followNewFriend(item.username) }}
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
