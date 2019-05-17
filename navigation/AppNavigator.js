// Author: Cesar Guzman
import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';

// Contains the entire Navigation Scheme of the App
const AppNavigator=createAppContainer(MainTabNavigator);

export default AppNavigator;
