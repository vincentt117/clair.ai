import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyA2iygQorD0v4RYqzPUrdP6uG2SkJlC-Tw",
    authDomain: "qhacks-2019-230505.firebaseapp.com",
    databaseURL: "https://qhacks-2019-230505.firebaseio.com",
    projectId: "qhacks-2019-230505",
    storageBucket: "qhacks-2019-230505.appspot.com",
    messagingSenderId: "232993552839"
};

firebase.initializeApp(config);
export default firebase;