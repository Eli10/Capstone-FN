// @Author:Cesar Guzman
//
// File: this file implements the star(pizza) rating functionality seen from your
//
// maps and friends maps
//
// All functionality was authored by Cesar Guzman save for the credentialling
//
// on the navigation, the get restaurant ID function, getrating(), getuserscurrentfriends()
//
// and the postreview to post reviews which was done by Elijah Augustin
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


  // Sizing of the "star" icons author:CG
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

    // This is the implemented refresh function
    //
    // refreshes the view and queries current friends and ResID when
    //
    // the star rating page is loaded
    //
    // @author CG
    componentDidMount() {
      this.props.navigation.addListener('willFocus', (route) => {
        this.getUsersCurrentFriends();
        this.getRestaurantId();
      });

    }

    // Function gets the current restaurants ID to allow for review posting
    //
    // @author: Elijah Augustin
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

    //Function getRatings() accepts a restaurant (the current restaurant) and loads its ratings and reviews
    //
    // @author Elijah Augustin
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

  // Function postRating is called on the save-rating button press
  //
  // @author: Elijah Augsutin
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

  // Function getUsersCurrentFriends() returns users friends in the event
  //
  // that a friend is added in the current session
  //
  // @author Elijah Augustin
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

  // Function sets current rating to whatever the user selects
  //
  // @author CG
  onGeneralStarRatingPress(rating) {
    this.setState({
      generalStarCount: rating,
    });
  }

  // Function sets the maximum number of ratings a user can select
  //
  // @author CG
  onCustomStarRatingPress(rating) {
    this.setState({
      customStarCount: rating,
    });
  }

  // Function stores the text of the review into the state
  //
  // @author CG
  storeText = (text) => {
    this.setState({newRating: text});
  }

  // This function is called when the cancel button is pressed, returns the
  //
  // user to their original page
  //
  // @pre User wishes to return to the previous page
  //
  // @post User is returned to their original page
  //
  // @param x The PageID, which is used to decide what page they will be navigated to
  //
  // @author CG
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

  // This function shows a dialogue letting the user know that their rating was saved
  //
  // then navigates them to their original page
  //
  // @pre User has chosen a number of pizza icons as their rating and has
  //
  // left a review to be submitted
  //
  // @post The users rating and review is saved and they are taken to their original page
  //
  // @author CG
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

    // The render function displays the rating option, the textbox,
    //
    // cancel and submit review buttons and the current restaurant ratings
    //
    // @author CG
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

  // StyleSheet for the implemented components above
  //
  // @author CG
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
