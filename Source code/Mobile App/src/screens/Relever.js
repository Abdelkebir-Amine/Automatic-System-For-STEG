import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity,ScrollView, TouchableHighlight } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import Textarea from 'react-native-textarea';


export default class Relever extends React.Component {

    constructor(props){
      super(props)
      this.state = {
        date:'',
        msgErreur:null,
        RefCompteur:"# Réf compteur", 
        colorLineRef:'#000000',
      }
    }
// Fonction pour ajouter le releveur concerné pour cette rélevement & ajouter la date et l'heure de rélevement:

  componentDidMount() {
    var that = this;
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    that.setState({
      date:
        date + '/' + month + '/' + year + ' | ' + hours + ':' + min + ':' + sec,
    });
  }

// Fonction controle des saisies & changement couleur de chaque lignes sous champs :
    ValiderChamps = () => {
      this.setState({colorLineRef:"red"});
      this.setState({msgErreur:"Taper sur l'icone caméra pour détecter la réference de compteur"});
    }

// Les fonctions de navigation :
    toDetecteur() {
      // Initialisation de states :
      this.setState({colorLineRef:"#000000"});
      this.setState({msgErreur:" "});
      // Navigation vers le détecteur :
      this.props.navigation.navigate('DetectionRelevement')
    }

    Retour() {
      // Initialisation de states :
      this.setState({colorLineRef:"#000000"});
      this.setState({msgErreur:" "});
      // Navigation vers Home :
      this.props.navigation.goBack()
    }
 
// ********************************** La partie Principale de Vue ****************************************
  
    render() {
      return (
        <View> 
          <View style={styles.header}>
            <Text style={styles.textHeader}>Relèvement</Text>
            <TouchableOpacity  onPress={() => this.Retour()} style={styles.touchIconRetour} >
              <Icon name={'md-arrow-back'} style={styles.icon}></Icon>
            </TouchableOpacity>
          </View> 
    
          <ScrollView>
            
            <View style={styles.partieRows}>
              <View>
                <Text style={{marginTop:10, fontSize:19, opacity: 0.60 }} > Réf compteur </Text>
                <Text style={styles.textRefCompteur} > {this.state.RefCompteur} </Text>
                <View style={{height:.9, width:"100%", backgroundColor:this.state.colorLineRef, marginTop:3.5}} />
                <Icon name={'ios-camera'} style={styles.iconInputRef} 
                      onPress={() => this.toDetecteur()}>
                </Icon>
              </View>
    
              <View>
                <Text style={{marginTop:10, fontSize:19, opacity: 0.60 }} > Nouvel index </Text>
                <Text style={styles.inputRef} >
                  Index...
                </Text>
                <View style={{height:.9, width:"100%", backgroundColor:"#000000", marginTop:3.5, }} />
              </View>

              <View>
                <Text style={{marginTop:10, fontSize:19, opacity: 0.60 }} > Date </Text>
                <Text  style={styles.inputRef}> {this.state.date} </Text>
                <View style={{height:1, width:"100%", backgroundColor:"#000000", marginTop:5.5, }} />
              </View>
    
              <View  style={styles.textareaView}>
                <Text style={{marginTop:0, fontSize:19, opacity: 0.60, }} > Remarques </Text>
                <View style={{height:1.2, width:"97%", backgroundColor:this.state.colorLineRemarque, marginTop:6, alignSelf: "center", opacity: 1}} />
                <Textarea
                  containerStyle={styles.textareaContainer}
                  style={styles.textarea}
                  onChangeText={(valeurRemarque) => {this.setState({valeurRemarque: valeurRemarque})}}
                  maxLength={150}
                  placeholder={'Tapez ici vos remarques...'}
                  placeholderTextColor={'#000000'}
                  underlineColorAndroid={'transparent'}
                />
              </View>

              <View style={styles.viewErreur}>
                {this.state.msgErreur && <Text style={styles.textErreur}> {this.state.msgErreur} </Text> }
              </View>

              <View>
                <TouchableHighlight ref={ref => this.touchable = ref} style={styles.buttonEnvoyer} onPress={this.ValiderChamps} >                     
                  <Text style={styles.textButtonEnvoyer}> Envoyer </Text>
                </TouchableHighlight>
              </View>              
            </View>
          </ScrollView>
        </View>
      );
    }
}
    
//******************************************* Les styles CSS **********************************************
    
    const styles = StyleSheet.create({
    
      textRefCompteur: {
        fontSize: 17,
        padding: 3,
        width:260,
        opacity:0.3
      },
      textErreur : {
        color: "#FF000F",
        fontSize: 17,
        fontFamily: "roboto-regular",
      },
      viewErreur : {
        marginTop: 15,
        alignSelf: "center",
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
      textareaView: {
        marginTop:14,
      },
      textareaContainer: {
        height: 180,
        padding: 15,
        backgroundColor: '#ECECEC',
        borderRadius:6,
        marginTop:0,
      },
      textarea: {
        textAlignVertical: 'top', 
        height: 170,
        fontSize: 18,
        color: "rgba(0,97,166,1)",       
      },
      iconInputRef:{
        fontSize:40,
        color: "rgba(0,97,166,1)",
        marginLeft:275,
        marginTop:-40
      },
      partieRows: {
        justifyContent: 'center',
        margin: 20,
        marginTop:5
      },
      inputRef: {
        fontSize: 18,
        padding: 0,
        width:260,
        fontFamily: "roboto-regular",
        //backgroundColor:"#000000",
        marginLeft: 10,
        opacity:0.3
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
        width: 100,
        height: 20,
        color: "rgba(255,255,255,1)",
        fontSize: 18,
        fontFamily: "roboto-700",
        lineHeight: 18,
        marginTop: 19,
        alignSelf: "center",
      }  
    });

    