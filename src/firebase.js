import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyAU4mXFtp3pG1GTlAdv8w7eDqpgvotJQXA',
  authDomain: 'vue-course-db-9d875.firebaseapp.com',
  databaseURL:
    'https://vue-course-db-9d875-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'vue-course-db-9d875',
  storageBucket: 'vue-course-db-9d875.firebasestorage.app',
  messagingSenderId: '517766008899',
  appId: '1:517766008899:web:40188f548e8a39161184f6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };
