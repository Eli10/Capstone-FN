//Author:Jasmine Wong
//
//File: This file implements the find friends (6th icon on tab bar)
//
//that allows for adding users who use the app,
//
//but are not the user's friends

import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import {Button} from 'react-native-elements';

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

  //As soon as the Find Friends tab is loaded,
  //
  //the getUsersCurrentFriends and populateFindFriendsList
  //
  //functions are called
  componentDidMount(){
    this.props.navigation.addListener('willFocus', (route) => {
      this.getUsersCurrentFriends();
      this.populateFindFriendsList();
    });
  }

  //this function calls the users/list endpoint to
  //
  //find all the users in the app
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
      if(this.state.tempFriends.length == 0)
      {
        Alert.alert("Oops!",
            "Looks like you've added everyone under the sun! Please come back later.",[
              {text: 'Dismiss'},
            ],{cancelable: false},);
      }
    })
    .catch((error) => console.log(error))
  }

  //This function calls the users/friends endpoint to find all
  //
  // the user's friends in the app
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

  //This function calls the users/follows endpoint
  //
  //when a user requests to follow a new friend
  //
  // @param userToFollow username of user to follow
  followNewFriend = (userToFollow) => {
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

  //This function styles the header of the page (above the list of potential friends)
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
    const {navigate} = this.props.navigation;
    return(
      <ScrollView style={{backgroundColor:'rgb(246,192,99)'}}>
          <FlatList
              data={this.state.tempFriends}

              renderItem={({ item }) =>
              <TouchableOpacity onPress={() => {console.log('Touched Button')}}>
                  <View style={styles.listContainer}>
                  <View style={{ flexDirection:"column"}}>
                    <Text style={styles.name}>{item.username}</Text>
                    <Text style={styles.name}>Favorite Borough: {item.favBorough}</Text>
                  </View>
                  <View style={styles.addFriendContainer}>
                      <Button
                          onPress={() => { this.followNewFriend(item.username);
                          navigate('Friends', {
                            token: this.state.access_token,
                            user: this.state.username });
                          Alert.alert("Friend Added",
                            "Lets check out your new friend's maps",[
                              {text: 'Dismiss'},
                            ],{cancelable: false},);}}
                          type="outline"
                          iconLeft
                          title="Add Friend"
                      />
                  </View>
                  </View>
              </TouchableOpacity>
              }
              ItemSeparatorComponent={this.renderSeparator}
              />
      </ScrollView>
    )
  }
}

// This is the styling sheet for how the friends are displayed in the flatlist
const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#F0FFFF',
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
  addFriendContainer: {
    marginTop:10,
    marginBottom:10,
    paddingTop:0.1,
    paddingBottom:0.1,
    backgroundColor:'white',
    borderRadius:50,
    borderWidth: 0.2,
    borderColor: 'blue',
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    color:"#0047ab",
    marginLeft: 10,
    top: 3,
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
