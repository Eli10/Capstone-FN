/**
 Author:Everyone
 file: this file implements bottom tab navigator and the path names to be accessed
 during navigation
 **/
import React from 'react';
import { Platform, Button, View, Text } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator, HeaderBackButton } from 'react-navigation';

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


//navigation name and creation of 'your maps' page
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

//initially created for navigation from starrating to profile page
const hackeryfromRating = createSwitchNavigator ({

        Star: {screen: Ratings},
        Profile: { screen: ProfilePage},
    },
);

//navigation name and creation of 'friends' maps' page
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

//navigation name and creation of 'friends' maps' page
const SearchStack = createSwitchNavigator({
    Search: SearchScreen,
});

SearchStack.navigationOptions = {
    tabBarLabel: 'Search',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'}
        />
    ),
};

//navigation name and creation of 'Discover' page
const DiscoverStack = createSwitchNavigator({
    Discover: {screen: DiscoverScreen},
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

//navigation name and creation of 'Find Friends' page
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

//navigation name and creation of 'Profile' page
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

//navigation name and creation of 'Login' page
const LoginStack = createSwitchNavigator({
    Home: { screen: Login},
    RegisterPage: { screen: RegisterPage }
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

//navigation name and creation of Bottom Tab
const AllOtherStacks = createBottomTabNavigator({
    HomeStack,
    FriendStack,
    SearchStack,
    DiscoverStack,
    ProfileStack,
    FindFriendsStack
}, {
  initialRouteName: 'ProfileStack',
  lazy: true,
  headerBackTitle: 'some label'

});

//creation of top level navigator where header is defined
export default createStackNavigator({
  LoginStack,
  AllOtherStacks
}, {
  initialRouteName: 'LoginStack',
  lazy: false,
  defaultNavigationOptions:{
          title:'Foodie',
          headerTitleStyle: {
            textAlign: 'center',
            flexGrow:1,
            alignSelf:'center',
            },
          headerLeft:null,
      },
  },
);
