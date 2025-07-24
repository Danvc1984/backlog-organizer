// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZ7E0k42CQ7OPK4ykgyEhOGDQ34zVciy4",
  authDomain: "backlog-organizer-react.firebaseapp.com",
  projectId: "backlog-organizer-react",
  storageBucket: "backlog-organizer-react.firebasestorage.app",
  messagingSenderId: "829522742590",
  appId: "1:829522742590:web:6a857ef38fb8efe415b06f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };
