

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



var {MAXHstar, MAXWstar} = Dimensions.get('window');
var textheight = MAXHstar / 4;
var textwid = MAXWstar - 20;

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            generalStarCount: 0,
            customStarCount: 0,
            wordcount: '',
            Reviews: [
                {
                    "username": "Eli",
                    "rating": 2,
                    "review": "hated the apple pies"
                },
                {
                    "username": "Bob",
                    "rating": 4,
                    "review": "Liked the apple pies"
                },
                {
                    "username": "Sarah",
                    "rating": 3,
                    "review": "asasdsdasdasd"
                },
                {
                    "username": "Kermit",
                    "rating": 5,
                    "review": "adasdasdasdasdasdasdasd"
                },
                {
                    "username": "Paul",
                    "rating": 2,
                    "review": "dsafdsfldsfnsdklfdf"
                },
                {
                    "username": "Julie",
                    "rating": 2,
                    "review": "asfadsfsdfjnsdfsdklfmfsd"
                },
                {
                    "username": "Opie",
                    "rating": 1,
                    "review": "sadlmdsflksdnfn"
                },
                {
                    "username": "Jamal",
                    "rating": 1,
                    "review": "sasDSADSADLSAD"
                },
                {
                    "username": "Elie",
                    "rating": 3,
                    "review": "asdasdnlkasdn"
                },
                {
                    "username": "Jake",
                    "rating": 4,
                    "review": "ajskdklasdnlasdn"
                }
            ]
        };
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



    SavedRating = () => {Alert.alert(
        "Rating Saved",
        "Your Rating and Review has been submitted and will be added to this Restaurant's list of reviews",
        [


            {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},);


        this.props.navigation.navigate('Maps')}

    render() {
        return (
            <View style={styles.container}>


                <Text style={styles.rating}>  Submit a Rating, Leave a Review! </Text>


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
                    editable = {true}
                    maxLength = {130}
                    style = {styles.inputbox}
                    placeholder = 'Enter Text Here, Press the Button Below to Submit'
                    multiline = {true}
                    onChangeText={(wordcount) => this.setState({wordcount})}

                />
                <Text>
                    Characters Remaining: {130 - this.state.wordcount.length}/130
                </Text>
                <Text> {"\n"} </Text>
                <Button style={styles.button}


                        title="Press to Save Rating"
                        color="#DC143C"
                        onPress={() => {this.SavedRating()}}

                />
                <Text> {"\n"} </Text>
                <ScrollView style={{  borderRadius:10,}}>
                    {
                        this.state.Reviews.map((item, index) => (
                            <View key = {item.username} style = {styles.item}>
                                <Text>{item.username} : {item.rating}

                                    {"\n"}
                                    {item.review}</Text>

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
        backgroundColor: 'white',
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
        height: 30,
        backgroundColor: '#ffffff',
        paddingLeft: 15,
        paddingRight: 15,
        height: Dimensions.get('window').height / 6 ,
        width: Dimensions.get('window').width - 40,
        borderColor: 'black',

        borderWidth: 1,

    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#F1E9E7',
        height: 'auto',
        width: Dimensions.get('window').width,
        borderRadius:10,

    }});

