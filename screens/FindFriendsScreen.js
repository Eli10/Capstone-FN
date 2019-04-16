import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Modal, Button} from 'react-native';

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

    render() {
        return(
           <View>
               <Text>Hello I am here to find friends</Text>
           </View> 
        )
    }
}