"use client";
import { useState, useEffect } from "react";
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

export default function NotificationModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const allowed = localStorage.getItem("notificationsAllowed");
    if (!allowed) setShowModal(true);
  }, []);

  const handleAllow = async () => {
const timeout = setTimeout(() => {
  setShowModal(false);
}, 1000);
    if (!messaging) return;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;
console.log(permission);

try {
  // 1. Register service worker
  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
  console.log("Service Worker registered:", registration);

  // 2. Wait for it to be active
  const swRegistration = await navigator.serviceWorker.ready;

  // 3. Now call getToken
  const token = await getToken(messaging, {
    vapidKey: "BDugi6LhwOOaKLYk3m9XVE8lZm6RwgEIXfmt7blj7ZpO8UMjq2im6BPoTpFgsIvSyEUS1vgf3rDdXbUzXdJPRD4",
    serviceWorkerRegistration: swRegistration,
  });

  console.log("FCM Token:", token);

  if (token) {
    localStorage.setItem("notificationsAllowed", "true");
  } else {
    console.warn("No FCM token retrieved. Permission might be denied.");
  }
} catch (err) {
  console.error("FCM getToken error:", err);
} finally {
  clearTimeout(timeout);
  setShowModal(false);
}

  };

  const handleReject = () => setShowModal(false);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/30 " />
      <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center gap-5 w-80 animate-fade-in-down">
        <h2 className="text-lg font-semibold">Enable Notifications?</h2>
        <p className="text-sm text-gray-600 text-center">
          Get notified about the latest jobs immediately.
        </p>
        <div className="flex w-full gap-4">
          <button
            onClick={handleAllow}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Allow
          </button>
          <button
            onClick={handleReject}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Reject
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
