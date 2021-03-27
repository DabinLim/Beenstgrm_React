import firebase from'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBKQjuDrZVFWzU0yOHSYzi23Uf-knfYmeM",
    authDomain: "dab-react.firebaseapp.com",
    projectId: "dab-react",
    storageBucket: "dab-react.appspot.com",
    messagingSenderId: "995188651938",
    appId: "1:995188651938:web:64a1d45189bb7da68864fb",
    measurementId: "G-02QJZ47J0D"
};

firebase.initializeApp(firebaseConfig);

const apiKey = firebaseConfig.apiKey;

// firebase 의 인증기능 사용준비
const auth = firebase.auth();

// firebase 의 firestore 사용 준비
const firestore = firebase.firestore();

export {auth, apiKey, firestore};