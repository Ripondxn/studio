
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();

const email = 'super.admin@propvue.com';
const password = '123456';

auth.createUser({
  email: email,
  password: password,
})
.then((userRecord) => {
  console.log('Successfully created new user:', userRecord.uid);
})
.catch((error) => {
  console.log('Error creating new user:', error);
});
