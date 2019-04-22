import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import Login from '../components/Login'
import ProfilePage from '../screens/ProfilePage'
import HomeScreen from '../screens/HomeScreen';
import Ratings from '../screens/StarRating';
import SearchScreen from '../screens/SearchScreen';
import FriendScreen from '../screens/Friendscreen';


// const HomeNavigator= createStackNavigator ({
//     Home: { screen: Login},
//     ProfilePage: {screen: ProfilePage}
// }, {
//     navigationOptions: {
//         header: false,
//     }
// });
//
// const MapNavigator= createStackNavigator ({
//     Maps: { screen: HomeScreen},
//     Star: {screen: Ratings}
//     }, {
//         navigationOptions: {
//             header: false,
//     }
// });
//
//
// const backtomap= createStackNavigator ({
//     Star: {screen: Ratings},
//     Maps: { screen: HomeScreen},
// }, {
//     navigationOptions: {
//         header: false,
//     }
// });
//
// const FriendNavigator= createStackNavigator ({
//     Friends: {screen: FriendScreen},
//     Star: {screen: Ratings}
// }, {
//     navigationOptions: {
//         header: false,
//     }
// });
//
// const backtofriends = createStackNavigator ({
//     Star: {screen: Ratings},
//     Friends: {screen: FriendScreen}
// }, {
//     navigationOptions: {
//         header: false,
//     }
// })

const AppNavigator=createAppContainer(MainTabNavigator);

export default AppNavigator;
