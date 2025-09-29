// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');


firebase.initializeApp({
  apiKey: "AIzaSyAB1oTODC70k4ag6EX7phn9kQir6OrMY_M",
  authDomain: "sarkari-result-4b489.firebaseapp.com",
  projectId: "sarkari-result-4b489",
  storageBucket: "sarkari-result-4b489.appspot.com",
  messagingSenderId: "57541469785",
  appId: "1:57541469785:web:4936d8a484e79bd9167348",
});

const messaging = firebase.messaging();

// Optional: handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
});
