import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity,ScrollView, TextInput, TouchableHighlight,Alert } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import Textarea from 'react-native-textarea';
import * as firebase from 'firebase';
import Popover from 'react-native-popover-view';


export default class ReleverDetecter extends React.Component {

    constructor(props){
      super(props)
      this.state = {
        date:'',
        valeurIndex:'',
        valeurRemarque:'',
        msgErreur:null,
        nouvelConsommation:null,
        ancienValeurIndex:'',
        // Les states pour couleurs des lignes de sous chaque champs 
        colorLineRef:'#000000',
        colorLineIndex:'#000000',
        colorLineDate:"rgba(0,97,166,1)",
        colorLineRemarque:'#ECECEC',
        // Variable pour la visibilité de Popover
        isVisible: false,
      }
    }

// Fonction controle des saisies & changement couleur de chaque sous champs :

    validerChamps = () => {
      const {date,valeurIndex} = this.state

        if (valeurIndex == ""){

            this.setState({ msgErreur: "Entrer l'index de compteur" })
            this.setState({ colorLineIndex: "red" })
            this.setState({ colorLineRef: "#000000" })
            return false 

        }else if (date == ""){

            this.setState({ msgErreur: "Entrer le date d'aujourd'hui" })
            this.setState({ colorLineDate: "red" })
            this.setState({ colorLineIndex: "#000000" })
            this.setState({ colorLineRef: "#000000" })
            return false           
        }else{

            this.setState({ colorLineRemarque: "#ECECEC" });
            this.setState({ msgErreur: " " });
            this.setState({ colorLineRef: "#000000" });
            this.setState({ colorLineIndex: "#000000" });
            this.setState({ colorLineDate: "rgba(0,97,166,1)" });
            return true
      }
      
    }

  // Fonction pour envoyer le rélévement :

    Relever = () => {
      if( this.validerChamps() ) {  

            firebase.database().ref('/compteurs/'+this.props.navigation.getParam('code')+'/index').update({
              valeur: this.state.valeurIndex,
              date: this.state.date
            })
    
            firebase.database().ref('/compteurs/'+this.props.navigation.getParam('code')+'/remarque').update({
              valeur: this.state.valeurRemarque, 
              releverPar : this.state.releveurs.nom +' '+this.state.releveurs.prenom,      
              date: this.state.date
            })
            //  ???? il faut tout d'abord corriger le défaut juste au desous les states "Variable consommation" ?????
            firebase.database().ref('/compteurs/'+this.props.navigation.getParam('code')).update({
              consommation: this.state.valeurIndex - this.state.ancienValeurIndex
            })
            
           .then( () => {
            this.showPopover();
            this.setState({ valeurIndex:""});
            this.setState({ msgErreur:" "});
            //this.setState({ ancienValeurIndex:''});
          })
          .catch ((error) => {
            Alert.alert("error");
          });
      }     
    };

// Fonction pour ajouter le releveur concerné par cette rélevement & ajouter la date et l'heure de rélevement:

componentDidMount() {

  //Partie pour ajouter le releveur concerné par cette réclamation:
    const userId = firebase.auth().currentUser.uid
    const ref2 = firebase.database().ref('/releveurs/'+userId);

    ref2.once('value').then(snap => {
      this.setState ({
        releveurs: snap.val(),
      })
    });

  //Partie pour ajouter la date et l'heure de réclamation:
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
    
  // Pour calculer la différence entre le deux relévement "la consommation" : 
  const ref1 = firebase.database().ref('/compteurs/'+this.props.navigation.getParam('code')+'/index/valeur');    
  ref1.once('value').then(snap => {
    this.setState ({
      ancienValeurIndex: snap.val(),
    })
    console.log(this.state.ancienValeurIndex)
  });
}

// Deux fonctions pour Popover : 
showPopover() {
  this.setState({isVisible: true});
}
   
closePopover() {
  this.setState({isVisible: false});
}

// Fonction retour en arriére :
  Retour() {
    this.props.navigation.goBack();
    this.setState({ valeurIndex:""});
    this.setState({ colorLineIndex:"#000000"});
    this.setState({ msgErreur:" "});
  }

  toDetecteur() {
    this.props.navigation.navigate('DetectionRelevement')
    this.setState({ valeurIndex:""});
    this.setState({ colorLineIndex:"#000000"});
    this.setState({ msgErreur:" "});
  }


  // ************************************ La partie Principale de Vue **************************************
  
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
                <Text style={{marginTop:10, fontSize:19, opacity: 0.6 }} > Réf compteur </Text>
                <Text style={styles.textRefCompteur} > 
                    # {this.props.navigation.getParam('code')} 
                </Text>
                <View style={{height:.9, width:"100%", backgroundColor:this.state.colorLineRef, marginTop:3.5}} />
                <Icon name={'ios-camera'} style={styles.iconInputRef} 
                      onPress={() => this.toDetecteur()}>
                </Icon>
              </View>
    
              <View>
                <Text style={{marginTop:10, fontSize:19, opacity: 0.60 }} > Nouvel index </Text>
                <TextInput 
                  placeholder="Index..."
                  keyboardType ="numeric"
                  style={styles.inputRef} 
                  onChangeText = { valeurIndex => this.setState ({ valeurIndex }) } 
                >
                </TextInput>
                <View style={{height:.9, width:"100%", backgroundColor:this.state.colorLineIndex, marginTop:3.5, }} />
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
                { this.state.msgErreur && <Text style={styles.textErreur}> {this.state.msgErreur} </Text> }
              </View>

              <View>

                <TouchableHighlight ref={ref => this.touchable = ref} style={styles.buttonEnvoyer} onPress={this.Relever}>                     
                  <Text style={styles.textButtonEnvoyer}> Envoyer </Text>
                </TouchableHighlight>

                <Popover
                  placement='top'
                  arrowStyle={{backgroundColor: "transparent",width:35,height:20}}
                  popoverStyle={styles.popoverStyle}
                  isVisible={this.state.isVisible}
                  fromView={this.touchable}
                  onRequestClose={() => this.closePopover()}>

                  <Text style={styles.popoverText} > Opération terminer avec succés </Text>

                  <TouchableOpacity onPress={() => this.closePopover()}>
                    <Text style={styles.popoverOk} > OK </Text>
                  </TouchableOpacity>
                </Popover>

              </View>              
            </View>
          </ScrollView>
        </View>
      );
      }
    }
    
//******************************************* Les styles CSS *******************************************
    
    const styles = StyleSheet.create({
    
      textRefCompteur: {
        fontSize: 18,
        padding: 3,
        width:260,
        opacity:1
      },
      popoverOk:{
        fontSize:22,
        marginTop:25,
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
        width:270,
        height:110,
        marginLeft:0,
        borderRadius:10,
        shadowOffset:{  width: 10,  height: 10,},
        shadowColor: 'black',
        shadowOpacity: 1.5,
      },
      textErreur : {
        color: "#FF000F",
        fontSize: 15,
        fontFamily: "roboto-regular",
      },
      viewErreur : {
        marginTop: 15,
        alignSelf: "center",
      },
      textRetour : {
        color: "#2AB951",
        fontSize: 20,
        fontFamily: "roboto-regular",
      },
      viewRetour : {
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
        marginTop:18,
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
      calendrier:{
        width:300,
        marginTop:18,
        alignSelf: "center",
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

    