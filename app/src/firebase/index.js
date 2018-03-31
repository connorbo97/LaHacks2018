import * as firebase from 'firebase';

const config = {
	apiKey: "AIzaSyBFItnyIx_Ffgvtgok2GyrML_YhT-B56M4",
	authDomain: "patientmanager-a768f.firebaseapp.com",
	databaseURL: "https://patientmanager-a768f.firebaseio.com",
	projectId: "patientmanager-a768f",
	storageBucket: "patientmanager-a768f.appspot.com",
	messagingSenderId: "94098589647"
};
 
firebase.initializeApp(config);


// Using a popup.


const auth = firebase.auth()

const signInWithGoogle = () => {
	var provider = new firebase.auth.GoogleAuthProvider();
	provider.addScope('profile');
	provider.addScope('email');
	firebase.auth().signInWithPopup(provider).then(function(result) {
	 // This gives you a Google Access Token.
	 var token = result.credential.accessToken;
	 // The signed-in user info.
	 var user = result.user;
	});
}

const signOut = () => {
	auth.signOut()
}

const database = firebase.database()


export default {
  database,
  auth,
  signInWithGoogle,
  signOut,
};
