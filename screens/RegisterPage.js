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
            user: []
        }
    }
/*
    componentDidMount () {
        AsyncStorage.getItem("user").then(( ) => {
            this.setState( {"user": });
        }).done();
    }
*/
    render() {
         return (
            <View style= {styles.register}>
             <FlatList user={[
                    {fname: ''}
                    {lname: ''}
                    {username: ''}
                    {password: ''} ]}
                    keyExtractor={ (x,i) => x.username}
//                    renderItem={({item}) => <Text>{item.username}</Text>
            />
        }
                <Text style= {styles.header}>Register Page</Text>
                <TextInput style = {styles.textInput} 
                        placeholder= "First Name"
                        onChangeText= { (user.fname) => this.setState ( {user.fname} ) }
                        underlineColorAndroid= {'transparent'}/>
                <TextInput style = {styles.textInput}
                        placeholder= "Last Name"
                        onChangeText= { (user.lname) => this.setState ( {user.lname} ) }    
                        underlineColorAndroid= {'transparent'}/>
                <TextInput style = {styles.textInput}
                        placeholder= "Email/Username"
                        keyboardType='email-address'
                        onChangeText= { (user.username) => this.setState ( {user.username} ) }
                        underlineColorAndroid= {'transparent'}/>
                <TextInput style = {styles.textInput}
                        placeholder= "password"
                        secureTextEntry={true}
                        onChangeText= { (user.password) => this.setState ( {user.password} ) }
                        underlineColorAndroid= {'transparent'}/>
             /*   <TextInput style = {styles.textInput} placeholder= "confirm password"
                    secureTextEntry={true}
                    underlineColorAndroid= {'transparent'}/>*/
                <TouchableOpacity 
                     style={styles.btn}
                     onPress={this.register}>
                    <Text style={styles.buttonText}> Register </Text>
                </TouchableOpacity>
       
            </View>
        );
    }
    register = () => {
        AsyncStorage.setItem("user", user);
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
        alignSelf: 'center',
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
  //      backgroundColor: '#36485f',
    },
});
