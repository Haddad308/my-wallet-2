-- Firebase Firestore Security Rules
-- Copy these rules to your Firebase Console > Firestore Database > Rules

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read and write access to savings-entries collection
    match /savings-entries/{document} {
      allow read, write: if true;
    }
  }
}
