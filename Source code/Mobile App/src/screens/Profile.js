import React, { Component } from "react";
import { StyleSheet, View, Text, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import * as firebase from 'firebase';



export default class Profile extends React.Component { 

  constructor(props){
    super(props);
    this.state = {
      releveurs: {
        nom: 'is Loading', 
      },
      loading : true,
      photo:''
    }
  }

  componentDidMount() {
      const userId = firebase.auth().currentUser.uid
      const ref2 = firebase.database().ref('/releveurs/'+userId);

    ref2.once('value').then(snap => {
      this.setState ({
        releveurs: snap.val(),
        loading : false 
      })
    });
  }

  render() { 
    if (this.state.loading){
      return  (
      <View style={styles.loading}>
        <ActivityIndicator color='#827E7F' size="large" />
      </View>)
    }else{
    return (  
      <View> 
        <View style={styles.header}>
          <Text style={styles.textHeader}>Profile</Text>
        </View>
         
        <View>
          <Image style={styles.img} source={{ uri: this.state.releveurs.photo}}></Image>
        </View>

        <View style={styles.userName} > 
          <Text style={styles.nomUser}> {this.state.releveurs.nom} </Text> 
          <Text style={styles.prenomUser}> {this.state.releveurs.prenom} </Text>
        </View>

        <View style={styles.idRow}>
          <Text style={styles.idText}>CIN :</Text>
          <Text style={styles.idValue}> {this.state.releveurs.CIN} </Text>
        </View>

        <View style={styles.emailRow}>
          <Text style={styles.emailText}>Email :</Text>
          <Text style={styles.emailValue}> {this.state.releveurs.email} </Text>
        </View>
        
        <View style={styles.posteRow}>
          <Text style={styles.posteText}>Poste :</Text>
          <Text style={styles.posteValue}> {this.state.releveurs.poste} </Text>
        </View>

        <View style={styles.telRow}>
          <Text style={styles.telText}>N° Tel :</Text>
          <Text style={styles.telValue}> {this.state.releveurs.tel} </Text>
        </View>

        <TouchableOpacity 
          onPress={ () =>this.props.navigation.navigate("ModifierProfile", {
                          nom : this.state.releveurs.nom,
                          prenom : this.state.releveurs.prenom,
                          email : this.state.releveurs.email,
                          tel : this.state.releveurs.tel,
                          photo : this.state.releveurs.photo,
                        }
                        )} 
          style={styles.buttonUpdate}
        >
            <Text style={styles.textButtonUpdate}> Modifier profile </Text>
        </TouchableOpacity>
  
      </View>  
    )
    };  
  }  
}


//******************************************* Les styles CSS ******************************************

const styles = StyleSheet.create({

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {  
    width: 125,
    height: 125,
    borderRadius: 125/2,
    marginTop: 25,
    alignSelf: "center",
  },
  header: {
    //flex: 1,
    width: 360,
    height: 52,
    backgroundColor: "rgba(0,97,166,1)"
  },
  textHeader: {
    width: 59,
    height: 18,
    color: "rgba(255,255,255,1)",
    fontSize: 18,
    fontFamily: "roboto-700",
    lineHeight: 18,
    marginTop: 19,
    alignSelf: "center",
  },
  userName: {  
    alignSelf: "center",
    marginTop: 20  
  },
  nomUser: {  
    fontSize: 20,  
    fontFamily: "roboto-700",
    alignSelf: "center",
  },
  prenomUser: {  
    fontSize: 20,  
    fontFamily: "roboto-700",
    alignSelf: "center",
  },
//------------------------------ Champ email -----------------------------
  emailText: {
    fontFamily: "roboto-regular",
    color: "rgba(0,0,0,1)",
    height: 33,
    width: 75,
    fontSize: 22
  },
  emailValue: {
    fontFamily: "roboto-regular",
    color: "rgba(29,27,27,1)",
    height: 50,
    width: 215,
    fontSize: 21,
    marginLeft: -5
  },
  emailRow: {
    height: 50,
    flexDirection: "row",
    flex: 1,
    marginRight: 42,
    marginLeft: 22,
    marginTop: 40
  },
//------------------------------ Champ Identifiant -----------------------------
  idText: {
    fontFamily: "roboto-regular",
    color: "rgba(0,0,0,1)",
    height: 33,
    width: 115,
    fontSize: 22
  },
  idValue: {
    fontFamily: "roboto-regular",
    color: "rgba(29,27,27,1)",
    height: 50,
    width: 215,
    fontSize: 21,
    marginLeft: -65
  },
  idRow: {
    height: 50,
    flexDirection: "row",
    flex: 1,
    marginRight: 42,
    marginLeft: 22,
    marginTop: 30
  },
//------------------------------ Champ poste -----------------------------
  posteText: {
    fontFamily: "roboto-regular",
    color: "rgba(0,0,0,1)",
    height: 33,
    width: 75,
    fontSize: 22
  },
  posteValue: {
    fontFamily: "roboto-regular",
    color: "rgba(29,27,27,1)",
    height: 50,
    width: 215,
    fontSize: 21,
    marginLeft: -5
  },
  posteRow: {
    height: 50,
    flexDirection: "row",
    flex: 1,
    marginRight: 42,
    marginLeft: 22,
    marginTop: 40
  },
//------------------------------ Champ Tel -----------------------------
telText: {
  fontFamily: "roboto-regular",
  color: "rgba(0,0,0,1)",
  height: 33,
  width: 75,
  fontSize: 22
},
telValue: {
  fontFamily: "roboto-regular",
  color: "rgba(29,27,27,1)",
  height: 50,
  width: 215,
  fontSize: 21,
  marginLeft: -5
},
telRow: {
  height: 50,
  flexDirection: "row",
  flex: 1,
  marginRight: 42,
  marginLeft: 22,
  marginTop: 40
},
//------------------------------ bouton modifier -----------------------------
buttonUpdate: {
  width: 248,
  height: 52,
  backgroundColor: "rgba(0,97,166,1)",
  borderRadius: 25,
  marginTop: 85,
  marginLeft: 58
},
textButtonUpdate: {
  color: "rgba(255,255,255,1)",
  fontSize: 25,
  fontFamily: "calibri-regular",
  marginTop: 9,
  marginLeft: 41
},
}); 

