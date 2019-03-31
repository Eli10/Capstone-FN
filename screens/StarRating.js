import React, { Component } from 'react';
import {Dialog, StyleSheet, Text, View, Button, Alert } from 'react-native';

import StarRating from 'react-native-star-rating';
import {Header,createStackNavigator, createAppContainer, StackNavigator} from 'react-navigation'

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            generalStarCount: 0,
            customStarCount: 0,
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
    'Rating Saved',
    'Thank You! Your record has been saved!',
    [


        {text: 'OK', onPress: () => console.log('OK Pressed')},
    ],
    {cancelable: false},);

        this.props.navigation.navigate('Maps')}

    render() {
        return (
            <View style={styles.container}>


                <Text style={styles.rating}>  Submit a Review! </Text>
                <Text>  {"\n"} {"\n"}{"\n"}{"\n"}</Text>

                <StarRating

                    disabled={false}
                    emptyStar="ios-star-outline"
                    fullStar="ios-star"
                    halfStar="ios-star-half"
                    iconSet="Ionicons"
                    maxStars={5}
                    rating={this.state.customStarCount}
                    selectedStar={rating => this.onCustomStarRatingPress(rating)}
                    fullStarColor="red"
                    halfStarColor="red"
                    emptyStarColor="blue"
                    halfStarEnabled
                    starPadding={10}
                />
                <Text>  {"\n"} {"\n"} </Text>
                <Button style={styles.button}

                    title="Press to Save Rating"
                    color="#DC143C"
                    onPress={() => {this.SavedRating()}}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    star: {
        paddingHorizontal: 6,
        opacity: 0,
    },
    button: {
      paddingTop: 85,
    },
    rating: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});