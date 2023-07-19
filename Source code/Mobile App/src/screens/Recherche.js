import React, { Component } from "react";
import { ActivityIndicator, FlatList, Text, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';


export default class Recherche extends React.Component { 
  
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      text: '',
      data: [],
      arrayholder: [],
    }
  }

    componentDidMount() { 
      let ref = firebase.database().ref('/compteurs').on("value", (snapshot)=>{
        const data = []
        //console.log(this.state.data)
        snapshot.forEach(elem => {
          //console.log(elem)
          data.push(elem.toJSON())
        })
        this.setState({isLoading: false, data, arrayholder: data});
        //console.log(this.state.data);
      })
    }

// La fonction de recherche : 
    searchData(text) {
      //console.log(text);
      var newData = this.state.data.filter(item => {
        const itemData = item.refCompteur;
        //console.log(itemData);
        const textData = text;
        //console.log(textData)
        return itemData.indexOf(textData) > -1
      });
      if(text.length == 0 || newData.length == 0){
        newData = this.state.arrayholder
      }
      this.setState({
        ...this.state,
        data: newData,
        text: text
      })
    }
     
    itemSeparator = () => {
      return (
        <View
          style={{
            height: .5,
            width: "100%",
            backgroundColor: "#000",
          }}
        />
      );
    }  
      
      render() {
        
        if (this.state.isLoading) {
          return (
            <View>
              <View style={styles.header}>
                <Text style={styles.textHeader}>Recherche</Text>
              </View>
              <View style={{flex: 1, paddingTop: 290}}>
                <ActivityIndicator />
              </View>
            </View>
          );
        }else{
          return (
          <View>
            <View style={styles.header}>
              <Text style={styles.textHeader}>Recherche</Text>
            </View>
  
            <View style={styles.MainContainer}>
              
              <TextInput 
              style={styles.textInput}
              onChangeText={(text) => this.searchData(text)}
              value={this.state.text}
              underlineColorAndroid='transparent'
              placeholder="Réf compteur..."
              keyboardType="numeric" 
              />
  
              <FlatList
                data={this.state.data}
                keyExtractor={ (item, index) => index.toString() }
                ItemSeparatorComponent={this.itemSeparator}
                renderItem={({ item }) => { 
                  return (
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('DetailsCompteur',
                                                  {
                                                  ref:item.refCompteur,
                                                  type:item.typeCompteur,
                                                  emplacement:item.emplacement,
                                                  indexVal:item.index.valeur,
                                                  indexDate:item.index.date,
                                                  posLatitude:item.positionGeo.latitude,
                                                  posLongitude:item.positionGeo.longitude,
                                                  nameCli:item.client.nomPrenom,
                                                  telCli:item.client.tel,
                                                  mailCli:item.client.mail,
                                                  valReq:item.remarque.valeur,
                                                  dateReq:item.remarque.date,
                                                  }
                                                  )}
                  >  
                    <Text style={styles.row} >                         
                      # {item.refCompteur} 
                    </Text>
                  </TouchableOpacity>
                  )
                }}
                style={{ marginTop: 10 }} 
              />
              
            </View>
  
          </View>
        );
      }
    }
  }
   
  const styles = StyleSheet.create({
   
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
    },
    MainContainer: {
      justifyContent: 'center',
      margin: 15,
      marginTop:25
    },
    row: {
      fontSize: 18,
      padding: 12
    },
    textInput: {
      textAlign: 'center',
      height: 42,
      borderWidth: 2.5,
      borderColor: 'rgba(0,97,166,1)',
      borderRadius: 8,
      backgroundColor: "#FFFF"
   
    }
  });




