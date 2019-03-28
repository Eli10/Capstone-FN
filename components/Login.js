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

export default class Login extends React.Component {
    constructor(props)    {
        super(props);
        this.state = {
            username: '',
            password: '',
            value: null,
        }
    }
    componentDidMount() {
        this._loadInitalState().done;
    }
    _loadInitalState = async () => {
        var value=await AsyncStorage.getItem('user');
        if (value !== null) {
            this.props.navigation.navigate('ProfilePage');
        }
    }
    render() {
	    return (
            <KeyboardAvoidingView behavior='padding' style={styles.wrapper}>
                <View style={styles.container} >
                  <Text style ={styles.header}>LOGIN</Text>
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
                    <TouchableOpacity
                         style={styles.btn}
                         onPress={this.login} >
                        <Text style={styles.text}>Login</Text>
                    </TouchableOpacity>
                    <Button
                        onPress={ ()=> {
                            this.props.navigation.navigate('RegisterPage');
                        } }
                        title="Register"
                    />
                </View>
            </KeyboardAvoidingView>
 	    );
	}
  login = () => {

      fetch('http://127.0.0.1:5000/login', {
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
             this.props.navigation.navigate('ProfilePage');
           }
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
		alignItems: 'center',
        alignContent: 'center',
	},
	header: {
		fontSize: 24,
		marginBottom: 100,
		color: '#000000',
		fontWeight: 'bold',
	},
	textInput: {
        alignSelf: 'stretch',
        height: 40,
        marginHorizontal: 40,
	},
	btn: {
		alignSelf: 'stretch',
		backgroundColor: '#6495ed',
		alignItems: 'center',
        marginHorizontal: 40,
	},
    text: {
        alignSelf: 'center',
        color: '#fff',
        height: 40,

    }
});
