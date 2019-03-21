import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import Login from '../components/Login'
import ProfilePage from '../screens/ProfilePage'

const HomeNavigator= createStackNavigator ({
    Home: { screen: Login},
    Profile: {screen: Profile}
        }, {
         navigationOptions: {
            header: false,
    }
});
 

const AppNavigator=createAppContainer(HomeNavigator);

export default AppNavigator;

