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

export default class Login extends React.Component {
    constructor(props)    {
        super(props);
        this.state = {
            username: '',
            password: '',
        }
    }
    componentDidMount() {
        this._loadInitalState().done;
    }
    _loadInitalState = async () => {
        var value=await AsyncStorage.getItem('user');
        if (value !== null) {
            this.props.navigation.navigate('Profile');
        }
    }
    render() {
	    return (
            <KeyboardAvoidingView behavior = 'padding' stye= {styles.wrapper}>
                <View style = {styles.container}>
           
                     <Text style ={styles.header}>- LOGIN -</Text>
                    <TextInput
                        style={ styles.textInput }
                        placeholder='Username'
                        keyboardType='email-address'
                        onChangeText={ (username) => this.setState( {username}) }
                        underlineColorAndroid= 'transparent'
                    />

                    <TextInput
                        style={styles.textInput} placeholder='Password'
                        onChangeText={ (password) => this.setState( {password}) }
                        secureTextEntry={true} 
                        underlineColorAndroid= 'transparent'
                    />
                    <TouchableOpacity
                         style={styles.btn}
                         onPress={this.login}>
                        <Text style={styles.text}> Login </Text>
                    </TouchableOpacity>
                    <Text style={styles.textInput}>Sign up</Text>
                </View>          
            </KeyboardAvoidingView>
 	    );
	}
    login = () => {

        fetch('http://67.244.5.46:3000/users', {
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
           .then( (response) => response.json() )
           .then( (res) => {
                alert(res.message);
                if (res.success ===true ){
                    AsyncStorage.setItem('user', res.user);
                    this.props.navigation.navigate('Profile');
                }
                else{
                    alert(res.message);
               }
         })
         .done();

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
