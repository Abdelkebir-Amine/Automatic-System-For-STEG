import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import * as firebase from 'firebase';

export default class Loading extends React.Component {
    componentDidMount () {
      firebase.auth().onAuthStateChanged (user => this.props.navigation.navigate(user ? "App":"Auth"));
    }
  render() {
    return (
        <View style={styles.container}>
          <Text style={{color:'#827E7F', fontSize: 40}}>Chargement...</Text>
          <ActivityIndicator color='#827E7F' size="large" />
        </View>
    )
  }
}


//******************************************* Styles CSS ***********************************************

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})