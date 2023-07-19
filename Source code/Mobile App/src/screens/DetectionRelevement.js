import * as React from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';



export default class DetectionRelevement extends React.Component {

  state = {
    hasCameraPermission: null,
    scanned: false,
    code :"",
    msgRetour:"Mettre le code à barre au centre de détecteur",
    colorMsgRetour:"#000000"
  };

// Les fonctions de PERMISSIONS CAMERA : 
  async componentDidMount() {
    this.getPermissionsAsync();
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

// Les fonctions de Detection :
  handleBarCodeScanned = ({ data }) => {
    this.setState({ scanned: true });
    this.setState({ code: data });
    Alert.alert(`Numéro de compteur bien détecté  *** # ${data} ***`);
  };

// Fonction de controle :
validerChamps = () => {
  const {code} = this.state

  if (code == ""){

    this.setState({ msgRetour:"Scanner le code à barre de compteur"})
    this.setState({ colorMsgRetour: "red" })
    return false           
  }else{
    this.setState({ msgRetour: "Mettre le code à barre au centre de détecteur" });
    this.setState({ colorMsgRetour: "#000000" })
    return true
  }
  
}

  toReleverDetecter() {
    if( this.validerChamps() ) {
        this.props.navigation.navigate('ReleverDetecter',{code:this.state.code});
        this.setState({ scanned:false});
        this.setState({ code:""});
    }  
  };

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return  <Text style={{alignSelf: "center", fontSize:25, marginTop:250 }}> 
                Préparation de détecteur... 
              </Text>;
    }
    if (hasCameraPermission === false) {
      return <Text> Camera non autorisée </Text>;
    }
    return (
      <View
        style={{
          flex: 1,
          //flexDirection: 'column',
          justifyContent: 'flex-end',
          alignSelf: "center",
          width:295,
          marginTop:-135
        }}>

        <Text style={{marginBottom:100, color:this.state.colorMsgRetour, width:290, marginLeft:10,}}> 
            {this.state.msgRetour} 
        </Text> 

        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {scanned && (
        <View style={styles.viewRenitialiser}>
          <TouchableOpacity onPress={() => this.setState({ scanned: false, code:"" })}  >
              <Text  style={styles.textRenitialiser}> Réinitialiser </Text>
          </TouchableOpacity>
        </View>
        )}

        <View style={styles.viewTerminer} >
            <TouchableOpacity onPress={()=> this.toReleverDetecter() }> 
                <Text style={styles.textTerminer} > Terminer </Text>
            </TouchableOpacity>
        </View>

      </View>
    );
  }

}

//******************************************* Les styles CSS *******************************************
    
const styles = StyleSheet.create({
    
    textRenitialiser: {
        color: "#ff0000",
        fontSize: 25,
        fontFamily: "calibri-regular",
        
    },
    textTerminer: {
        color: "rgba(255,255,255,1)",
        fontSize: 25,
        fontFamily: "calibri-regular",
        marginTop:5,
        alignSelf: "center",
    },
    viewTerminer: {
        marginTop:-90,
        borderRadius: 25,
        alignSelf: "center",
        marginBottom:70,
        backgroundColor: "rgba(0,97,166,1)",
        width:135,
        height: 47,
    },
    viewRenitialiser: {
        marginTop:30,
        alignSelf: "center",
    },
});


