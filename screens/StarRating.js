/**
 Author:Cesar Guzman
 file: this file implements the star(pizza) rating functionality seen from your maps and friends maps
 **/
import React, { Component } from 'react';
import {FlatList,
  ScrollView,
  Dimensions,
  TextInput,
  AppRegistry,
  Dialog,
  StyleSheet,
  Text,
  View,
  Button,
  Alert } from 'react-native';
  import StarRating from 'react-native-star-rating';
  import {Header,createStackNavigator, createAppContainer, StackNavigator} from 'react-navigation'
  import Icon from "react-native-vector-icons/Ionicons";
  import {Rating, AirbnbRating } from 'react-native-elements';

  var {MAXHstar, MAXWstar} = Dimensions.get('window');
  var textheight = MAXHstar / 4;
  var textwid = MAXWstar - 20;
  export default class App extends Component {
    constructor(props) {
      super(props);

      const {navigation} = this.props;
      const username = navigation.getParam('user');
      const resName = navigation.getParam('restname');
      const resAddr = navigation.getParam('restAddr');
      const pageCode = navigation.getParam('PAGEID');
      const access_token = navigation.getParam('token');
      console.log(`PAGE CODE ${pageCode}`);

      this.state = {
        generalStarCount: 0,
        customStarCount: 0,
        wordcount: '',
        username: username,
        access_token: access_token,
        resName: resName,
        resAddr: resAddr,
        pageCode: pageCode,
        temporaryRestaurantId: 0,
        newRating: "",
        Reviews: [
          {
          },
        ],
        usersCurrentFriends: [],
        friendsReviews: []
      };
    }
    componentDidMount() {
      this.props.navigation.addListener('willFocus', (route) => {
        this.getUsersCurrentFriends();
        this.getRestaurantId();
      });

    }
    getRestaurantId = () => {
      let url = 'https://capstone-express-gateway.herokuapp.com/restaurants/id/' + this.state.resName + '/' +   this.state.resAddr;
      console.log(url);
      fetch(url, {
        method: 'GET',
        mode: 'no-cors',
        headers: { 'Authorization': 'Bearer '.concat(this.state.access_token) }
      })
      .then((response) => response.json())
      .then((resData) => {
        this.setState({temporaryRestaurantId: resData.id});
        this.getRatings(this.state.temporaryRestaurantId)
      })
      .catch((error) => console.log(error))
    }
    //getRatings accepts a restaurant (the current restaurant) and loads its ratings and reviews
    getRatings = (resId) => {
      let url = 'https://capstone-express-gateway.herokuapp.com/reviews/restaurant/' + resId;
      fetch(url, {
        method: 'GET',
        mode: 'no-cors',
        headers: { 'Authorization': 'Bearer '.concat(this.state.access_token) }
      })
      .then((response) => response.json())
      .then((resData) => {
        let resReviews = resData.reviews;
        let friendReviewsList = resReviews.filter(review => this.state.usersCurrentFriends.includes(review.username) );
        let otherReviews = resReviews.filter(review => !(this.state.usersCurrentFriends.includes(review.username)) );
        this.setState({Reviews: otherReviews});
        this.setState({friendsReviews: friendReviewsList});
      })
    .catch((error) => console.log(error))
  }

  //postrating is called on the save-rating button press
  postRating = () => {
    var header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(this.state.access_token)
    };
    fetch('https://capstone-express-gateway.herokuapp.com/reviews', {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        username: this.state.username,
        restaurant_id: this.state.temporaryRestaurantId,
        restaurant_name: this.state.resName,
        comment: this.state.wordcount,
        rating: this.state.customStarCount,
      }),
    })
    .catch(err => console.log(err))
  }

  //returns users friends in the event that a friend is added in the current session
  getUsersCurrentFriends = () => {
    let url = "https://capstone-express-gateway.herokuapp.com/users/friends/"+this.state.username;
    fetch (url, {
      method: 'GET',
      mode: 'no-cors',
      headers: { 'Authorization': 'Bearer '.concat(this.state.access_token) }
    })
    .then((response) => response.json())
    .then((resData) => {
      this.setState({usersCurrentFriends: resData.friends});
    })
    .catch((error) => console.log(error))
  }
  onGeneralStarRatingPress(rating) {
    this.setState({
      generalStarCount: rating,
    });
  }

  onCustomStarRatingPress(rating) {
    this.setState({
      customStarCount: rating,
    });
  }

  storeText = (text) => {
    this.setState({newRating: text});
  }

  //this function is called when the cancel button is pressed, returns the
   //user to their original page
  cancel = (x) => {
    if (x == 100) {
      this.props.navigation.navigate('Maps', {
        username: this.state.username,
        access_token: this.state.access_token,
        refresh_token: this.state.refresh_token
      })
    } else if (x== 101) {
      this.props.navigation.navigate('Friends', {
        username: this.state.username,
        access_token: this.state.access_token,
        refresh_token: this.state.refresh_token
      })
    }
    else if (x == 102) {
      this.props.navigation.navigate('Discover', {
        username: this.state.username,
        access_token: this.state.access_token,
        refresh_token: this.state.refresh_token
      })
    }
  }

  //this button shows a dialogue letting the user know that their rating was saved
  SavedRating = (x) => {
    this.postRating();
    Alert.alert(
      "Rating Saved",
      "Your Rating and Review has been submitted and will be added to this Restaurant's list of reviews",
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},);

      if (x == 100) {
        this.props.navigation.navigate('Maps', {
          username: this.state.username,
          access_token: this.state.access_token,
          refresh_token: this.state.refresh_token
        })
        this.props.navigation.navigate('Profile', {
          username: this.state.username,
          access_token: this.state.access_token,
          refresh_token: this.state.refresh_token
        })
      } else if (x == 101) {
        this.props.navigation.navigate('Friends', {
          username: this.state.username,
          access_token: this.state.access_token,
          refresh_token: this.state.refresh_token
        })
        this.props.navigation.navigate('Profile', {
          username: this.state.username,
          access_token: this.state.access_token,
          refresh_token: this.state.refresh_token
        })
      } else if (x == 102) {
        this.props.navigation.navigate('Discover', {
          username: this.state.username,
          access_token: this.state.access_token,
          refresh_token: this.state.refresh_token
        })
        this.props.navigation.navigate('Profile', {
          username: this.state.username,
          access_token: this.state.access_token,
          refresh_token: this.state.refresh_token
        })
      }
    }

    render() {
      return (
        <View style={styles.container}>
                <View style={{justifyContent:'center', alignItems:'center'}}>
                <Text style={styles.rating}> Submit a Rating, Leave a Review! </Text>
                <StarRating
                    disabled={false}
                    emptyStar="md-pizza"
                    fullStar="md-pizza"
                    iconSet="Ionicons"
                    maxStars={5}
                    rating={this.state.customStarCount}
                    selectedStar={rating => this.onCustomStarRatingPress(rating)}
                    fullStarColor="red"
                    emptyStarColor="#BCBABA"
                    starPadding={30}
                />
                <TextInput
                    // Inherit any props passed to it; e.g., multiline, numberOfLines below
                    editable={true}
                    maxLength={130}
                    style={styles.inputbox}
                    placeholder='Enter Text Here, Press the Button Below to Submit'
                    multiline={true}
                    onChangeText={(wordcount) => {this.setState({wordcount})}}
                />
                <Text color={'white'}>
                    Characters Remaining: {130 - this.state.wordcount.length}/130
                </Text>
                <Text> {"\n"} </Text>
                </View>
                <View style={styles.overallButtonContainer}>
                    <Button style={styles.button}
                        title="Press to Save Rating"
                        color="#DC143C"
                        onPress={() => {
                        this.SavedRating(this.state.pageCode)}}
                    />
                    <Button style={styles.button2}
                        title="Cancel"
                        color="blue"
                        onPress={() => {
                        this.cancel(this.state.pageCode)
                        }}
                    />
                </View>
                <Text> {"\n"} </Text>
                <ScrollView style={{borderRadius: 10,}}>
                  <View style={{justifyContent: 'center', alignItems:'center'}}>
                    {this.state.friendsReviews.map((item, index) => (
                    <View key={item.username} style={styles.item}>
                        <Text style={{textVerticalAlign: 'top'}}>
                            <Text style={styles.reviewUsername}>{item.username} :</Text>
                        </Text>
                        <StarRating
                            disabled={true}
                            emptyStar="md-pizza"
                            fullStar="md-pizza"
                            iconSet="Ionicons"
                            maxStars={item.rating}
                            rating={this.state.customStarCount}
                            fullStarColor="red"
                            starSize={20}
                            emptyStarColor="red"
                        />
                        <Text>{"\n"}</Text>
                        <Text style={styles.reviewComment}>{item.review}</Text>
                    </View>
                    ))}
                {this.state.Reviews.map((item, index) => (
                    <View key={item.username} style={styles.item2}>
                        <Text style={{textVerticalAlign: 'top'}}>
                            <Text style={styles.reviewUsername}>{item.username} :</Text>
                        </Text>
                        <StarRating
                            disabled={true}
                            emptyStar="md-pizza"
                            fullStar="md-pizza"
                            iconSet="Ionicons"
                            maxStars={item.rating}
                            rating={this.state.customStarCount}
                            fullStarColor="red"
                            starSize={20}
                            emptyStarColor="red"
                        />
                        <Text>{"\n"}</Text>
                        <Text style={styles.reviewComment}>{item.review}</Text>
                    </View>
                    ))}
                  </View>
            </ScrollView>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgb(246,192,99)',
    },
    star: {
      paddingHorizontal: 6,
      opacity: 0,
    },
    button: {
      paddingTop: 85,
      paddingRight:5,
      borderRadius:10,
    },
    button2: {
      paddingTop: 85,
      borderColor: 'black',
      borderWidth: 3,
      borderRadius:10,
      margin: 5,
      width: Dimensions.get('window').width / 4,
    },
    rating: {
      fontWeight: 'bold',
      fontSize: 16,
      padding: 20,
    },
    inputbox: {
      backgroundColor: '#ffffff',
      paddingLeft: 15,
      paddingRight: 15,
      height: Dimensions.get('window').height / 6 ,
      width: Dimensions.get('window').width - 40,
      borderColor: 'black',
      borderRadius:10,
      borderWidth: 1,
    },
    reviewTitle: {
      color:"#0047ab",
      fontSize: 28,
    },
    item: {
      flexDirection: 'row',
      backgroundColor: 'pink',
      height: 75,
      borderRadius:10,
      borderColor: 'black',
      borderWidth: 1,
      margin: 5,
      width: Dimensions.get('window').width - 20,
    },
    item2: {
      flexDirection: 'row',
      backgroundColor: '#F0FFFF',
      height: 75,
      borderRadius:10,
      borderColor: 'black',
      borderWidth: 1,
      margin: 5,
      width: Dimensions.get('window').width - 20,
    },
    reviewUsername: {
      textAlignVertical:'top',
      textAlign:'left',
      margin:10,
      position:'relative',
    },
    reviewComment:{
      textAlignVertical:'bottom',
      textAlign:'left',
      position:'absolute',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      top: 20,
      margin:5,
    },
    overallButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      borderRadius: 10,
      alignItems:'center',
      margin:5,
    }});
