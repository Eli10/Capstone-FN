import React from 'react';
import {
	Image,
    Platform,
 	ScrollView,
 	StyleSheet,
	Text,
	AppRegistry,
	TextInput,
	TouchableOpacity,
	View,
	Button,
	KeyboardAvoidingView,
    AsyncStorage,
    Alert,
	} from 'react-native';

import { createStackNavigator } from 'react-navigation';
import { NavigationActions } from "react-navigation";


export default class Login extends React.Component {
    constructor(props)    {
        super(props);
        this.state = {
            username: '',
            password: '',
            value: null,
        }
    }

    render() {
	    return (
            <KeyboardAvoidingView behavior='padding' style={styles.wrapper}>
                <View style={styles.container} >
                  <Text style ={styles.header}>Welcome to Foodie!</Text>
                    <TextInput
                        style={ styles.textInput }
                        placeholder='Username'
                        keyboardType='email-address'
                        onChangeText={ (username) => this.setState( {username}) }
                        underlineColorAndroid='transparent'
                    />
                    <TextInput
                        style={styles.textInput} placeholder='Password'
                        onChangeText={ (password) => this.setState( {password}) }
                        secureTextEntry={true}
                        underlineColorAndroid='transparent'
                    />

                    <View style={styles.overallButtonContainer}>
                      <View>
                        <TouchableOpacity
                             style={styles.btn}
                             onPress={this.login} >
                            <Text style={styles.text}>Login</Text>
                        </TouchableOpacity>
                      </View>
                      <View>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={ ()=> {
                                this.props.navigation.navigate('RegisterPage');
                            } }>
                            <Text style={styles.text}>Register</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
 	    );
	}

  login = () => {

      fetch('https://capstone-express-gateway.herokuapp.com/users/login', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
         body: JSON.stringify({
              username: this.state.username,
              password: this.state.password,
          })
      })
         .then( (res) => {

           console.log(res.status)
           if (res.status < 400) {
             Alert.alert("Login Successful");
           }
            return res.json()
          })
         .then((resData) => {
           console.log(resData)
           this.props.navigation.setParams({
            test: 'From Loggingin Page'
          });
           this.props.navigation.navigate({
              routeName: "AllOtherStacks",
              params: { username: this.state.username,
              access_token: resData['access_token'],
              refresh_token: resData['refresh_token'] }
            });
         })
  }
}


const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
	},
	container: {
		flex: 1,
    paddingTop: 100,
    justifyContent: 'center',
		alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#FFA500',

	},
  overallButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
	header: {
		fontSize: 24,
		marginBottom: 50,
		color: '#000000',
		fontWeight: 'bold',
	},
	textInput: {
    alignSelf: 'stretch',
    height: 40,
    marginHorizontal: 40,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
	},
    txt: {
    alignSelf: 'center',
    fontSize: 15,
    },
	btn: {
		alignSelf: 'center',
		backgroundColor: 'black',
		alignItems: 'center',
    marginHorizontal: 20,
    borderRadius: 50,
    width: 120,
	},
  text: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 20,
    padding: 10,

  }
});
