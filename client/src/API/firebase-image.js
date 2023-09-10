import React, { useEffect } from 'react'
import firebase from 'firebase/app';
import 'firebase/storage';


const config = {
    apiKey: "AIzaSyC3H70n36u6BM5EeUhd0UaH2vNGLg2R4Fo",
    authDomain: "uploadfile-111bd.firebaseapp.com",
    projectId: "uploadfile-111bd",
    storageBucket: "uploadfile-111bd.appspot.com",
    messagingSenderId: "28574403038",
    appId: "1:28574403038:web:f116b1fb7c2d4e979e754f"
};

firebase.initializeApp(config);
// firebase.analytics();

const storage = firebase.storage()

export {
    storage, firebase as default
}
