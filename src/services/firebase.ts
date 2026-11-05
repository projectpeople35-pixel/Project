import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  Auth
} from 'firebase/auth';
import {
  getDatabase,
  ref,
  onValue,
  set,
  update,
  Database
} from 'firebase/database';
import { DeviceControls, SensorReadings, PlantProfile, AgroAlert, DeviceStatus } from '../types';

// Retrieve config from Vite environment variables or defaults
export const getFirebaseConfig = () => {
  return {
    apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || "AIzaSyAgroSmartDemoFakeKeyOnly12345678",
    authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || "agrosmart-iot-app.firebaseapp.com",
    databaseURL: (import.meta as any).env?.VITE_FIREBASE_DATABASE_URL || "https://agrosmart-iot-default-rtdb.firebaseio.com",
    projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || "agrosmart-iot-app",
    storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || "agrosmart-iot-app.appspot.com",
    messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "987654321098",
    appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || "1:987654321098:web:77aa88bb99cc"
  };
};

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Database | null = null;
let isRealFirebaseAvailable = false;

try {
  const cfg = getFirebaseConfig();
  // Check if real API key configured
  if (cfg.apiKey && !cfg.apiKey.includes('FakeKey')) {
    app = getApps().length > 0 ? getApp() : initializeApp(cfg);
    authInstance = getAuth(app);
    dbInstance = getDatabase(app);
    isRealFirebaseAvailable = true;
  }
} catch (e) {
  console.warn("Real Firebase initialization deferred, running demo/local mode:", e);
}

export const auth = authInstance;
export const rtdb = dbInstance;
export const hasLiveFirebaseConfig = isRealFirebaseAvailable;

// Hardware command dispatcher to Firebase
export const sendIrrigationCommand = async (
  userId: string,
  deviceId: string,
  updates: Partial<DeviceControls>
) => {
  if (rtdb && isRealFirebaseAvailable) {
    const controlsRef = ref(rtdb, `users/${userId}/devices/${deviceId}/controls`);
    await update(controlsRef, {
      ...updates,
      lastCommandTimestamp: Date.now()
    });
  }
};

export const triggerEmergencyStop = async (userId: string, deviceId: string) => {
  if (rtdb && isRealFirebaseAvailable) {
    const controlsRef = ref(rtdb, `users/${userId}/devices/${deviceId}/controls`);
    await update(controlsRef, {
      pumpRequested: false,
      pumpActual: false,
      emergencyStop: true,
      lastCommandTimestamp: Date.now()
    });
  }
};

export const savePlantToDb = async (userId: string, plant: PlantProfile) => {
  if (rtdb && isRealFirebaseAvailable) {
    const plantRef = ref(rtdb, `users/${userId}/plants/${plant.id}`);
    await set(plantRef, plant);
  }
};

export const deletePlantFromDb = async (userId: string, plantId: string) => {
  if (rtdb && isRealFirebaseAvailable) {
    const plantRef = ref(rtdb, `users/${userId}/plants/${plantId}`);
    await set(plantRef, null);
  }
};
