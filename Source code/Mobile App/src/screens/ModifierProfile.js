import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity,ScrollView, TextInput, TouchableHighlight,
         Alert, Image } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import * as firebase from 'firebase';
import Popover from 'react-native-popover-view';
import * as ImagePicker from "expo-image-picker";

export default class ModifierProfile extends React.Component { 
  
  constructor(props){
    super(props);
    this.state = {
      loading : true,
      nom:this.props.navigation.getParam('nom'),
      prenom:this.props.navigation.getParam('prenom'),
      tel:this.props.navigation.getParam('tel'),
      newEmail:'',
      currentPassword:'',
      newPassword:'',
      textSousIconImage:'Changer photo de profile',
      Image:this.props.navigation.getParam('photo'),
      uriImage:'',
      msgErreur:null,
      msgErreurEmail:null,
      msgErreurPassword:null,
      // Les states pour couleurs des lignes de sous chaque champs 
      colorMsgErreurPassword:'red',
      colorMsgErreurEmail:'red',
      colorLineNom:'#000000',
      colorLinePrenom:'#000000',
      colorLineTel:'#000000',
      colorTextSousIconImage:"rgba(0,97,166,1)",
      // Variable pour la visibilité de Popover
      isVisible: false,
    }
  }

// Fonction de réthentification  :
Rethentifier = (currentPassword) => {
  var user = firebase.auth().currentUser;
  var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
  return user.reauthenticateWithCredential(cred);
}

// Fonction modification de mot de passe :
onChangePassword = () => {

  this.Rethentifier(this.state.currentPassword).then(() => {

    var user = firebase.auth().currentUser;
    // Changement sur Authenfication Firebase :
    user.updatePassword(this.state.newPassword)
    .then(() => {
      this.setState({ msgErreurPassword: "Mot de passe changer avec succés" });
      this.setState({ colorMsgErreurPassword: "green" });
    }).catch(error => this.setState({ msgErreurPassword: error.message }))
  }).catch(error => this.setState({ msgErreurPassword: error.message }))
}

// Fonction modification d'Email :
onChangeEmail = () => {

  this.Rethentifier(this.state.currentPassword).then(() => {

    var user = firebase.auth().currentUser;
    const userId = firebase.auth().currentUser.uid;
    // Changement sur realTime database FireBase :
    firebase.database().ref('/releveurs/'+userId).update({
      email: this.state.newEmail
    })
    // Changement sur Authenfication Firebase :
    user.updateEmail(this.state.newEmail).then(() => {
      this.setState({ msgErreurEmail: "Email changer avec succés" });
      this.setState({ colorMsgErreurEmail: "green" });
    }).catch(error => this.setState({ msgErreurEmail: error.message }))
  }).catch(error => this.setState({ msgErreurEmail: error.message }))
}

// Deux fonctions pour Popover : 
  showPopover() {
    this.setState({isVisible: true});
  }
 
  closePopover() {
    this.setState({isVisible: false});
    this.setState({nom:null});
  }

// Fonction pour faire la modification de nom, prenom, tel : 
  updateProfile = () => {
    if( this.validerChamps() ) {  

          const userId = firebase.auth().currentUser.uid

          firebase.database().ref('/releveurs/'+userId).update({
            prenom: this.state.prenom,
            nom: this.state.nom,
            tel: this.state.tel,
            // Ici pour ajouter l'image au RealTime DataBase
            photo: this.state.Image 
          })

         .then( () => {
            this.showPopover();
            this.setState({colorTextSousIconImage:"rgba(0,97,166,1)"});
            this.setState({textSousIconImage:'Changer photo de profile'});

            // l'appel de cette fonction " finaliseUploadImage() " si je veux ajouter l'image au Storage de firebase.
            //this.finaliseUploadImage();
          })
          .catch ((error) => {
            Alert.alert("error");
          });
    }     
  };

// Fonction controle des saisies & changement couleur de Nom, Prenom, Tel :
  validerChamps = () => {
    const {nom, prenom, tel} = this.state

    if (nom == ""){

      this.setState({ msgErreur: "Entrer votre nouveau Nom" })
      this.setState({ colorLineNom: "red" })
      return false

    }else if (prenom == ""){

      this.setState({ msgErreur: "Entrer votre nouveau Prenom" })
      this.setState({ colorLinePrenom: "red" })
      this.setState({ colorLineNom: "#000000" })
      return false 

    }else if (tel == ""){

      this.setState({ msgErreur: "Entrer votre numéro de téléphone" })
      this.setState({ colorLineTel: "red" })
      this.setState({ colorLinePrenom: "#000000" })
      this.setState({ colorLineNom: "#000000" })
      return false           
    }else{

      this.setState({ msgErreur: " " });
      this.setState({ colorLineNom: "#000000" });
      this.setState({ colorLinePrenom: "#000000" });
      this.setState({ colorLineTel: "#000000" });
      return true
    } 
  }

// Les fonctions pour charger et envoyer l'image de profile : 
    // prendre l'image
    ChoisirImage = async () => {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.cancelled){
        this.setState({uriImage:result.uri});
        this.setState({Image:result.uri});
        this.setState({textSousIconImage:'Nouvelle photo chargé'});
        this.setState({colorTextSousIconImage:"green"});
      }
    }
    
    // Chargement d'image
    uploadImage = async (uri,ImageName) => {
      const response = await fetch (uri);
      const blob = await response.blob();
  
      var ref = firebase.storage().ref().child("Images des releveurs/" + ImageName);
      return ref.put(blob);
    }

    // Envoi d'image
    finaliseUploadImage =  () => {
        // this.uploadImage(uri d'image , nom d'image dans firebase)
        this.uploadImage(this.state.uriImage,this.props.navigation.getParam('nom')+'-'+this.props.navigation.getParam('prenom')+'-'+this.state.releveurs.CIN)
        .then( () => {
          //Alert.alert("Success");
        })
        .catch ((error) => {
          Alert.alert(error);
        });
    }

// Fonction pour ajouter le releveur connecté :
componentDidMount() {
  const userId = firebase.auth().currentUser.uid
  const ref2 = firebase.database().ref('/releveurs/'+userId);

  ref2.once('value').then(snap => {
    this.setState ({
      releveurs: snap.val(),
    })
  });
}

// Fonction de retour et réinitialisation des states :
  Retour() {
    this.props.navigation.goBack();

    this.setState({textSousIconImage:'Changer image de profile'});
    this.setState({Image:this.props.navigation.getParam('photo')});
    this.setState({uriImage:''});
    this.setState({msgErreur:null});
    this.setState({msgErreurEmail:null});
    this.setState({msgErreurPassword:null});
    // Les states pour couleurs des lignes de sous chaque champs 
    this.setState({colorLineNom:'#000000'});
    this.setState({colorLinePrenom:'#000000'});
    this.setState({colorLineTel:'#000000'});
    this.setState({colorTextSousIconImage:"rgba(0,97,166,1)"});
  }



  render() {
    return (  
        <View>

          <View style={styles.header}>
            <Text style={styles.textHeader}>Modifier Profile</Text>
              <TouchableOpacity  onPress={() => this.Retour()} style={styles.touchIconRetour} >
                <Icon name={'md-arrow-back'} style={styles.icon}></Icon>
              </TouchableOpacity>
          </View>

          <ScrollView>
            <View style={styles.partieRows}>

                <View>
                  <Image style={styles.img} source={{uri: this.state.Image}}></Image>
                </View>

                <View>
                  <Icon name={'ios-camera'} style={styles.iconImageCamera}
                  onPress={this.ChoisirImage} 
                  >
                  </Icon>
                  <Text style={{color: this.state.colorTextSousIconImage, alignSelf: "center", marginTop:15}} > {this.state.textSousIconImage}</Text>
                </View>

                <View>
                  <Text style={{marginTop:10, fontSize:19, opacity: 0.60 }} > Nom </Text>
                  <TextInput 
                    //placeholder={this.props.navigation.getParam('nom')} 
                    defaultValue={this.props.navigation.getParam('nom')}
                    style={styles.inputStyle}
                    onChangeText = { nom => this.setState ({ nom }) }
                  >
                  </TextInput >
                  <View style={{height:.9, width:"100%", backgroundColor:this.state.colorLineNom, marginTop:3.5}} />
                </View>

                <View>
                  <Text style={{marginTop:10, fontSize:19, opacity: 0.60 }} > Prenom </Text>
                  <TextInput 
                    //placeholder={this.props.navigation.getParam('prenom')} 
                    defaultValue={this.props.navigation.getParam('prenom')}
                    style={styles.inputStyle}
                    onChangeText = { prenom => this.setState ({ prenom}) }
                  >
                  </TextInput >
                  <View style={{height:.9, width:"100%", backgroundColor:this.state.colorLinePrenom, marginTop:3.5}} />
                </View>

                <View>
                  <Text style={{marginTop:10, fontSize:19, opacity: 0.60 }} > Tel </Text>
                  <TextInput 
                    //placeholder={this.props.navigation.getParam('tel')} 
                    defaultValue={this.props.navigation.getParam('tel')}
                    style={styles.inputStyle}
                    onChangeText = { tel => this.setState ({ tel }) }
                    keyboardType ="numeric"
                  >
                  </TextInput >
                  <View style={{height:1, width:"100%", backgroundColor:this.state.colorLineTel, marginTop:3.5, }} />
                </View>

                <View style={styles.viewErreur}>
                  { this.state.msgErreur && <Text style={styles.textErreur}> {this.state.msgErreur} </Text> }
                </View>

                <View>

                  <TouchableHighlight ref={ref => this.touchable = ref} style={styles.buttonChanger} onPress={this.updateProfile}>                     
                    <Text style={styles.textButtonChanger}> Enregistrer </Text>
                  </TouchableHighlight>

                  <Popover
                    placement='top'
                    arrowStyle={{backgroundColor: "transparent",width:35,height:20}}
                    popoverStyle={styles.popoverStyle}
                    isVisible={this.state.isVisible}
                    fromView={this.touchable}
                    onRequestClose={() => this.closePopover()}>

                    <Text style={styles.popoverText} > Profile modifié avec succés </Text>

                    <TouchableOpacity onPress={() => this.closePopover()}>
                      <Text style={styles.popoverOk} > OK </Text>
                    </TouchableOpacity>
                  </Popover>

                </View>                 

                <View>
                  <Text style={{marginTop:85, fontSize:22, color:"rgba(0,97,166,1)", fontFamily: "roboto-700", }} > 
                    Paramétres avancés 
                  </Text>
                  <View style={{height:2, width:"105%", backgroundColor:"rgba(0,97,166,1)", marginTop:3.5, marginLeft:-10 }} />
                </View>

                <View>
                  <Text style={{marginTop:10, fontSize:17, color:"rgba(0,97,166,1)", marginLeft:30 }} > 
                    Changement d'email  
                  </Text>
                  <View style={{height:1, width:"50%", backgroundColor:"rgba(0,97,166,1)", marginTop:1.5, marginLeft:30}} />
                </View>

                <View>
                  <View>
                    <Text style={{marginTop:10, fontSize:19, opacity: 0.70 }} > Nouveau email </Text>
                    <TextInput 
                      placeholder={this.props.navigation.getParam('email')} 
                      style={styles.inputStyle}
                      onChangeText = { newEmail => this.setState ({ newEmail }) }
                      keyboardType ="email-address"
                      autoCapitalize="none"
                    >
                    </TextInput >
                    <View style={{height:1, width:"100%", backgroundColor:"#000000", marginTop:3.5}} />
                  </View>

                  <View>
                    <View>
                      <Text style={{marginTop:20, fontSize:19, opacity: 0.70 }} > Validation par Mot de passe </Text>
                      <TextInput 
                        placeholder={'******'} 
                        style={styles.inputStyle}
                        onChangeText = { currentPassword => this.setState ({ currentPassword }) }
                        secureTextEntry={true}
                        autoCapitalize="none"
                      >
                      </TextInput >
                      <View style={{height:1, width:"100%", backgroundColor:"#000000", marginTop:3.5}} />
                    </View>
                  </View>

                  <View style={styles.viewErreurEmail}>
                    {this.state.msgErreurEmail && <Text style={{ color: this.state.colorMsgErreurEmail,fontSize: 15,fontFamily: "roboto-regular",}}>{this.state.msgErreurEmail} </Text> }
                  </View>

                  <TouchableOpacity style={styles.viewEnregistrerEmail} onPress={this.onChangeEmail} >
                    <Text style={styles.textEnregistrerEmail} > 
                      Enregistrer 
                    </Text>
                  </TouchableOpacity>

                </View>

                <View>
                  <Text style={{marginTop:25, fontSize:17, color:"rgba(0,97,166,1)", marginLeft:30 }} > 
                    Changement de mot de passe   
                  </Text>
                  <View style={{height:1, width:"72%", backgroundColor:"rgba(0,97,166,1)", marginTop:1.5, marginLeft:30}} />
                </View>

                <View>
                  <View>
                    <Text style={{marginTop:10, fontSize:19, opacity: 0.70 }} > Ancien Mot de passe </Text>
                    <TextInput 
                      placeholder={'******'} 
                      style={styles.inputStyle}
                      onChangeText = { currentPassword => this.setState ({ currentPassword }) }
                      secureTextEntry={true}
                      autoCapitalize="none"
                    >
                    </TextInput >
                    <View style={{height:1, width:"100%", backgroundColor:"#000000", marginTop:3.5}} />
                  </View>
                </View>

                <View>
                  <View>
                    <Text style={{marginTop:20, fontSize:19, opacity: 0.70 }} > Nouveau Mot de passe </Text>
                    <TextInput 
                      placeholder={'******'} 
                      style={styles.inputStyle}
                      onChangeText = { newPassword => this.setState ({ newPassword }) }
                      secureTextEntry={true}
                    >
                    </TextInput >
                    <View style={{height:1, width:"100%", backgroundColor:"#000000", marginTop:3.5}} />
                  </View>

                  <View style={styles.viewErreurPassword}>
                    {this.state.msgErreurPassword && <Text style={{ color: this.state.colorMsgErreurPassword,fontSize: 15,fontFamily: "roboto-regular",}}>{this.state.msgErreurPassword} </Text> }
                  </View>

                  <TouchableOpacity style={styles.viewEnregistrerEmail} onPress={this.onChangePassword} >
                    <Text style={styles.textEnregistrerEmail} > 
                      Enregistrer 
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.viewMargin} ></View>

              </View>
            </ScrollView>

        </View>  
    )
    };  
    
}


//******************************************* Les styles CSS ****************************************

const styles = StyleSheet.create({  
    
  iconImageCamera:{
    fontSize:60,
    color: "rgba(0,97,166,1)",
    marginLeft:200,
    marginTop:-65
  },
  viewErreurPassword : {
    marginTop: 15,
    //alignSelf: "center",
    marginLeft:15
  },
  viewErreurEmail : {
    marginTop: 15,
    //alignSelf: "center",
    marginLeft:15
  },
  viewMargin: {
    marginTop:150, 
  },
  textEnregistrerPassword: {
    marginTop:2, 
    fontSize:18, 
    color:"rgba(0,97,166,1)", 
    fontFamily: "roboto-700", 
    alignSelf: "center",
  },
  viewEnregistrerPassword: {
    width: 135,
    height: 30,
    backgroundColor: "#ffffff",
    borderRadius: 25,
    marginTop: 2,
    marginLeft:203,
    //marginBottom:-150
  },
  textEnregistrerEmail: {
    marginTop:2, 
    fontSize:18, 
    color:"rgba(0,97,166,1)", 
    fontFamily: "roboto-700", 
    alignSelf: "center",
  },
  viewEnregistrerEmail: {
    width: 135,
    height: 30,
    backgroundColor: "#ffffff",
    borderRadius: 25,
    marginTop: 2,
    marginLeft:203
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
  buttonChanger: {
    width: 248,
    height: 52,
    backgroundColor: "rgba(0,97,166,1)",
    borderRadius: 25,
    marginTop: 25,
    alignSelf: "center",
  },
  textButtonChanger: {
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
  },
  inputStyle: {
    fontSize: 18,
    padding: 0,
    width:260,
    fontFamily: "roboto-regular",
    //backgroundColor:"#000000",
    marginLeft: 10,
  },
  img: {  
    width: 125,
    height: 125,
    borderRadius: 125/2,
    marginTop: 25,
    alignSelf: "center",
  },  
  partieRows: {
      justifyContent: 'center',
      margin: 20,
      marginTop:5
    },
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
      width: 130,
      height: 20,
      color: "rgba(255,255,255,1)",
      fontSize: 18,
      fontFamily: "roboto-700",
      lineHeight: 18,
      marginTop: 19,
      alignSelf: "center",
    }  
}); 
