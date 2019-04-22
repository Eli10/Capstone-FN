import React from 'react';
import {
  Image,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
import {StackNavigator} from 'react-navigation';

export default class ProfilePage extends React.Component {
        constructor(props) {
            super(props);
            this.state={
                fname: '',
                lname: '',
                username: '',
                access_token: '',
                refresh_token: ''
            }
        }

  logoutToLogin = () => {
    console.log("Trying to logout");
    this.props.navigation.navigate("Home");
  }

  render() {
    const { navigation } = this.props;
    const name = navigation.getParam('username', 'Blah');
    const access_token = navigation.getParam('access_token', 'Blah');
    const refresh_token = navigation.getParam('refresh_token', 'Blah');

    {console.log("Profile Params")};
    {console.log(this.props.navigation.state.params)};

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
         {console.log(name)}
         <Text> Hello {name} </Text>
         <Text> Access Token  {access_token} </Text>

         <Button
              onPress={this.logoutToLogin}
              title="Logout"
         />
        </ScrollView>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  text: {
      alignSelf: 'center',
      color: 'black',
      height: 40,

  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },


  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
