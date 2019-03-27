import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
//import TabBarIcon2 from '../components/TabBarIcon2';
import HomeScreen from '../screens/HomeScreen';
import FriendScreen from '../screens/Friendscreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import SearchScreen from '../screens/SearchScreen';
import FontAwesome from '../node_modules/react-native-vector-icons/FontAwesome' 
import ProfilePage from '../screens/ProfilePage';
import Login from '../components/Login';
import RegisterPage from '../screens/RegisterPage';

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
          ? `ios-map`
          : 'md-map'
      }
    />
  ),
};

const FriendStack = createStackNavigator({
  Links: FriendScreen,
});

FriendStack.navigationOptions = {
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

//SETTINGS NEED TO BE EDITED PLS SEE DISCOVERSCREEEN.JS IN SCREENS FOLDER
const DiscoverStack = createStackNavigator({
  Settings: DiscoverScreen,
});

DiscoverStack.navigationOptions = {
  tabBarLabel: 'Discover',
  tabBarIcon: ({ focused }) => (
   <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? "ios-arrow-dropright-circle" : "ios-arrow-dropright-circle"}
    />
  ),
};

//SETTINGS NEED TO BE EDITED PLS SEE PROFILEPAGE.JS IN SCREENS FOLDER
const ProfileStack = createStackNavigator({
    Home: { screen: Login},
    ProfilePage: { screen: ProfilePage },
    RegisterPage: { screen: RegisterPage }
        }, {
         navigationOptions: {
            header: false,
        }
});

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
   <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? "ios-person" : "ios-person"}
    />
  ),
};


export default createBottomTabNavigator({
  HomeStack,
FriendStack,  
SearchStack,  
  DiscoverStack,
 ProfileStack
});
