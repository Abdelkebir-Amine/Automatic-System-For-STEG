import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity,ScrollView, Button, TouchableHighlight,Alert } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import * as firebase from 'firebase';
import Popover from 'react-native-popover-view';


export default class MajPosition extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      latitude:null,
      longitude:null,
      msgErreur:null,
      // Les states pour couleurs des lignes de sous chaque champs 
      colorLineRef:'#000000',
      colorLineLatitude:'#000000',
      colorLineLongitude:'#000000',
      // Variable pour la visibilité de Popover
      isVisible: false,
      error:null,
      textRetourIconPin:"",
    }
  }

// Fonction controle des saisies & changement couleur de chaque sous champs :
  validerChamps = () => {
    const {latitude,longitude} = this.state
    if (latitude == null && longitude == null){
      this.setState({ msgErreur: "Cliquer sur l'icone pour détecter la nouvelle position" })
      this.setState({ colorLineLatitude: "red" })
      this.setState({ colorLineLongitude: "red" })
      return false
    }else{
      this.setState({ msgErreur: " " });
      this.setState({ colorLineLatitude: "#000000" })
      this.setState({ colorLineLongitude: "#000000" })
      return true
    } 
  }

// Fonction pour faire la mise à jour de position
  currentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          loading : false,
          latitude:position.coords.latitude,
          longitude:position.coords.longitude,
          error:null,
          timePassed: false,
          colorLineLatitude: "#000000",
          colorLineLongitude: "#000000",
          msgErreur: " ",
          textRetourIconPin:"Nouvelle position détecté"
        });
      },
      error => this.setState({ error:error.message}),
      {enableHighAccuracy: true,timeout:20000,maximumAge:2000}
    ); 
  }

  updatePosition = () => {
    if( this.validerChamps() ) {  

        firebase.database().ref('/compteurs/'+this.props.navigation.getParam('ref')+'/positionGeo').update({
          latitude: this.state.latitude,
          longitude: this.state.longitude
        })
        .then( () => {
          this.showPopover();
          this.setState({ textRetourIconPin: "" });
          this.setState({ latitude:null});
          this.setState({ longitude:null});
        })
        .catch ((error) => {
          Alert.alert("error");
        });  
    }     
  };

// Deux fonctions pour Popover : 
  showPopover() {
    this.setState({isVisible: true});
  }
 
  closePopover() {
    this.setState({isVisible: false});
  }
  
    render() {
      return ( 
          <View> 
            <View style={styles.header}>
                <Text style={styles.textHeader}>M.À.J  position</Text>
                <TouchableOpacity  onPress={() => this.props.navigation.goBack()} style={styles.touchIconRetour} >
                    <Icon name={'md-arrow-back'} style={styles.icon}></Icon>
                </TouchableOpacity>
            </View>

          <ScrollView>
            
            <View style={styles.partieRows}>
              <View>
                <Text style={{marginTop:30, fontSize:19, opacity: 0.60 }} > Réference compteur </Text>
                <Text style={styles.rowRef} > # {this.props.navigation.getParam('ref')} </Text>
                <View style={{height:.9, width:"100%", backgroundColor:this.state.colorLineRef, marginTop:3.5}} />
              </View>
    
              <View>
                <Text style={{marginTop:20, fontSize:19, opacity: 0.60 }} > Position géographique </Text>
                <Icon name={'ios-pin'} style={styles.iconCurrentPosition} 
                      onPress={this.currentPosition} >
                </Icon>
              </View>

              <View>
                <Text style={styles.textRetourIconPin}> {this.state.textRetourIconPin} </Text>
              </View>

              <View>
                <Text style={{marginTop:3, fontSize:19, opacity: 0.60, marginLeft:25 }} > Latitude </Text>
                <Text style={styles.rowRefLatitude} > {this.state.latitude} </Text>
                <View style={{height:.9, width:"80%", marginLeft:25, backgroundColor:this.state.colorLineLatitude, marginTop:3.5, }} />
              </View>

              <View>
                <Text style={{marginTop:10, fontSize:19, opacity: 0.60, marginLeft:25 }} > Longitude </Text>
                <Text style={styles.rowRefLongitude} > {this.state.longitude} </Text>
                <View style={{height:1, width:"80%", marginLeft:25, backgroundColor:this.state.colorLineLongitude, marginTop:3.5, }} />
              </View>

              <View style={styles.viewErreur}>
                { this.state.msgErreur && <Text style={styles.textErreur}> {this.state.msgErreur} </Text> }
              </View>

              <View>

                <TouchableHighlight ref={ref => this.touchable = ref} style={styles.buttonEnvoyer} onPress={this.updatePosition}>                     
                  <Text style={styles.textButtonEnvoyer}> MAJ position </Text>
                </TouchableHighlight>

                <Popover
                  placement='top'
                  arrowStyle={{backgroundColor: "transparent",width:35,height:20}}
                  popoverStyle={styles.popoverStyle}
                  isVisible={this.state.isVisible}
                  fromView={this.touchable}
                  onRequestClose={() => this.closePopover()}>

                  <Text style={styles.popoverText} > Mise à jour de position avec succés </Text>

                  <TouchableOpacity onPress={() => this.closePopover()}>
                    <Text style={styles.popoverOk} > OK </Text>
                  </TouchableOpacity>
                </Popover>

              </View>             
            </View>
          </ScrollView>
        </View>  
      )
    };  
      
}

//******************************************* Les styles CSS ****************************************

const styles = StyleSheet.create({  
  textRetourIconPin: {
    color:"green",
    fontFamily: "roboto-regular",
    marginLeft: 50,
  },
  rowRefLatitude: {
    fontSize: 18,
    padding: 0,
    fontFamily: "roboto-regular",
    marginLeft: 10,
    marginLeft:35
  },
  rowRefLongitude: {
    fontSize: 18,
    padding: 0,
    fontFamily: "roboto-regular",
    marginLeft: 10,
    marginLeft:35
  },
  rowRef: {
    fontSize: 18,
    padding: 0,
    fontFamily: "roboto-regular",
    marginLeft: 10,
  },
  popoverOk:{
    fontSize:22,
    marginTop:32,
    color: "#0061A6",
    fontFamily: "roboto-700",
    marginLeft:120
  },
  popoverText:{
    fontSize:18,
    alignSelf: "center",
    fontFamily: "roboto-700",
    marginTop:15,
    color: "green",
  },
  popoverStyle:{
    backgroundColor: "#ffffff",
    width:295,
    height:110,
    marginLeft:0,
    borderRadius:10,
    shadowOffset:{  width: 10,  height: 10,},
    shadowColor: 'black',
    shadowOpacity: 1.5,
  },
  buttonEnvoyer: {
    width: 248,
    height: 52,
    backgroundColor: "rgba(0,97,166,1)",
    borderRadius: 25,
    marginTop: 25,
    alignSelf: "center",
  },
  textButtonEnvoyer: {
    color: "rgba(255,255,255,1)",
    fontSize: 25,
    fontFamily: "calibri-regular",
    marginTop: 9,
    alignSelf: "center",
  },
  textErreur : {
    color: "#FF000F",
    fontSize: 15,
    fontFamily: "roboto-regular",
  },
  viewErreur : {
    marginTop: 15,
    alignSelf: "center",
    width:350
  },
  iconCurrentPosition:{
    fontSize:33,
    color: "rgba(0,97,166,1)",
    marginLeft:225,
    marginTop:-29
  },
  partieRows: {
    justifyContent: 'center',
    margin: 30,
    marginTop:5
  },
  touchIconRetour: {
        width: 45,
        height: 38,
        //backgroundColor: "rgba(205,23,23,1)",
        backgroundColor:"rgba(0,97,166,1)",
        marginTop: -32,
        marginLeft: 0
      },
    icon: {
        color: "rgba(255,255,255,1)",
        fontSize: 35,
        marginTop: 1,
        marginLeft: 12,
    },
    header: {
      //flex: 1,
      width: 360,
      height: 52,
      backgroundColor: "rgba(0,97,166,1)"
    },
    textHeader: {
      width: 125,
      height: 20,
      color: "rgba(255,255,255,1)",
      fontSize: 18,
      fontFamily: "roboto-700",
      lineHeight: 18,
      marginTop: 19,
      alignSelf: "center",
    }  
}); 
