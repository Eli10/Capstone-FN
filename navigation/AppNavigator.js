import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import Login from '../components/Login'
import ProfilePage from '../screens/ProfilePage'
import Maps from '../screens/HomeScreen';
import Search from '../screens/SearchScreen';


const HomeNavigator= createStackNavigator ({
    Home: { screen: Login},
    ProfilePage: {screen: ProfilePage}
        }, {
         navigationOptions: {
            header: false,
    }
});

const MapNavigator= createStackNavigator ({
    Maps: { screen: Maps},
    Search: {screen: Search}
}, {
    navigationOptions: {
        header: false,
    }
});
const AppNavigator=createAppContainer(MainTabNavigator);

export default AppNavigator;

