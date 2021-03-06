// Author:Alina Zhong & Elijah Augustin
//
// File: this file implements the register screen found when
//
// clicking on the register button on the login screen
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
  Picker,
} from 'react-native';

import { createStackNavigator, NavigationActions } from 'react-navigation';
import ValidationComponent from 'react-native-form-validator';

export default class RegisterPage extends ValidationComponent {
  constructor(props){
    super(props);
    this.state={
      username: '',
      password: '',
      cPassword: '',
      fname: '',
      lname: '',
      age: 0,
      gender: '',
      favBorough: '',
      error: false,
    }
  }

  // The render function generates the registration form
  render() {
    return (
      <View style= {styles.register}>
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
          <TextInput style = {styles.textInput}
              placeholder= "Gender"
              onChangeText= { (gender) => this.setState ( {gender} ) }
              underlineColorAndroid= {'transparent'}/>
          <TextInput style = {styles.textInput}
              placeholder= "Favorite Borough"
              onChangeText= { (favBorough) => this.setState ( {favBorough} ) }
              underlineColorAndroid= {'transparent'}/>
          <TextInput style = {styles.textInput}
              placeholder= "Username"
              keyboardType='username'
              onChangeText= { (username) => this.setState ( {username} ) }
              underlineColorAndroid= {'transparent'}/>
          <TextInput style = {styles.textInput}
              placeholder= "Password"
              secureTextEntry={true}
              onChangeText= { (password) => this.setState ( {password} ) }
              underlineColorAndroid= {'transparent'}/>
          <TextInput style = {styles.textInput}
              placeholder= "Confirm Password"
              secureTextEntry={true}
              onChangeText= { (cPassword) => this.setState ( {cPassword} ) }
              underlineColorAndroid= {'transparent'}/>
          <View style={styles.overallButtonContainer}>
              <TouchableOpacity
                  style={styles.btn}
                  onPress={this.register}>
                  <Text style={styles.buttonText}> Register</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={styles.btn}
                  onPress={ () => {this.props.navigation.navigate('Home')} }>
                  <Text style={styles.buttonText}> Cancel</Text>
              </TouchableOpacity>
          </View>
          <Text>{this.getErrorMessages()}</Text>
          <Text>{this.isFieldInError()}</Text>
          <Text>{this.getErrorsInField()}</Text>
      </View>
    );
  }

  // Function checks if entered information is in database, and if not, creates a user profile
  verifyRegistration = () => {
    fetch("https://capstone-express-gateway.herokuapp.com/users/register", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        "Content-Type": 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
        fname: this.state.fname,
        lname: this.state.lname,
        age: this.state.age,
        gender: this.state.gender,
        favBorough: this.state.favBorough,
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

 //Function navigates to login page
  goToLogin = () => {
    this.props.navigation.navigate('Home');
  }

  // Function creates a user profile if all fields are valid*/
  register = () => {
    if (this.state.cPassword !== this.state.password) {
      Alert.alert(" ","Your passwords do not match, try again");
    }
    else if (this.validate({
      fname: {minlength: 1, maxlength: 12, required: true},
      lname: {minlength: 1, maxlength: 12, required: true},
      username: {minlength: 1, maxlength: 12, required: true},
      password: {minlength: 1, maxlength: 100, required: true},
      age: {numbers: true, required: true },
      gender : {minlength: 1, maxlength: 12, required: true},
      favBorough: {minlength: 1, maxlength: 12, required: true},
    })) {
      this.verifyRegistration(this.state.username, this.state.password);
    } else {
      this.setState({error: true})
    }
  }
}

//Style sheets for textinput for registration page
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
  overallButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomColor: '#199187',
    borderBottomWidth: 1,
    alignItems: 'center',
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
    marginHorizontal: 20,
    borderRadius: 50,
    width: 120,
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
    backgroundColor: '#FFA500',
  },
});
