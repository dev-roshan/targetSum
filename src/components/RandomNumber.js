import React, { Component } from 'react';
import PropTypes from 'prop-types'; 

import { View,TouchableOpacity, Text, StyleSheet } from 'react-native';

export default class componentName extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  } 
  static propTypes={
      id: PropTypes.number.isRequired,
      number: PropTypes.number.isRequired,
      isDisabled: PropTypes.bool.isRequired,
      onPress: PropTypes.func.isRequired,
  };
  handlePress= () => {
    if(this.props.isDisabled){return;};
    this.props.onPress(this.props.id);
  };
  render() {
    return (
        <TouchableOpacity onPress={this.handlePress}>
            <Text style={[styles.random, this.props.isDisabled && styles.disabled]}>{this.props.number}</Text>
        </TouchableOpacity>
    );
  }
}

const styles= StyleSheet.create({
    random:{
        fontSize:35,
        backgroundColor:"#ddd",
        borderColor: "gray",
        marginHorizontal:15,
        marginBottom: 25,
        textAlign:'center',
        width:120,
        height:120,
        padding: 35,
        borderWidth: 10,
        borderRadius: 100,
        },
    disabled:{
        opacity: 0.3,
        },

});
