import * as admin from 'firebase-admin';

export const firebaseInitializeApp = (serviceAccountPath) => {
  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
};
