import firebase from 'firebase';
const firebaseConfig = {
	
    apiKey: "AIzaSyAPzrcNSKTnhGZRBI4GZWVQaQU1zal7DQ8",
  
    authDomain: "himmr-image-storage.firebaseapp.com",
  
    projectId: "himmr-image-storage",
  
    storageBucket: "himmr-image-storage.appspot.com",
  
    messagingSenderId: "419777087034",
  
    appId: "1:419777087034:web:947b23e2fb548d52f9d703"
};
firebase.initializeApp(firebaseConfig);
var storage = firebase.storage();
export default storage;