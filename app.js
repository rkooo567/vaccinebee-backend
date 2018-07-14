/*
 * Module dependencies
 */
const express = require('express')
const stylus = require('stylus')
const nib = require('nib')

const app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}
const firebase = require("firebase");

const config = {
  apiKey: "AIzaSyBuEmpNHMIzsEE64P2MTYZzDyeOYJ3HVe4",
  authDomain: "climatefox-b9ab1.firebaseapp.com",
  databaseURL: "https://climatefox-b9ab1.firebaseio.com",
  projectId: "climatefox-b9ab1",
  storageBucket: "climatefox-b9ab1.appspot.com",
  messagingSenderId: "774004597968"
};
firebase.initializeApp(config);

const database = firebase.database();

let data;
function getdata(){
  const db = firebase.database().ref('/climate');
  db.orderByChild('published_at').startAt(Date.now()).on('child_added', function(snapshot) {
    console.log('Sendor Data', snapshot.val());
    data = snapshot.val().data;
  });
  // db.on('value',function(snapshot){
  //   var test = snapshot.val();
  //   console.log(test);
  // });
}

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(stylus.middleware(
  {
    src: __dirname + '/public',
    compile: compile
  }
));

app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.render('index',
    {
      title : 'Home',
      data: require("os").hostname()
    }
  )
});

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), () => {
  console.log('Assister on port ' + app.get('port'));
});
getdata();