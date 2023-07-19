import React, { useState } from "react";
import { createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import Login from "./src/screens/Login";
import Home from "./src/screens/Home";
import Loading from "./src/components/Loading";
import Relever from "./src/screens/Relever";
import DetailsCompteur from "./src/screens/DetailsCompteur";
import Position from "./src/screens/Position";
import Reclamation from "./src/screens/Reclamation";
import MajPosition from "./src/screens/MajPosition";
import ModifierProfile from "./src/screens/ModifierProfile";
import ReleverDetecter from "./src/screens/ReleverDetecter";
import ReclamationDetecter from "./src/screens/ReclamationDetecter";
import DetectionRelevement from "./src/screens/DetectionRelevement";
import DetectionReclamation from "./src/screens/DetectionReclamation";
import * as firebase from 'firebase';



//************************************* FireBase connection ***********************************************
    const firebaseConfig = {
      apiKey: "**************",
      authDomain: "**************",
      databaseURL: "**************",
      projectId: "steg-e21f5",
      storageBucket: "**************",
      messagingSenderId: "**************",
      appId: "**************",
      measurementId: "**************"
    };
    //Initialize Firebase
    if(!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
    }
    
    

//********************************** Screens navigation ******************************************* 

      // Pile d'authentification :
const AuthStack = createDrawerNavigator({
	Login: {
		screen: Login,
	},
});
      // Pile screens d'app :
const AppStack = createDrawerNavigator({
	Home: {
		screen: Home,
	},
	Relever: {
		screen: Relever,
  },
  DetailsCompteur: {
		screen: DetailsCompteur,
  },
  Position: {
		screen: Position,
  },
  MajPosition: {
		screen: MajPosition,
  },
  Reclamation: {
		screen: Reclamation,
  },
  ModifierProfile: {
		screen: ModifierProfile,
  },
  ReleverDetecter: {
		screen: ReleverDetecter,
  },
  ReclamationDetecter: {
		screen: ReclamationDetecter,
  },
  DetectionRelevement: {
		screen: DetectionRelevement,
  },
  DetectionReclamation: {
		screen: DetectionReclamation,
  },

});


const AppContainer = createAppContainer(
	createDrawerNavigator(
		{
			Loading: Loading,
			Auth: AuthStack,
      App: AppStack,
		},
		{
			initialRouteName: "Loading",
		}
	)
);


//******************************************* App() ******************************************

function App() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  if (!isLoadingComplete) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return isLoadingComplete ? <AppContainer /> : <AppLoading />;
  }
}
async function loadResourcesAsync() {
  await Promise.all([
    Font.loadAsync({
      "roboto-regular": require("./src/assets/fonts/roboto-regular.ttf"),
      "roboto-700": require("./src/assets/fonts/roboto-700.ttf"),
      "calibri-regular": require("./src/assets/fonts/calibri-regular.ttf")
    })
  ]);
}
function handleLoadingError(error) {
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

export default App;

