import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, CheckBox, TouchableHighlight, ActivityIndicator } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import Textarea from 'react-native-textarea';


export default class Reclamation extends React.Component { 
  
  constructor(props){
    super(props)
    this.state = {
      date:'',
      ref:"# Réf compteur",
      msgErreur:null,
      textSousIconImage:'Ajouter une image',
      colorLineRef:'#000000',
      colorLineDate:"rgba(0,97,166,1)",
      panne: false,
      fraude : false,
    }
  }

// Fonction pour ajouter la date et l'heure de réclamation :
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
        date + '/' + month + '/' + year + ' - ' + hours + ':' + min + ':' + sec,
    });

    this.props.navigation.addListener('focus', () => {
      this.setState({ msgErreur: "Entrer la date d'aujourd'hui" });
    });
  }

// Fonction controle des saisies & changement couleur de chaque lines sous champs :
  validerChamps = () => {
    const {ref} = this.state

    if (ref == "# Réf compteur"){

      this.setState({ msgErreur: "Taper sur l'icone caméra pour détecter la réference de compteur" })
      this.setState({ colorLineRef: "red" })
      return false       
    }else{
      this.setState({ msgErreur: " " });
      this.setState({ colorLineRef: "#000000" });
      return true
    }  
  }

// Les fonctions de ChekBox : 
  pannePressed() {
    this.setState({panne: true, fraude:false});
    this.setState({ msgErreur: "Taper sur l'icone caméra pour détecter la réference de compteur" })
    this.setState({ colorLineRef: "red" })
  }

  fraudePressed() {
    this.setState({panne: false, fraude:true});
    this.setState({ msgErreur: "Taper sur l'icone caméra pour détecter la réference de compteur" })
    this.setState({ colorLineRef: "red" })
  }

  toDetecteur() {
    // Initialisation de states :
    this.setState({ panne:false });
    this.setState({ fraude:false });
    this.setState({ typeReclamation:false });
    this.setState({ msgErreur: " " })
    this.setState({ colorLineRef: "#000000" })
    // Navigation vers le détecteur :
    this.props.navigation.navigate('DetectionReclamation')

  }

  Retour() {
    // Initialisation de states :
    this.setState({ panne:false });
    this.setState({ fraude:false });
    this.setState({ typeReclamation:false });
    this.setState({ msgErreur: " " })
    this.setState({ colorLineRef: "#000000" })
    // Navigation vers Home :
    this.props.navigation.goBack()
  }


  render() {
    if (this.state.loading){
      return  (<View style={styles.loading}>
                <ActivityIndicator color='#827E7F' size="large" />
              </View>)
    }
    else{
    return (  
        <View> 

          <View style={styles.header}>
            <Text style={styles.textHeader}>Lancer réclamation</Text>
            <TouchableOpacity  onPress={() => this.Retour()} style={styles.touchIconRetour} >
                <Icon name={'md-arrow-back'} style={styles.icon}></Icon>
            </TouchableOpacity>
          </View> 

          <ScrollView>
            <View style={styles.partieRows}>

              <View>
                <Text style={{marginTop:10, fontSize:19, opacity: 0.60 }} > Réference compteur </Text>
                <Text style={styles.textRefCompteur} > {this.state.ref} </Text>
                <View style={{height:.9, width:"100%", backgroundColor:this.state.colorLineRef, marginTop:3.5}} />
                <Icon name={'ios-camera'} style={styles.iconInputRef} 
                      onPress={() => this.toDetecteur()} >
                </Icon>
              </View>
    
              <View>
                <Text style={{marginTop:10, fontSize:19, opacity: 0.60 }} > Type réclamation </Text>
                <CheckBox
                  style={{marginLeft:15 }}
                  value={this.state.panne}
                  onChange={() => this.pannePressed()} 
                />
                <Text style={{marginTop:10, fontSize:18, marginTop:-30, marginLeft:45 }}> Panne </Text>
                  <CheckBox
                    style={{marginLeft:120, marginTop:-27 }}
                    value={this.state.fraude}
                    onChange={() => this.fraudePressed()}
                  />
                <Text style={{marginTop:10, fontSize:18, marginTop:-30, marginLeft:150 }}> Fraude </Text>
                <View style={{height:.9, width:"100%", backgroundColor:"#000000", marginTop:3.5, }} />
              </View>

              <View>
                <Text style={{marginTop:10, fontSize:19, opacity: 0.60 }} > Date </Text>
                <Text  style={styles.inputRef}> {this.state.date} </Text>
                <View style={{height:1, width:"100%", backgroundColor:"#000000", marginTop:5.5, }} />
              </View>

              <View>
                <TouchableOpacity onPress={this.validerChamps} >
                  <Icon name={'ios-camera'} style={styles.iconImageCamera} >
                  </Icon>
                </TouchableOpacity>
                <Text style={styles.textIconImageCamera} > {this.state.textSousIconImage}</Text>
              </View>

              <View  style={styles.textareaView}>
                <Text style={{marginTop:0, fontSize:19, opacity: 0.60, }} > Remarques </Text>
                <View style={{height:1.2, width:"97%", backgroundColor:this.state.colorLineRemarque, marginTop:6, alignSelf: "center", opacity: 1}} />
                <Textarea
                  containerStyle={styles.textareaContainer}
                  style={styles.textarea}
                  onChangeText={(valeurRemarque) => {this.setState({valeurRemarque: valeurRemarque})}}
                  maxLength={150}
                  placeholder={'Tapez ici vous remarques...'}
                  placeholderTextColor={'#000000'}
                  underlineColorAndroid={'transparent'}
                />
              </View>

              <View style={styles.viewErreur}>
                { this.state.msgErreur && <Text style={styles.textErreur}> {this.state.msgErreur} </Text> }
              </View>

              <View>

                <TouchableHighlight ref={ref => this.touchable = ref} style={styles.buttonAjouter} onPress={this.validerChamps}>                     
                  <Text style={styles.textButtonAjouter}> Ajouter </Text>
                </TouchableHighlight>

              </View>
            </View> 
          </ScrollView> 
        </View>
      );
    }
  }
}
    
//******************************************* Les styles  ***********************************************
    
    const styles = StyleSheet.create({

      textRefCompteur: {
        fontSize: 17,
        padding: 3,
        width:260,
        opacity:0.3
      },
      textIconImageCamera:{
        color: "rgba(0,97,166,1)",
        alignSelf: "center",
        marginTop:-10
      },
      iconImageCamera:{
        fontSize:80,
        color: "rgba(0,97,166,1)",
        alignSelf: "center",
        marginTop:0
      },
      textErreur : {
        color: "#FF000F",
        fontSize: 17,
        fontFamily: "roboto-regular",
      },
      viewErreur : {
        marginTop: 10,
        alignSelf: "center",
      },
      buttonAjouter: {
        width: 248,
        height: 52,
        backgroundColor: "rgba(0,97,166,1)",
        borderRadius: 25,
        marginTop: 20,
        alignSelf: "center",
      },
      textButtonAjouter: {
        color: "rgba(255,255,255,1)",
        fontSize: 25,
        fontFamily: "calibri-regular",
        marginTop: 9,
        alignSelf: "center",
      },
      textareaView: {
        marginTop:10,
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
        width: 170,
        height: 20,
        color: "rgba(255,255,255,1)",
        fontSize: 18,
        fontFamily: "roboto-700",
        lineHeight: 18,
        marginTop: 19,
        //alignSelf: "center",
        marginLeft:115
      }  
    });
