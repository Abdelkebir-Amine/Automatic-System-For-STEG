import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TouchableHighlight,
        Alert, ActivityIndicator, CheckBox } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import Textarea from 'react-native-textarea';
import * as firebase from 'firebase';
import Popover from 'react-native-popover-view';
import * as ImagePicker from "expo-image-picker";


export default class ReclamationDetecter extends React.Component { 
  
  constructor(props){
    super(props)
    this.state = {
      date:'',
      ref:'',
      typeReclamation: false,
      valeurRemarque:'',
      msgErreur:null,
      Image:'',
      uriImage:'',
      textSousIconImage:'Ajouter une image',
      // Les states pour couleurs des lignes de sous chaque champs 
      colorLineRef:'#000000',
      colorLineType:'#000000',
      colorLineDate:"rgba(0,97,166,1)",
      colorLineRemarque:'#ECECEC',
      colorTextIconImageCamera:'rgba(0,97,166,1)',
      // Variable pour la visibilité de Popover
      isVisible: false,
      // Variables pour la CheckBox
      panne: false,
      fraude : false,
    }
  }

// Fonction pour ajouter le releveur concerné par cette réclamation & ajouter la date et l'heure de réclamation :

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
  }

// Fonction controle des saisies & changement couleur de chaque lines sous champs :

  validerChamps = () => {
    const {date,typeReclamation,valeurRemarque,uriImage} = this.state

    if (typeReclamation == false){

      this.setState({ msgErreur: "Choisir le type de réclamation" })
      this.setState({ colorLineType: "red" })
      this.setState({ colorLineRef: "#000000" })
      return false       
    }
    else if (uriImage == ""){

      this.setState({ msgErreur: "Ajouter une image comme preuve " })
      this.setState({ colorLineDate: "rgba(0,97,166,1)" })
      this.setState({ colorLineRef: "#000000" })
      this.setState({ colorLineType: "#000000" })
      this.setState({colorTextIconImageCamera:'red'});
      return false      
    }else if (valeurRemarque == ""){

      this.setState({ msgErreur: "Vous remarques " })
      this.setState({ colorLineRemarque: "red" })
      this.setState({ colorLineDate: "rgba(0,97,166,1)" })
      this.setState({ colorLineRef: "#000000" })
      this.setState({ colorLineType: "#000000" })
      this.setState({colorTextIconImageCamera:'green'});
      return false      
    }else{

      this.setState({ colorLineRemarque: "#ECECEC" });
      this.setState({ msgErreur: " " });
      this.setState({ colorLineRef: "#000000" });
      this.setState({ colorLineType: "#000000" });
      this.setState({ colorLineDate: "rgba(0,97,166,1)" });
      this.setState({colorTextIconImageCamera:'green'});
      return true
    }
    
  }

// Fonction pour envoyer la réclamation

  envoyerReclamation = () => {
    if( this.validerChamps() ) {  

      firebase.database().ref('/reclamations').push({
      RefCompteur:this.props.navigation.getParam('code'),
      Type : this.state.typeReclamation,
      Text: this.state.valeurRemarque,
      Date: this.state.date,
      AjoutParReleveur: this.state.releveurs.nom +' '+ this.state.releveurs.prenom,
      Image: this.state.Image
      })
      .then( () => {
        this.showPopover();
        // l'appel de cette fonction " finaliseUploadImage() " si je veux ajouter l'image au Storage de firebase.
        this.finaliseUploadImage(); 
        // Pour réinitialiser les states :
        this.setState({ panne:false });
        this.setState({ fraude:false });
        this.setState({ typeReclamation:false });
        this.setState({ textSousIconImage:'Ajouter une image' });
        this.setState({colorTextIconImageCamera:'rgba(0,97,166,1)'});
        this.setState({ uriImage:'' });
        this.setState({ valeurRemarque:'' });

      })
      .catch ((error) => {
        Alert.alert("error");
      });
    }    
  };

// Les fonctions pour charger et envoyer l'image de réclamation : 
    // Choisir l'image
      ChoisirImage = async () => {
        let result = await ImagePicker.launchCameraAsync();
        if (!result.cancelled){
          this.setState({uriImage:result.uri});
          this.setState({Image:result.uri});
          // Modification msg de retour :
          this.setState({textSousIconImage:'Image ajouté avec succés'});
          this.setState({msgErreur:" "});
          this.setState({colorTextIconImageCamera:'green'});
        }
      }
    
    // Chargement d'image
      uploadImage = async (uri,ImageName) => {
        const response = await fetch (uri);
        const blob = await response.blob();
    
        var ref = firebase.storage().ref().child("Images des réclamations/" + ImageName);
        return ref.put(blob);
      }

    // Envoi d'image
      finaliseUploadImage =  () => {
          // this.uploadImage(uri d'image , nom d'image dans firebase)
          this.uploadImage(this.state.uriImage,this.props.navigation.getParam('code')+'-'+this.state.releveurs.CIN)
          .then( () => {
            this.setState({textSousIconImage:'Ajouter une image'});
            this.setState({colorTextIconImageCamera:'rgba(0,97,166,1)'});
            //Alert.alert("Success");
          })
          .catch ((error) => {
            Alert.alert(error);
          });
      }

// Show & close Popover : 
  showPopover() {
    this.setState({isVisible: true});
  }
 
  closePopover() {
    this.setState({isVisible: false});
  }

// Les fonctions de ChekBox : 
pannePressed() {
  this.setState({panne: true, fraude:false, typeReclamation:'Panne'});
  this.setState({colorLineType:"#000000" });
  this.setState({msgErreur:" " });
}

fraudePressed() {
  this.setState({panne: false, fraude:true, typeReclamation:'Fraude'});
  this.setState({colorLineType:"#000000" });
  this.setState({msgErreur:" " });
}

// Fonction retour en arriére & navigation vers detecteur :
  Retour() {
    this.props.navigation.goBack();

    this.setState({ panne:false });
    this.setState({ fraude:false });
    this.setState({ typeReclamation:false });
    this.setState({ colorLineRemarque:"#000000" });
    this.setState({ colorLineType:"#000000" });
    this.setState({ textSousIconImage:'Ajouter une image' });
    this.setState({colorTextIconImageCamera:'rgba(0,97,166,1)'});
    this.setState({ uriImage:'' });
    this.setState({ valeurRemarque:'' });
    this.setState({msgErreur:" " });
  }

  toDetecteur() {
    this.props.navigation.navigate('DetectionReclamation')

    this.setState({ panne:false });
    this.setState({ fraude:false });
    this.setState({ typeReclamation:false });
    this.setState({ colorLineRemarque:"#000000" });
    this.setState({ colorLineType:"#000000" });
    this.setState({ textSousIconImage:'Ajouter une image' });
    this.setState({colorTextIconImageCamera:'rgba(0,97,166,1)'});
    this.setState({ uriImage:'' });
    this.setState({ valeurRemarque:'' });
    this.setState({msgErreur:" " });
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
                <Text style={styles.textRefCompteur} > 
                    # {this.props.navigation.getParam('code')} 
                </Text>
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

                <View style={{height:.9, width:"100%", backgroundColor:this.state.colorLineType, marginTop:6.5, }} />
              </View>

              <View>
                <Text style={{marginTop:10, fontSize:19, opacity: 0.60 }} > Date </Text>
                <Text  style={styles.inputRef}> {this.state.date} </Text>
                <View style={{height:1, width:"100%", backgroundColor:"#000000", marginTop:5.5, }} />
              </View>

              <View>
                <Icon name={'ios-camera'} style={styles.iconImageCamera}
                onPress={this.ChoisirImage} 
                >
                </Icon>
                <Text style={{color: this.state.colorTextIconImageCamera,alignSelf: "center",marginTop:-10}} > 
                  {this.state.textSousIconImage} 
                </Text>
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

                <TouchableHighlight ref={ref => this.touchable = ref} style={styles.buttonAjouter} onPress={this.envoyerReclamation}>                     
                  <Text style={styles.textButtonAjouter}> Ajouter </Text>
                </TouchableHighlight>

                <Popover
                  placement='top'
                  arrowStyle={{backgroundColor: "transparent",width:35,height:20}}
                  popoverStyle={styles.popoverStyle}
                  isVisible={this.state.isVisible}
                  fromView={this.touchable}
                  onRequestClose={() => this.closePopover()}>

                  <Text style={styles.popoverText} > Réclamation ajouter avec succés </Text>

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
}
    
//********************************************* CSS *******************************************
    
    const styles = StyleSheet.create({
    

    textRefCompteur: {
        fontSize: 18,
        padding: 3,
        width:260,
        opacity:1
    },
      iconImageCamera:{
        fontSize:80,
        color: "rgba(0,97,166,1)",
        alignSelf: "center",
        marginTop:0
      },
      popoverOk:{
        fontSize:22,
        marginTop:20,
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
        width:290,
        height:110,
        marginLeft:0,
        borderRadius:10,
        shadowOffset:{  width: 10,  height: 10,},
        shadowColor: 'black',
        shadowOpacity: 1.5,
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
      buttonAjouter: {
        width: 248,
        height: 52,
        backgroundColor: "rgba(0,97,166,1)",
        borderRadius: 25,
        marginTop: 25,
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
