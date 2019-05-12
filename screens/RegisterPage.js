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


export default class RegisterPage extends React.Component {
  constructor(props){
    super(props);
    this.state={
      username: '',
      password: '',
      fname: '',
      lname: '',
      age: 0,
      gender: '',
      favBorough: '',
    }
  }

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


      <View style={styles.overallButtonContainer}>
      <View>
      <TouchableOpacity
      style={styles.btn}
      onPress={this.register}>
      <Text style={styles.buttonText}> Register</Text>
      </TouchableOpacity>
      </View>
      <View>
      <TouchableOpacity
      style={styles.btn}
      onPress={ () => {this.props.navigation.navigate('Home')} }>
      <Text style={styles.buttonText}> Cancel</Text>
      </TouchableOpacity>
      </View>
      </View>

      </View>
    );
  }

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

  goToLogin = () => {
    console.log("im here 2")
    this.props.navigation.navigate('Home');
  }

  register = () => {
    console.log(this.state.username);
    console.log(this.state.password);
    console.log(this.state.fname);
    console.log(this.state.lname);
    this.verifyRegistration(this.state.username, this.state.password);

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
