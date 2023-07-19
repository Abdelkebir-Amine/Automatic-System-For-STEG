import React, { Component } from "react";
import { StyleSheet, View, StatusBar, Image, Text, TouchableOpacity, TextInput } from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
 

export default class Login extends React.Component {

  state = {
    email : "",
    motDePasse : "",
    msgErreur : null 
  };

// Fonction connexion
  Login = () => {
    const { email, motDePasse } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, motDePasse )
      .catch(error => this.setState({ msgErreur: error.message }))
  };

render() {
  return (
    <View style={styles.container}>

      <StatusBar
        animated={false}
        barStyle="dark-content"
        hidden={false}
        backgroundColor="#D8D0D0"
      ></StatusBar>

      <Image
        source={require("../assets/images/steg1.jpg")}
        resizeMode="contain"
        style={styles.logoApp}
      ></Image>

      <Text style={styles.nomApp}> Smart app STEG </Text>

      <View style={styles.iconLoginColumnRow}>
        <View style={styles.iconLoginColumn}>
          <FeatherIcon name="user" style={styles.iconLogin}></FeatherIcon>
          <MaterialCommunityIconsIcon name="lock-open" style={styles.iconPassword} > </MaterialCommunityIconsIcon>
        </View>

        <View style={styles.Inputs}>

          <View style={styles.InputLogin}>
            <View style={[styles.containerInputLogin]}>
                <TextInput 
                  placeholder=" Email..." 
                  style={styles.inputLoginStyle} 
                  onChangeText = { email => this.setState ({ email }) }
                  value={this.state.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                >
                </TextInput>
              </View>
          </View>
          
          <View style={styles.InputPassword}>
            <View style={[styles.containerInputPassword]}>
                <TextInput 
                  placeholder=" Mot de passe..." 
                  secureTextEntry={true}
                  style={styles.inputPasswordStyle} 
                  onChangeText = { motDePasse => this.setState ({ motDePasse }) }
                  value={this.state.motDePasse}
                >
                </TextInput>
              </View>
          </View>
        </View> 
      </View>

      <View style={styles.viewErreur}>
        { this.state.msgErreur && <Text style={styles.textErreur}> {this.state.msgErreur} </Text> }
      </View>

      <TouchableOpacity onPress={this.Login} style={styles.buttonCnx}>
        <Text style={styles.textButtonCnx}>Connexion</Text>
      </TouchableOpacity>

    </View>
  );
}
}

//******************************************* Les styles CSS *******************************************

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 5
  },
  logoApp: {
    width: 194,
    height: 200,
    marginTop: 37,
    marginLeft: 83
  },
  nomApp: {
    color: "rgba(16,15,15,1)",
    fontSize: 25,
    fontFamily: "roboto-regular",
    //marginTop: 0,
    marginLeft: 95
  },
  iconLogin: {
    color: "rgba(0,0,0,1)",
    fontSize: 30,
    marginLeft: 2
  },
  iconPassword: {
    color: "rgba(0,0,0,1)",
    fontSize: 34,
    width: 33,
    height: 31,
    marginTop: 26
  },
  iconLoginColumn: {
    width: 33,
    marginTop: 15,
    marginBottom: 1
  },
  InputLogin: {
    width: 210,
    height: 43,
    marginLeft: 1
  },
  InputPassword: {
    width: 210,
    height: 50,
    marginTop: 10
  },
  Inputs: {
    width: 211,
    marginLeft: 4
  },
  iconLoginColumnRow: {
    height: 94,
    flexDirection: "row",
    marginTop: 34,
    marginLeft: 52,
    marginRight: 60
  },
  buttonCnx: {
    width: 248,
    height: 52,
    backgroundColor: "rgba(0,97,166,1)",
    borderRadius: 25,
    marginTop: 30,
    marginLeft: 58
  },
  textButtonCnx: {
    color: "rgba(255,255,255,1)",
    fontSize: 25,
    fontFamily: "calibri-regular",
    marginTop: 9,
    marginLeft: 68
  },
  textErreur : {
    color: "#FF000F",
    fontSize: 15,
    fontFamily: "roboto-regular",
  },
  viewErreur : {
    marginTop: 50,
    //alignSelf: "center",
    marginLeft:35
  },
  containerInputLogin: {
    backgroundColor: "rgba(255,255,255,1)",
    flexDirection: "row",
    alignItems: "center",
    borderColor: "rgba(51,50,52,1)",
    borderBottomWidth: 1
  },
  inputLoginStyle: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,1)",
    color: "#000",
    alignSelf: "stretch",
    paddingTop: 16,
    paddingRight: 5,
    paddingBottom: 8,
    fontSize: 16,
    fontFamily: "roboto-regular",
    lineHeight: 16
  },
  containerInputPassword: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    borderColor: "rgba(51,50,52,1)",
    borderBottomWidth: 1,
  },
  inputPasswordStyle: {
    flex: 1,
    color: "#000",
    alignSelf: "stretch",
    paddingTop: 16,
    paddingRight: 5,
    paddingBottom: 8,
    fontSize: 16,
    fontFamily: "roboto-regular",
    lineHeight: 16
  }
});


