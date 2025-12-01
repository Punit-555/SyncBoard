import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Note: Make sure you have your Firebase service account JSON file
// Download it from: Firebase Console > Project Settings > Service Accounts
// Save it as 'firebase-service-account.json' in the root of your server folder

let firebase_initialized = false;

try {
  const serviceAccountPath = path.join(process.cwd(), 'firebase-service-account.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, 'utf8')
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    firebase_initialized = true;
    console.log('Firebase Admin SDK initialized successfully');
  } else {
    console.warn('Firebase service account file not found. Firebase auth will be disabled.');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error.message);
  console.warn('Firebase auth will be disabled.');
}

export const verifyFirebaseToken = async (token) => {
  if (!firebase_initialized) {
    throw new Error('Firebase not initialized');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error(`Firebase token verification failed: ${error.message}`);
  }
};

export const getFirebaseAuth = () => {
  return firebase_initialized ? admin : null;
};

export default admin;
