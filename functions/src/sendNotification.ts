// This is a simple Firebase Cloud Function to send a notification to a user.
// Deploy this to your Firebase project for real-time notification support.

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendNotification = functions.https.onCall(async (data, context) => {
  const { userId, message, type = 'info', link = '' } = data;
  if (!userId || !message) {
    throw new functions.https.HttpsError('invalid-argument', 'userId and message are required');
  }
  const notification = {
    userId,
    message,
    type,
    link,
    read: false,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  };
  await admin.firestore().collection('notifications').add(notification);
  return { success: true };
});
