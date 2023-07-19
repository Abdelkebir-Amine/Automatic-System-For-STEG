import React, { Component } from "react";
import { StyleSheet, View, TextInput } from "react-native";

function InputPassword(props) {
  state = {
    motDePasse : ""
  };
  return (
    <View style={[styles.container, props.style]}>
      <TextInput
        placeholder=" Mot de passe..."
        secureTextEntry={true}
        style={styles.inputStyle}
        onChangeText = { motDePasse => this.setState ({ motDePasse }) }
        value={this.state.motDePasse} 
      >
      </TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    borderColor: "rgba(51,50,52,1)",
    borderBottomWidth: 1
  },
  inputStyle: {
    flex: 1,
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

export default InputPassword;
