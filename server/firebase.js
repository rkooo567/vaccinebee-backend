const firebase = require('firebase-admin');
// let firebase = require('firebase');

const config = {
  apiKey: "AIzaSyCvflj1x4TegewTQwifv05Pb0ZwFilthjI",
  authDomain: "vacspider-50da9.firebaseapp.com",
  credential: {
    getAccessToken: () => ({
      expires_in: 0,
      access_token: '',
    }),
  },
  databaseURL: "https://vacspider-50da9.firebaseio.com",
  projectId: "vacspider-50da9",
  storageBucket: "",
  messagingSenderId: "848395502335"
};

firebase.initializeApp(config);
const database = firebase.database();

module.exports = {
  get: (collection, callback) => {
    const reference = database.ref(collection);
    reference.once('value', (data) => {
      callback(null, data.val());
    }, (error) => {
      callback(error, null);
    });
  },
  create: (collection, payload, callback) => {
    const reference = database.ref(collection);
    reference.push(payload);
    reference.once('value', (data) => {
      callback(null, data.val());
    }, (error) => {
      callback(error, null);
    });
  },
  delete: (collection, key, callback) => {
    const reference = database.ref(collection);
    reference.remove(key);
    reference.once('value', (data) => {
      callback(null, data.val());
    }, (error) => {
      callback(error, null);
    });
  },
  update: (collection, key, payload, callback) => {
    const reference = database.ref(collection);
    reference.child(key).set(payload);
    reference.once('value', (data) => {
      callback(null, data.val());
    }, (error) => {
      callback(error, null);
    });
  }
}

