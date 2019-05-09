

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
    componentDidMount () {
        this.props.navigation.addListener('willFocus', (route) => {this.getRatings()});
    }
    constructor(props) {
        super(props);

        const {navigation} = this.props;
        const username = navigation.getParam('username', 'Blah');
        const access_token = navigation.getParam('access_token', 'Blah');
        const refresh_token = navigation.getParam('refresh_token', 'Blah');

        const resName = navigation.getParam('restname');
        const resAddr = navigation.getParam('restAddr');
        const pageCode = navigation.getParam('PAGEID');
        console.log(resName);
        console.log(resAddr);

        this.state = {
            generalStarCount: 0,
            customStarCount: 0,
            wordcount: '',
            username: username,
            access_token: access_token,
            refresh_token: refresh_token,
            resName: resName,
            resAddr: resAddr,
            pageCode: pageCode,
            temporaryRestaurantId: 0,
            newRating: "",
            Reviews: [
                {
                    "username": "Hey It's Us!",
                    "rating": 5,
                    "review": "No one has reviewed this restaurant yet...be the first!"
                },
            ]
        };
    }

    componentDidMount() {
        this.getRestaurantId()

    }

    getRestaurantId = () => {
      let url = 'http://10.0.2.2:3000/restaurants/id/' + this.state.resName + '/' + this.state.resAddr;

      console.log(url);
      fetch(url, {
          method: 'GET',
          mode: 'no-cors',
          headers: { 'Authorization': 'Bearer '.concat(this.state.access_token) }
      })
      .then((response) => response.json())
      .then((resData) => {
          this.setState({temporaryRestaurantId: resData.id});
          console.log(resData);
          console.log(resData.id);
          console.log(resData.id);
          this.getRatings(this.state.temporaryRestaurantId)
      })
      .catch((error) => console.log(error))
    }

    getRatings = (resId) => {

        let url = 'http://10.0.2.2:3000/reviews/restaurant/' + resId;
        console.log(url);
        fetch(url, {
            method: 'GET',
            mode: 'no-cors',
            headers: { 'Authorization': 'Bearer '.concat(this.state.access_token) }
        })
        .then((response) => response.json())
        .then((resData) => {this.setState({Reviews: resData.reviews});
        })
      .catch((error) => console.log(error))
    }

    postRating = () => {

        console.log(`Rest ID: ${this.state.temporaryRestaurantId}`);
        var header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(this.state.access_token)
        };
        fetch('http://10.0.2.2:3000/reviews', {
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
        console.log(this.state.newRating);
    }

    SavedRating = (x) => {
        console.log(`Rating ${this.state.newRating}`);
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
        } else {
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
                <Button style={styles.button}


                        title="Press to Save Rating"
                        color="#DC143C"
                        onPress={() => {
                            this.SavedRating(this.state.pageCode)
                        }}

                />
                <Text> {"\n"} </Text>
                <ScrollView style={{borderRadius: 10,}}>
                    {
                        this.state.Reviews.map((item, index) => (
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
                        ))
                    }
                </ScrollView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EBD8D8',
    },
    star: {
        paddingHorizontal: 6,
        opacity: 0,
    },
    button: {

        paddingTop: 85,
        borderColor: 'black',
        borderWidth: 3,

        borderRadius:10,
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
    item: {


        flexDirection: 'row',
        backgroundColor: 'pink',
        height: 60,
        width: Dimensions.get('window').width - 10,
        borderRadius:10,
        borderColor: 'black',
        borderWidth: 1,
        margin: 5,


    },
    reviewUsername: {
        textAlignVertical:'top',
        textAlign:'left',
        margin:10,
        position:'relative'

    },
    reviewComment:{
        textAlignVertical:'bottom',
        textAlign:'left',
        position:'absolute',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        top: 20,
        margin:5,

    }});
