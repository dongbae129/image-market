// Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// import { getStorage } from 'firebase/storage';
import { cert, initializeApp } from 'firebase-admin/app';

import { getStorage } from 'firebase-admin/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const serviceAccount = require('../../public/jsons/image-market-f1cd8-firebase-adminsdk-lfx94-04238d8822.json');

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBsKQZ2QKJBDIvfrw-Q8Paa06xr-UXl7d8',
  authDomain: 'image-market-f1cd8.firebaseapp.com',
  projectId: 'image-market-f1cd8',
  storageBucket: 'image-market-f1cd8.firebasestorage.app',
  messagingSenderId: '883953189810',
  appId: '1:883953189810:web:fe61726b97c418b1989aab',
  measurementId: 'G-8T9X2ZLR6J',
  credential: cert(serviceAccount)
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);
