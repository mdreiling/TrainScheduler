// Variables ==================================================

// Setting up link to Firebase.
var config = {
    apiKey: "AIzaSyCPnmgcmvrbX-WlarP-_6nMCxERMAGco-k",
    authDomain: "train-timetables-md13.firebaseapp.com",
    databaseURL: "https://train-timetables-md13.firebaseio.com",
    projectId: "train-timetables-md13",
    storageBucket: "train-timetables-md13.appspot.com",
    messagingSenderId: "873966298091"
  };

firebase.initializeApp(config);

// Setting firebase database to the database variable.
var database = firebase.database();


// Functions ==================================================

// Placeholder function to log what is on the database.
database.ref().on("value", function(snapshot) {
    console.log(database);
});

// Function to pull data from database and write it into html.
function datapull() {

    database.ref().on("child_added", function(childSnapshot) {

        // Console logging database values.
        console.log(childSnapshot.val().newTrainNameDB);
        console.log(childSnapshot.val().newTrainDestinationDB);
        console.log(childSnapshot.val().newTrainFirstDB);
        console.log(childSnapshot.val().newTrainFrequencyDB);

        timeRemaining();

        var newRow = $("<tr>");
        newRow.append("<td>" + childSnapshot.val().newTrainNameDB + "</td>");
        newRow.append("<td>" + childSnapshot.val().newTrainDestinationDB + "</td>");
        newRow.append("<td>" + childSnapshot.val().newTrainFrequencyDB + "</td>");

        console.log(newRow);
        $("tbody").append(newRow);
    }); 

};

// Function to calculate time remaining.
function timeRemaining() {

};


// Page Functions ==================================================

$(document).ready(function() {
    
    // Click listener for Add New Train Button.
    $(document).on("click", "#addNewTrain", function() {

        event.preventDefault();

        // Setting new inputs as variables.
        var newTrainName = $("#newTrainName").val().trim();
        var newTrainDestination = $("#newTrainDestination").val().trim();
        var newTrainFirst = $("#newTrainFirst").val().trim();
        var newTrainFrequency = $("#newTrainFrequency").val().trim();

        // Console logging new inputs.
        console.log(newTrainName, newTrainDestination, newTrainFirst, newTrainFrequency);
        console.log("Button Pressed")

        // Pushing new inputs to database.
        database.ref().push( {
            newTrainNameDB: newTrainName,
            newTrainDestinationDB: newTrainDestination,
            newTrainFirstDB: newTrainFirst,
            newTrainFrequencyDB: newTrainFrequency
        });

    });

    datapull();

});
