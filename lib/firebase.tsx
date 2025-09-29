// utils/firebase.ts
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAB1oTODC70k4ag6EX7phn9kQir6OrMY_M",
  authDomain: "sarkari-result-4b489.firebaseapp.com",
  projectId: "sarkari-result-4b489",
  storageBucket: "sarkari-result-4b489.appspot.com",
  messagingSenderId: "57541469785",
  appId: "1:57541469785:web:4936d8a484e79bd9167348",
};

const app = initializeApp(firebaseConfig);
const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

export const requestPermission = async (): Promise<string | null> => {
  if (!messaging) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  try {
    const token = await getToken(messaging, {
      vapidKey: "BDugi6LhwOOaKLYk3m9XVE8lZm6RwgEIXfmt7blj7ZpO8UMjq2im6BPoTpFgsIvSyEUS1vgf3rDdXbUzXdJPRD4",
      serviceWorkerRegistration: await navigator.serviceWorker.register('/firebase-messaging-sw.js'),
    });
    return token || null;
  } catch (err) {
    console.error("FCM getToken error:", err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => resolve(payload));
  });
