import React, { Component } from "react";
import { StyleSheet, View, TextInput } from "react-native";

function InputLogin(props) {
  state = {
    email : ""
  };
  return (
    <View style={[styles.container, props.style]}>
      <TextInput 
      placeholder=" Email..." 
      style={styles.inputStyle} 
      onChangeText = { email => this.setState ({ email }) }
      value={this.state.email}
      >
      </TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,1)",
    flexDirection: "row",
    alignItems: "center",
    borderColor: "rgba(51,50,52,1)",
    borderBottomWidth: 1
  },
  inputStyle: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,1)",
    color: "#000",
    alignSelf: "stretch",
    paddingTop: 16,
    paddingRight: 5,
    paddingBottom: 8,
    fontSize: 16,
    //fontFamily: "roboto-regular",
    lineHeight: 16
  }
});

export default InputLogin;
