import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, { PROVIDER_GOOGLE, Marker, Callout} from "react-native-maps";



export default class Position extends React.Component { 
    
    state = {

      }

  render() {
    if (this.state.loading){
      return  (<View style={styles.loading}>
                <ActivityIndicator color='#827E7F' size="large" />
              </View>)
    }else{
    return (  
        <View>  
            <View style={styles.header}>
                <Text style={styles.textHeader}>Position actuelle</Text>
                <TouchableOpacity  onPress={() => this.props.navigation.goBack()} style={styles.touchIconRetour} >
                <Icon name={'md-arrow-back'} style={styles.icon}></Icon>
                </TouchableOpacity>
            </View> 
            <View style={styles.partieRef}>
                <Text style={{marginTop:10, fontSize:16, opacity: 0.60 }} > Réference compteur </Text>
                <Text style={styles.rowRef} ># {this.props.navigation.getParam('ref')} </Text>
                <View style={{height:.9, width:"100%", backgroundColor:"#000000",  }} /> 


        {/***************************** Partie Maps *************************************/}
            <View style={styles.mapViewStyle} >    
                <MapView
                    provider={PROVIDER_GOOGLE}            
                    initialRegion={{
                    latitude: this.props.navigation.getParam('latitude'),
                    longitude : this.props.navigation.getParam('longitude'),
                    latitudeDelta: 2.015,
                    longitudeDelta: 2.0121
                    }}
                    customMapStyle={[]}
                    style={styles.mapStyle}
                >
                <Marker coordinate={{latitude:this.props.navigation.getParam('latitude'),longitude:this.props.navigation.getParam('longitude')}}>
                    <Callout style ={{width:250}}>
                        <Text> 
                            Compteur : {this.props.navigation.getParam('emplacement')}.{'\n'} 
                            De M/Mme. {this.props.navigation.getParam('nameCli')}  
                        </Text>
                    </Callout>
                </Marker>  
                </MapView>
            </View>               
        </View>

        </View>  
    )
    };  
  }  
}


//******************************************* Les styles CSS ****************************************

const styles = StyleSheet.create({  
    
    mapViewStyle:{
        marginLeft:-47,
    },
    mapStyle: {
        height: 614,
        width: 360,
        marginTop:12
      },
    partieRef: {
        justifyContent: 'center',
        margin: 50,
        marginTop:-5
      },
    rowRef: {
        fontSize: 18,
        padding: 0,
        fontFamily: "roboto-regular",
        marginLeft: 10,
      },
    button: {
        borderRadius: 4,
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#ccc',
        borderColor: '#333',
        borderWidth: 1,
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
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    test: {  
        marginTop: 19,
        fontSize: 18,  
        marginLeft: 151
    },
    header: {
      //flex: 1,
      width: 360,
      height: 52,
      backgroundColor: "rgba(0,97,166,1)"
    },
    textHeader: {
      width: 138,
      height: 20,
      color: "rgba(255,255,255,1)",
      fontSize: 18,
      fontFamily: "roboto-700",
      lineHeight: 18,
      marginTop: 19,
      marginLeft: 125
    }  
}); 

