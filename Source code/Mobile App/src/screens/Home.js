
import React, {Component } from "react";
import { StyleSheet, View, Text,TouchableOpacity, ActivityIndicator, TouchableHighlight, StatusBar} from "react-native";
import { createBottomTabNavigator, createAppContainer} from 'react-navigation';  
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import MapView, { PROVIDER_GOOGLE, Marker, Callout} from "react-native-maps";
import Icon from 'react-native-vector-icons/Ionicons';
import * as firebase from 'firebase';
import Profile from "./Profile";
import Recherche from "./Recherche";
import Popover from 'react-native-popover-view'


class Home extends React.Component {  

// Fonction déconnexion
SignOutUser = () => {
  firebase.auth().signOut();
};

constructor (props) {
  super(props);
  this.state={
    isVisible: false,
    latitude:0,
    longitude:0,
    error:null,
    loading : true,
  };
}

showPopover() {
  this.setState({isVisible: true});
}

closePopover() {
  this.setState({isVisible: false});
}

  // Foncton déconnexion & fermeture de menu
deconnexion () {
  this.setState({isVisible: false});
  this.SignOutUser();
};
  // Fonction de naviguer vers Rélévement & fermeture de menu
toRelevement() {
  this.setState({isVisible: false});
  this.props.navigation.navigate("Relever")
};

toReclamation() {
  this.setState({isVisible: false});
  this.props.navigation.navigate("Reclamation")
};

  // Les fonctions de maps :
componentDidMount () {
  navigator.geolocation.getCurrentPosition(
    position => {
      this.setState({
        loading : false,
        latitude:position.coords.latitude,
        longitude:position.coords.longitude,
        error:null,
        timePassed: false 
      });
    },
    error => this.setState({ error:error.message}),
    {enableHighAccuracy: true,timeout:20000,maximumAge:2000}
  ); 
}


  render() { 
    if ( this.state.loading  ){
      return  (
      <View>
        <StatusBar
          animated={false}
          barStyle="dark-content"
          hidden={false}
          backgroundColor="#D8D0D0"
        ></StatusBar>        
          {/***************************** Header Loading *************************************/}
        <View style={styles.header}>
          <Text style={styles.textHeader}>Accueil</Text>
          <TouchableOpacity   style={styles.touchIconMenu} >
            <Icon name={'ios-list'} style={styles.iconMenu}></Icon>
          </TouchableOpacity> 
        </View>

        <View style={styles.loading}>
          <ActivityIndicator color='#827E7F' size="large" />
        </View>

      </View>

      )
    }else{ 
    return ( 
        <View>
          <StatusBar
            animated={false}
            barStyle="dark-content"
            hidden={false}
            backgroundColor="#D8D0D0"
          ></StatusBar>
        {/***************************** Header Screen *************************************/}
          <View style={styles.header}>
            <Text style={styles.textHeader}>Accueil</Text>

            <TouchableHighlight ref={ref => this.touchable = ref} style={styles.touchIconMenu} onPress={() => this.showPopover()}>                     
              <Icon name={'ios-list'} style={styles.iconMenu}></Icon>
            </TouchableHighlight>
            <Popover
            placement='bottom'
            arrowStyle={{backgroundColor: "#ffffff",width:25,height:20,}}
            popoverStyle={styles.popoverStyle}
            isVisible={this.state.isVisible}
            fromView={this.touchable}
            onRequestClose={() => this.closePopover()}>

            <TouchableOpacity onPress={()=> this.toRelevement() }>
              <Text style={styles.popoverLien1} > Réléver consommation </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> this.toReclamation() } >
              <Text style={styles.popoverLien2} > Lancer réclamation </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> this.deconnexion() }>
              <Text style={styles.popoverLien3} > Se déconnecter </Text>
              <Icon name={'md-power'} style={styles.iconPower}></Icon>
            </TouchableOpacity>

          </Popover>

          </View> 
        {/***************************** Partie Maps *************************************/}
          <MapView
            provider={PROVIDER_GOOGLE}
            //showUserLocation            
            initialRegion={{
            latitude: this.state.latitude,
            longitude : this.state.longitude,
            latitudeDelta: 1.020,
            longitudeDelta: 2.0127
            }}
            customMapStyle={[]}
            style={styles.mapView}
            >
           <Marker coordinate={this.state}>
              <Callout>
                <Text> 
                  Votre position actuelle {'\n'}
                  Latitude : {this.state.latitude} {'\n'} 
                  Longitude : {this.state.longitude} 
                </Text>
              </Callout>
            </Marker>

            <Marker coordinate={{latitude:35.5182341,longitude:11.0413024}} pinColor='#0000ff'>
              <Callout>
                <Text> Compteur : A.Taher sfar </Text>
                <Text> Client : Client 3 </Text>
              </Callout>
            </Marker>

            <Marker coordinate={{latitude:35.5182341,longitude:11.0313024}} pinColor='#0000ff'>
              <Callout>
                <Text> Compteur : Zena Esthetique </Text>
                <Text> Client : Client 1 </Text>
              </Callout>
            </Marker>

            <Marker coordinate={{latitude:35.5161615,longitude:11.0381212}} pinColor='#0000ff'>
              <Callout>
                <Text> Compteur : Lycée technique </Text>
                <Text> Client : Client 2 </Text>
              </Callout>
            </Marker>

          </MapView>

        </View>  
    )
    };
  }  
}

//******************************************* Les styles CSS ********************************************

const styles = StyleSheet.create({ 
  

  iconPower:{
    fontSize:23,
    color: "#ff0000",
    marginLeft:218,
    marginTop:-25
  },
  popoverLien3:{
    fontSize:22,
    marginLeft:45,
    marginTop:30,
    color: "#ff0000",
    fontFamily: "roboto-700",
  },
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
    fontFamily: "roboto-700",
  },
  popoverStyle:{
    backgroundColor: "#ffffff",
    width:265,
    height:170,
    marginLeft:0,
    borderRadius:10,
    shadowOffset:{  width: 10,  height: 10,},
    shadowColor: 'black',
    shadowOpacity: 1.5,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:250
  },
  mapView: {
    height: 622.5,
    width: 360,
    //marginTop:35
  },
  buttonDeCnx: {
    fontSize:22,
    color: "#ff0000",
    marginTop:50,
  },
  lien1: {
    fontSize:22,
    color: "#585757",
    marginTop:20,
  },
  lien2: {
    fontSize:22,
    color: "#585757",
    marginTop:20,
  },
  touchIconRetour: {
    width: 45,
    height: 38,
    backgroundColor: "#ffffff",
    //backgroundColor:"rgba(0,97,166,1)",
    marginTop: 55,
    marginLeft: -10,
  },
  iconRetour: {
    color: "#6A6767",
    fontSize: 38,
    marginTop: 1,
    marginLeft: 8,
  },
  CadreMenu: {
    backgroundColor:"#ffffff", 
    flex:1,
    padding:10,
    marginLeft:90,
    marginBottom:445,
    //borderRadius:8,

  },
  touchIconMenu: {
    width: 45,
    height: 38,
    //backgroundColor: "rgba(205,23,23,1)",
    backgroundColor:"rgba(0,97,166,1)",
    marginTop: -32,
    marginLeft: 310
  },
  iconMenu: {
    color: "rgba(255,255,255,1)",
    fontSize: 35,
    marginTop: 1,
    marginLeft: 12,
  },
  test: {  
      marginTop: 19,
      fontSize: 18,  
      marginLeft: 125
  },
  header: {
    width: 360,
    height: 52,
    backgroundColor: "rgba(0,97,166,1)",
    //marginTop:35
  },
  textHeader: {
    width: 62,
    height: 18,
    color: "rgba(255,255,255,1)",
    fontSize: 18,
    fontFamily: "roboto-700",
    lineHeight: 18,
    marginTop: 19,
    alignSelf: "center",
  },
}); 

//************************************* Barre de navigation ******************************************

const TabNavigator = createMaterialBottomTabNavigator(  
  {  
    Home: { screen: Home,  
          navigationOptions:{  
              tabBarLabel:'Accueil',  
              tabBarIcon: ({ tintColor }) => (  
                  <View>  
                      <Icon style={[{color: tintColor}]} size={27} name={'ios-home'}/>  
                  </View>),  
          }  
      },
      Profile: { screen: Profile,  
          navigationOptions:{  
              tabBarLabel:'Profile',  
              tabBarIcon: ({ tintColor }) => (  
                  <View>  
                      <Icon style={[{color: tintColor}]} size={27} name={'ios-person'}/>  
                  </View>),  
              activeColor: '#FFFFFF',  
              inactiveColor: '#87CBFB',  
              barStyle: { backgroundColor: '#0061A6' },  
          }  
      },
      Recherche: { screen: Recherche,  
        navigationOptions:{  
            tabBarLabel:'',  
            tabBarIcon: ({ tintColor }) => (  
                <View>  
                    <Icon style={[{color: tintColor}]} size={27} name={'ios-search'}/>  
                </View>),  
            activeColor: '#FFFFFF',  
            inactiveColor: '#87CBFB',  
            barStyle: { backgroundColor: '#0061A6' },  
        }  
    } 
    
  },  
  {  
    initialRouteName: "Home",  
    activeColor: '#FFFFFF',  
    inactiveColor: '#87CBFB',  
    barStyle: { backgroundColor: '#0061A6' },  
  },  
);

export default createAppContainer(TabNavigator);

