import React, { Component } from 'react';
import {
  Button,
  Text,
  TextInput,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Chevron } from 'react-native-shapes';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';


var myLists = [{label: 'drinks', value: 'bubble tea'}, {label: 'drinks', value: 'pizza',}, {value: 'burgers',}, {label: 'drinks', value: 'im in a mood',}];

export default class menu extends Component
{
    constructor(props) 
    {
        super(props);
        

        this.inputRefs = 
        {
            firstTextInput: null,
            list0: null,
            list1: null,
            lastTextInput: null,
        };

      this.state = {
        numbers: [
        {
          label: '1',
          value: 1,
          color: 'orange',
        },
        {
          label: '2',
          value: 2,
          color: 'green',
        },
      ],
      list0: undefined,
      list1: undefined,
      list2: undefined,
      list3: undefined,
      favSport4: 'drinks',
    };
}}
