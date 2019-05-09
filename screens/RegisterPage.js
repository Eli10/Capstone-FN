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
    Alert,
    Dimensions,
    Picker,
	} from 'react-native';

import { createStackNavigator } from 'react-navigation';

const {height}=Dimensions.get('windows');
export default class RegisterPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            screenHeight: 0,
            username: '',
            password: '',
            cPassword: '',
            fname: '',
            lname: '',
            age: 0,
            gender: '',
            favBorough: '',
        }
    }

    render() {
         const scrollEnable = this.state.screenHeight > height;
         return (
            <ScrollView style={styles.register}
                scrollEnabled={scrollEnable}
                onContentSizeChange={this.onContentSizeChange}>
                <Text style={styles.header}>REGISTER</Text>
                <TextInput style = {styles.textInput}
                        placeholder= "First Name"
                        onChangeText= { (fname) => this.setState ( {fname} ) }
                        underlineColorAndroid= {'transparent'}/>
                <TextInput style = {styles.textInput}
                        placeholder= "Last Name"
                        onChangeText= { (lname) => this.setState ( {lname} ) }
                        underlineColorAndroid= {'transparent'}/>
                <TextInput style = {styles.textInput}
                        placeholder= "Age"
                        onChangeText= { (age) => this.setState ( {age} ) }
                        underlineColorAndroid= {'transparent'}/>
                   <Text style= {styles.txt}>Gender</Text>               
                    <Picker style= {styles.picker}
                        selectedValue= {this.state.gender}
                        onValueChange={ (gender) => this.setState({gender: gender}) }
                         mode="dialog">
                        <Picker.Item label = "Male" value = "Male" />
                        <Picker.Item label = "Female" value = "Female"/>
                        <Picker.Item label = "Other" value = "Other"/>
                 </Picker>
                <TextInput style = {styles.textInput}
                        placeholder= "Favorite Borough"
                        onChangeText= { (favBorough) => this.setState ( {favBorough} ) }
                        underlineColorAndroid= {'transparent'}
                        autoCapitalize = 'words'/>
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
                <TextInput style = {styles.textInput}
                        placeholder= "confirm password"
                        secureTextEntry={true}
                        onChangeText= { (cPassword) => this.setState ( {cPassword} ) }
                        underlineColorAndroid= {'transparent'}
                        autoCorrect={false}/>
                <TouchableOpacity
                     style={styles.btn}
                     onPress={this.register}>
                    <Text style={styles.buttonText}> Register</Text>
                </TouchableOpacity>
                 <TouchableOpacity style={styles.txt}
                    onPress={this.goToLogin}>
                    <Text>I already have an account!</Text>
                </TouchableOpacity>
            </View>
        );
    }
    onContentSizeChange = (contentWidth, contentHeight) => {
         this.setState({screenHeight: contentHeight});
    };

    verifyRegistration = (user, pass) => {
      fetch("http://localhost:3000/users/register", {
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
          Alert.alert(" ","User is already registered");
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
        if (this.state.password == this.state.cPassword)
        {
            this.verifyRegistration(this.state.username, this.state.password)
        }
        else
        {
            Alert.alert(" ","Your passwords do not match, Please try again");
        }
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
		color: 'black',
		fontWeight: 'bold',
        paddingBottom: 10,
        marginBottom: 10,
        borderBottomColor: '#199187',
        borderBottomWidth: 1,
        alignSelf: 'center'
	},
    picker: {
        width: 150,
        alignSelf: 'center',
    },
	textInput: {
        alignSelf: 'center',
        height: 50,
        color: '#000000',
        marginBottom: 10,
        borderBottomColor: '#696969',
        borderBottomWidth: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        width: 350
	},
	btn: {
		alignSelf: 'center',
		backgroundColor: 'black',
		padding: 5,
		alignItems: 'center',
        marginHorizontal: 40,
        borderRadius: 50,
        width: 150,
	},
    buttonText: {
        color: 'white',
        fontSize: 20
    },
    register: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        flex: 1,
        backgroundColor: '#FFA500'
    },
});
