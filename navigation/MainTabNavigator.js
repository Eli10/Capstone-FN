import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import TabBarIcon2 from '../components/TabBarIcon2';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import SearchScreen from '../screens/SearchScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Your Maps',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-map${focused ? '' : '-outline'}`
          : 'md-map'
      }
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Friends Maps',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-contacts' : 'md-contacts'}
    />
  ),
};

const SearchStack = createStackNavigator({
  Search: SearchScreen,
});

SearchStack.navigationOptions = {
  tabBarLabel: 'Search Maps',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'}
    />
  ),
};


const DiscoverStack = createStackNavigator({
  Settings: DiscoverScreen,
});

DiscoverStack.navigationOptions = {
  tabBarLabel: 'Discover',
  tabBarIcon2: ({ focused }) => (
    <TabBarIcon2
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-dyalog' : 'md-dyalog'}
    />
  ),
};



export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SearchStack,
  DiscoverStack
});
