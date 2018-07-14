function getdata(){
  var db = firebase.database().ref('/climate');

  db.orderByChild('published_at').startAt(Date.now()).on('child_added', function(snapshot) {
    console.log('new record', snapshot.val().data);
    document.getElementById("data").innerHTML = snapshot.val().data;
  });
}
getdata()
console.log("asdflasjdhfl");