import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';

const AppNavigator=createAppContainer(MainTabNavigator);

export default AppNavigator;
