
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAkzdGIKjxkNPGSEDVmOuq6omiRsjW7kKM",
    authDomain: "trains-6213d.firebaseapp.com",
    databaseURL: "https://trains-6213d.firebaseio.com",
    projectId: "trains-6213d",
    storageBucket: "trains-6213d.appspot.com",
    messagingSenderId: "710821111221"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  //var tbody 
  var trainName = [];
  var trainDes = [];
  var trainTime = [];
  var freMin = [];

  var hold;
  var finish;
  var minTill;
  var nextTrain

  database.ref().on("value", function(snapshot){
     $("#tbody").empty();

     if(snapshot.child("name").exists() && snapshot.child("destination").exists() && snapshot.child("time").exists() && snapshot.child("frequency").exists()){
      trainName = snapshot.val().name;
      trainDes = snapshot.val().destination;
      trainTime = snapshot.val().time;
      freMin = snapshot.val().frequency;

      for (var i = 0; i < trainDes.length; i++){
        hold = moment(trainTime[i], "HH:mm");
        finish = hold.diff(moment(), "minutes");
        finish = Math.abs(finish);
        minTill = freMin[i] - (finish % freMin[i]);
        nextTrain = moment().add(minTill, "minutes").format("HH:mm");

        $("#tbody").append("<tr><td>"+ trainName[i] + "</td><td>" + trainDes[i] + "</td><td>" + freMin[i] + "</td><td>" + nextTrain + "</td><td>" + minTill + "</td></tr>");
      }

     }

  });

  $("#submit").on("click", function(event){
    event.preventDefault();

    trainName.push($("#trainName").val().trim());
    trainDes.push($("#trainDes").val().trim());
    trainTime.push($("#trainTime").val().trim());
    freMin.push($("#freMin").val().trim());

    /*console.log(trainName);
    console.log(trainDes);
    console.log(trainTime);
    console.log(freMin);*/

    database.ref().set({

      name: trainName,
      destination: trainDes,
      time: trainTime,
      frequency: freMin
    });

      $("#trainName").empty();
      $("#trainDes").empty();
      $("#trainTime").empty();
      $("#freMin").empty();

  })