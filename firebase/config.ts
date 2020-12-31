import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';
import Environment from '../env';

const firebaseConfig = {
  apiKey: Environment.apiKey,
  authDomain: Environment.authDomain,
  projectId: Environment.projectId,
  storageBucket: Environment.storageBucket,
  messagingSenderId: Environment.messagingSenderId,
  appId: Environment.appId,
  measurementId: Environment.measurementId
};

if (!firebase.default.apps.length) {
    firebase.default.initializeApp(firebaseConfig);
}

export { firebase };