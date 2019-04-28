import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';

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
import Maps from '../screens/HomeScreen';
import Ratings from '../screens/StarRating';
import FindFriendsScreen from '../screens/FindFriendsScreen';

const HomeStack = createSwitchNavigator({

  Maps: {screen: HomeScreen},
  Star: { screen: Ratings },
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

const backtomap= createSwitchNavigator ({

    Star: {screen: Ratings},
    Maps: { screen: HomeScreen},
    },
);

const FriendStack = createSwitchNavigator({
    Friends: {screen: FriendScreen},
    Star: {screen: Ratings}
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

const SearchStack = createSwitchNavigator({
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
const DiscoverStack = createSwitchNavigator({
    Discover: DiscoverScreen,
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

//SETTINGS NEED TO BE EDITED PLS SEE FINDFRIENDSSCREEN.JS IN SCREENS FOLDER
const FindFriendsStack = createSwitchNavigator({
    FindFriends: FindFriendsScreen,
});

FindFriendsStack.navigationOptions = {
    tabBarLabel: 'Find Friends',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? "ios-people" : "md-people"}
        />

    ),
};

const ProfileStack = createSwitchNavigator({
    Profile: ProfilePage,
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

//SETTINGS NEED TO BE EDITED PLS SEE PROFILEPAGE.JS IN SCREENS FOLDER
const LoginStack = createSwitchNavigator({
    Home: { screen: Login},
    RegisterPage: { screen: RegisterPage }
}, {
    navigationOptions: {
        header: false,
    }
});

LoginStack.navigationOptions = {
    tabBarLabel: 'Login',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? "ios-person" : "ios-person"}
        />
    ),
};

const AllOtherStacks = createBottomTabNavigator({
    HomeStack,
    FriendStack,
    SearchStack,
    DiscoverStack,
    ProfileStack,
    FindFriendsStack
}, {
  initialRouteName: 'ProfileStack',
  lazy: true
});


export default createStackNavigator({
  LoginStack,
  AllOtherStacks
}, {
  initialRouteName: 'LoginStack',
  lazy: false
});
