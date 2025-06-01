
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAYahf_6MKX0U_LMNei2WuX38eqAWR6cVw",
  authDomain: "kira-bot-1-9-0.firebaseapp.com",
  databaseURL: "https://kira-bot-1-9-0-default-rtdb.firebaseio.com",
  projectId: "kira-bot-1-9-0",
  storageBucket: "kira-bot-1-9-0.appspot.com",
  messagingSenderId: "1053750438733",
  appId: "1:1053750438733:android:fa0b70a11451048669a504"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);
export default app;
