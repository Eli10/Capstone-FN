import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import Login from '../components/Login'
import ProfilePage from '../screens/ProfilePage'

const HomeNavigator= createStackNavigator ({
    Home: { screen: Login},
    ProfilePage: {screen: ProfilePage}
        }, {
         navigationOptions: {
            header: false,
    }
});
 

const AppNavigator=createAppContainer(MainTabNavigator);

export default AppNavigator;

