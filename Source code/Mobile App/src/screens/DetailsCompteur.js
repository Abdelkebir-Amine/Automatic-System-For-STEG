import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity,ScrollView,Alert, TouchableHighlight} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import Popover from 'react-native-popover-view'



export default class DetailsCompteur extends React.Component {
  
  state = {
    isVisible: false,
  }

  showPopover() {
    this.setState({isVisible: true});
  }
 
  closePopover() {
    this.setState({isVisible: false});
  }

  toPosition() {
    if (this.props.navigation.getParam('posLatitude') == 0 || this.props.navigation.getParam('posLongitude') == 0){
      Alert.alert("Position non enregistré.      Merci de Mettre à jour !")
    }
    else {
    this.setState({isVisible: false});
    this.props.navigation.navigate("Position",{latitude:this.props.navigation.getParam('posLatitude'),
                                              longitude:this.props.navigation.getParam('posLongitude'),
                                              ref:this.props.navigation.getParam('ref'),
                                              emplacement:this.props.navigation.getParam('emplacement'),
                                              nameCli:this.props.navigation.getParam('nameCli'),
                                            })
     }
  };

  toMajPosition() {
    this.setState({isVisible: false});
    this.props.navigation.navigate("MajPosition",{ ref:this.props.navigation.getParam('ref')} )
  };

  render() {

  return (
    <View> 
{/****************************************** Header ***************************************/}
      <View style={styles.header}>
        <Text style={styles.textHeader}>Détails compteur</Text>
        <TouchableOpacity  onPress={() => this.props.navigation.goBack()} style={styles.touchIconRetour} >
          <Icon name={'md-arrow-back'} style={styles.icon}></Icon>
        </TouchableOpacity>
      </View> 
{/************************************** Partie principale *********************************/}

      <View style={styles.MainContainer}>
      <ScrollView>
        <Text style={{marginTop:10, fontSize:16, opacity: 0.60 }} > Réference compteur </Text>
        <Text style={styles.row} ># {this.props.navigation.getParam('ref')} </Text>
        <View style={{height:.5, width:"100%", backgroundColor:"#000",  }} />
        <Text style={{marginTop:10, fontSize:16, opacity: 0.60 }} > Type de compteur </Text>
        <Text style={styles.row} >{this.props.navigation.getParam('type')} </Text>
        <View style={{height:.5, width:"100%", backgroundColor:"#000",  }} />
        <Text style={{marginTop:10, fontSize:16, opacity: 0.60 }} > Client </Text>
        <Text style={styles.row} >
          {this.props.navigation.getParam('nameCli')} 
          {'\n'}<Text style={{fontSize:16, }} >Tel : {this.props.navigation.getParam('telCli')}</Text>
          {'\n'}<Text style={{fontSize:16 }} >E-mail : {this.props.navigation.getParam('mailCli')}</Text> 
        </Text>
        <View style={{height:.5, width:"100%", backgroundColor:"#000",  }} />
        <Text style={{marginTop:10, fontSize:16,opacity: 0.60 }} > Emplacement </Text>
        <Text style={styles.row} >{this.props.navigation.getParam('emplacement')} </Text>
        <View style={{height:.5, width:"100%", backgroundColor:"#000",  }} />
        <Text style={{marginTop:10, fontSize:16, opacity: 0.60 }} > Dernier rélevement </Text>
        <Text style={styles.row} >
          <Text style={styles.row} >{this.props.navigation.getParam('indexVal')} KW/h </Text> 
          {'\n'}<Text style={{fontSize:16 }} >* Le {this.props.navigation.getParam('indexDate')}</Text>
        </Text>
        <View style={{height:.5, width:"100%", backgroundColor:"#000",  }} />
        <Text style={{marginTop:10, fontSize:16, opacity: 0.60 }} > Remarque </Text>
        <Text style={styles.row} >
          <Text style={styles.row} >{this.props.navigation.getParam('valReq')} </Text> 
          {'\n'}<Text style={{fontSize:16 }} >* Le {this.props.navigation.getParam('dateReq')}</Text>
        </Text>
        <View style={{height:.5, width:"100%", backgroundColor:"#000",  }} />
        <View style={styles.buttonRow}>
          <TouchableHighlight ref={ref => this.touchable = ref} style={styles.buttonPosition} onPress={() => this.showPopover()}>                     
            <Text style={styles.textButtonPosition}>Position</Text>
          </TouchableHighlight>
          <Popover
            placement='top'
            arrowStyle={{backgroundColor: "#ffffff",width:35,height:20}}
            popoverStyle={styles.popoverStyle}
            isVisible={this.state.isVisible}
            fromView={this.touchable}
            onRequestClose={() => this.closePopover()}>

            <TouchableOpacity onPress={() => this.toPosition()}>
            <Text style={styles.popoverLien1} >Position actuelle</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.toMajPosition()}>
            <Text style={styles.popoverLien2} >Mettre à jour position</Text>
            </TouchableOpacity>
          </Popover>

          <TouchableOpacity onPress={() =>this.props.navigation.navigate("Relever")} style={styles.buttonRelever}>
              <Text style={styles.textButtonRelever}> Relever </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </View>
    </View>
  );
  }
}

//******************************************* Les styles CSS *******************************************

const styles = StyleSheet.create({
  popoverLien1:{
    fontSize:22,
    alignSelf: "center",
    marginTop:15,
    color: "#0061A6",
    fontFamily: "roboto-700",
  },
  popoverLien2:{
    fontSize:22,
    alignSelf: "center",
    marginTop:15,
    color: "#0061A6",
    //fontFamily: "roboto-700",
  },
  popoverStyle:{
    backgroundColor: "#ffffff",
    width:245,
    height:135,
    marginLeft:20,
    borderRadius:10,
    shadowOffset:{  width: 10,  height: 10,},
    shadowColor: 'black',
    shadowOpacity: 1.5,
  },
  buttonRow: {
    height: 110,
    flexDirection: "row",
    //flex: 1,
    alignSelf: "center",
    marginTop: 2
  },
  buttonRelever: {
    width: 150,
    height: 48,
    backgroundColor: "rgba(0,97,166,1)",
    borderRadius: 25,
    marginTop: 40,
    marginLeft: 2
  },
  textButtonRelever: {
    color: "rgba(255,255,255,1)",
    fontSize: 25,
    fontFamily: "calibri-regular",
    marginTop: 7,
    alignSelf: "center",
  },
  buttonPosition: {
    width: 150,
    height: 48,
    backgroundColor: "rgba(0,97,166,1)",
    borderRadius: 25,
    marginTop: 40,
    marginLeft: 2
  },
  textButtonPosition: {
    color: "rgba(255,255,255,1)",
    fontSize: 25,
    fontFamily: "calibri-regular",
    marginTop: 7,
    alignSelf: "center",
  },
  row: {
    fontSize: 20,
    padding: 8,
    fontFamily: "roboto-regular",
  },
  MainContainer: {
    justifyContent: 'center',
    margin: 15,
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
    width: 140,
    height: 20,
    color: "rgba(255,255,255,1)",
    fontSize: 18,
    fontFamily: "roboto-700",
    lineHeight: 18,
    marginTop: 19,
    alignSelf: "center",
  }  
});

