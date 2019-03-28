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
    FlatList,
	} from 'react-native';

import { createStackNavigator } from 'react-navigation';

export default class RegisterPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            username: '',
            password: '',
            fname: '',
            lname: '',
        }
    }

    render() {
         return (
            <View style= {styles.register}>
             <FlatList user={[
                    {fname: ''},
                    {lname: ''},
                    {username: ''},
                    {password: ''} ]}
                    keyExtractor={ (x,i) => x.username}
            />

                <Text style={styles.header}>Register Page</Text>
                <TextInput style = {styles.textInput}
                        placeholder= "First Name"
                        onChangeText= { (fname) => this.setState ( {fname} ) }
                        underlineColorAndroid= {'transparent'}/>
                <TextInput style = {styles.textInput}
                        placeholder= "Last Name"
                        onChangeText= { (lname) => this.setState ( {lname} ) }
                        underlineColorAndroid= {'transparent'}/>
                <TextInput style = {styles.textInput}
                        placeholder= "Email/Username"
                        keyboardType='email-address'
                        onChangeText= { (username) => this.setState ( {username} ) }
                        underlineColorAndroid= {'transparent'}/>
                <TextInput style = {styles.textInput}
                        placeholder= "password"
                        secureTextEntry={true}
                        onChangeText= { (password) => this.setState ( {password} ) }
                        underlineColorAndroid= {'transparent'}/>
                <TouchableOpacity
                     style={styles.btn}
                     onPress={this.register}>
                    <Text style={styles.buttonText}> Register</Text>
                </TouchableOpacity>

            </View>
        );
    }

    verifyRegistration = (user, pass) => {
      fetch("http://127.0.0.1:5000/register", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "Content-Type": 'application/json',
        },
        body: JSON.stringify({
          username: user,
          password: pass,
        }),
      })
      .then((response) => {
        console.log(response.status);
        if(response.status == 200) {
          alert("User was created");
          this.goToLogin();
        }
        else if (response.status == 202) {
          alert("User is already registered");
          this.goToLogin();
        }
      })
    }

    goToLogin = () => {
      console.log("im here 2")
      this.props.navigation.navigate('Home');
    }

    register = () => {
        console.log(this.state.username);
        console.log(this.state.password);
        console.log(this.state.fname);
        console.log(this.state.lname);
        this.verifyRegistration(this.state.username, this.state.password)
    }
}


const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
	},
	container: {
		flex: 1,
        paddingTop: 100,
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 40,
		paddingRight: 40,
	},
	header: {
		fontSize: 24,
		marginBottom: 100,
		color: '#fff',
		fontWeight: 'bold',
        paddingBottom: 10,
        marginBottom: 10,
        borderBottomColor: '#199187',
        borderBottomWidth: 1,
        alignItems: 'center',
	},
	textInput: {
        alignSelf: 'stretch',
        height: 40,
        color: '#000000',
        marginBottom: 10,
        borderBottomColor: '#696969',
        borderBottomWidth: 1,
	},
	btn: {
		alignSelf: 'stretch',
		backgroundColor: '#6495ed',
		padding: 20,
		alignItems: 'center',
        marginHorizontal: 40,
	},
    buttonText: {
        color: '#fff'
    },
    register: {
        alignSelf: 'stretch',
        flex: 1,
    },
});
