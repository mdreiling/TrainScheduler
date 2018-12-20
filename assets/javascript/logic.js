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
// database.ref().on("value", function(snapshot) {
    // console.log(database);
// });

// Function to pull data from database and write it into html.
function datapull() {

    database.ref().on("child_added", function(childSnapshot) {

        // Console logging database values.
        // console.log(childSnapshot.val().newTrainNameDB);
        // console.log(childSnapshot.val().newTrainDestinationDB);
        // console.log(childSnapshot.val().newTrainFirstDB);
        // console.log(childSnapshot.val().newTrainFrequencyDB);

        // timeRemaining();
        
        //Time Remaining calculation. 
        var tFrequency = childSnapshot.val().newTrainFrequencyDB;
        var firstTime = childSnapshot.val().newTrainFirstDB;
        // console.log(childSnapshot.val().newTrainNameDB + ": First Train: " + firstTime + " | Frequency " + tFrequency);

        // Converting given time to workable variable
        var firstTimeConverted = moment(firstTime, "HHmm").subtract(1, "days");
        // console.log("Converted time: " + firstTimeConverted);

        // Difference between the times.
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes")
        // console.log("Difference in Time: " + diffTime);

        // Time apart (remainder).
        var tRemainder = diffTime % tFrequency;
        
        // Minutes until next train.
        var tMinutesTillTrain = tFrequency - tRemainder;


        // Creating a new row and appending new values to the row.
        var newRow = $("<tr>");
        newRow.append("<td>" + childSnapshot.val().newTrainNameDB + "</td>");
        newRow.append("<td>" + childSnapshot.val().newTrainDestinationDB + "</td>");
        
        // Arriving/Boarding/Departing/Time Logic
        if (tMinutesTillTrain < 1) {
            newRow.append("<td>DEPARTING</td>");
        }

        else if (tMinutesTillTrain < 3) {
            newRow.append("<td>BOARDING</td>");
        }

        else if (tMinutesTillTrain < 5) {
            newRow.append("<td>ARRIVING</td>");
        }
        
        else {
            newRow.append("<td>" + tMinutesTillTrain + " minutes</td>");
        }

        // console.log(newRow);
        $("tbody").append(newRow);
    }); 

    runClock();

};

// Function to calculate time remaining.
function timeRemaining() {
    
    // Declaring Frequency and First time for each train.
    // var tFrequency = this.childSnapshot.val().newTrainFrequencyDB;
    // var firstTime = this.childSnapshot.val().newTrainFirstDB;
    // console.log("First Train: " + firstTime + " | Frequency" + tFrequency);
};

function runClock() {
    var currentTime = moment();
    // console.log("Current Time: " + moment(currentTime).format("HH:mm"));
    $("#currentTime").html(moment(currentTime).format("HH:mm"));
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
        // console.log(newTrainName, newTrainDestination, newTrainFirst, newTrainFrequency);
        // console.log("Button Pressed")

        // Pushing new inputs to database.
        database.ref().push( {
            newTrainNameDB: newTrainName,
            newTrainDestinationDB: newTrainDestination,
            newTrainFirstDB: newTrainFirst,
            newTrainFrequencyDB: newTrainFrequency
        });

        $(".form-control").val("");

    });

    datapull();
    setInterval(runClock(), 1000);

});
