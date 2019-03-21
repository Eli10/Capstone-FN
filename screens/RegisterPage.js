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
	} from 'react-native';

import { createStackNavigator } from 'react-navigation';

export default class Signup extends React.Component {
    constructor(props){
	super(props);
	this.state = {
		fName = ''
		lName = ''
		username = ''
		password = ''
		rPassword = ''
	}
    }
    render() {
	    return (
		<KeyboardAvoidingView behavior = 'padding' style= {styles.wrapper}>
		<View style = {styles.container}>
			<Text style ={style.header}>--SIGN UP --</Text>
		                    <TextInput style={ styles.textInput }
                 		       placeholder='First Name'
              		               onChangeText={ (fName) => this.setState( {fName}) }
                      		       underlineColorAndroid= 'transparent'
                                     />
		                    <TextInput style={ styles.textInput }
                 		       placeholder='Last Name'
              		               onChangeText={ (lName) => this.setState( {lName}) }
                      		       underlineColorAndroid= 'transparent'
                                     />
		                    <TextInput style={ styles.textInput }
                 		       placeholder='Username/Email'
                	               keyboardType='email-address'
              		               onChangeText={ (username) => this.setState( {username}) }
                      		       underlineColorAndroid= 'transparent'
                                     />
		                    <TextInput style={ styles.textInput }
                 		       placeholder='password'
              		               onChangeText={ (password) => this.setState( {password}) }
				       secureTextEntry={true}
                      		       underlineColorAndroid= 'transparent'
                                     />
		                    <TextInput style={ styles.textInput }
                 		       placeholder='verify password'
              		               onChangeText={ (rPassword) => this.setState( {rPassword}) }
				       secureTextEntry={true}
                      		       underlineColorAndroid= 'transparent'
                                     />
			<TouchableOpacity
				style={styles.btn}
				onPress={this.signup}>
				<Text>Sign Up</Text>
			</TouchableOpacity>

		</View>
		</KeyboardAvoidingView>
 	    );
    }
    signup = () => {
		fetch('http://ipofclient/port3000/users(wheredatagets',
		{method: 'POST',
		headers: {
			'Accept': 'logins/json',
			'Content-Type': 'logins/json',		
		},
		body: JSON.stringfy({
			fName: this.state.fName,
			lName: this.state.lName,
			username: this.state.username,
			password: this.state.password,
		})
		.then((response) =>response.json())
		.then ((res)=> {          

			if (res.success === true) {
				AsyncStorage.setItem('user', res.user);
				this.props.navigation.navigate('Profile');
			else{
				alert(res.message);
			}
			}
		})
		.done();			
		)

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
	},
	textInput: {
        alignSelf: 'stretch',
        height: 40,
	},
	btn: {
		alignSelf: 'stretch',
		backgroundColor: '#6495ed',
		padding: 20,
		alignItems: 'center',
	},
    text: {
        alignSelf: 'center',
        color: '#fff',
        height: 100,

    }
});
