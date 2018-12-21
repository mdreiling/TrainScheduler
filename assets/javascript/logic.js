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

// Setting empty trains array.
var trainsArray = [];
var trainNumber = 1;

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

        // Pushing new train values into the array.
        trainsArray.push({
            TrainName: childSnapshot.val().newTrainNameDB,
            TrainDestination: childSnapshot.val().newTrainDestinationDB,
            TrainFirst: childSnapshot.val().newTrainFirstDB,
            TrainFrequency: childSnapshot.val().newTrainFrequencyDB,
            TrainNumber: trainNumber
        });
        
        // Logging addition of each train the the console.
        // console.log(trainsArray);

        // Increasing Train Number
        trainNumber++;

        // Call time remaining, sort array, and build table functions.
        timeRemaining();
        sortArray();
        buildTable();

    }); 

};

// Function to calculate time remaining.
function timeRemaining() {
    
    let j = trainNumber - 2;
    // console.log(trainsArray[j]);

    //Time Remaining calculation. 
    // console.log("Train Array Position Output: " + (trainNumber - 2));
    var tFrequency = parseInt(trainsArray[j].TrainFrequency);
    var firstTime = trainsArray[j].TrainFirst;
    // console.log(trainsArray[j].TrainName + ": First Train: " + firstTime + " | Frequency " + tFrequency);

    // Converting given time to workable variable
    var firstTimeConverted = moment(firstTime, "HHmm").subtract(1, "days");
    // console.log("Converted time: " + firstTimeConverted);

    // Difference between the times.
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes")
    // console.log("Difference in Time: " + diffTime);

    // Time apart (remainder).
    var tRemainder = diffTime % tFrequency;
    
    // Minutes until next train.
    tMinutesTillTrain = tFrequency - tRemainder;
    trainsArray[j].TrainTimeRemaining = tMinutesTillTrain;
    // console.log("Time Remaining until " + trainsArray[j].TrainName + " arrives: " + tMinutesTillTrain);
    // console.log(trainsArray);
    
};

// Function to take current time and push it into current time span.
function runClock() {
    var currentTime = moment();
    // console.log("Current Time: " + moment(currentTime).format("HH:mm"));
    $("#currentTime").html(moment(currentTime).format("HH:mm"));
};

// Function to sort table by time remaining.
function sortArray() {
    
    trainsArray.sort(function(a, b) {return a.TrainTimeRemaining - b.TrainTimeRemaining});
    console.log(trainsArray);
};

function buildTable() {

    // Clear existing table.
    $("tbody").empty();   

    // For loop to build table from Array.
    for (k = 0; k < trainsArray.length; k++) {
        
        // Creating a new row and appending new values to the row.
        var newRow = $("<tr>");
        newRow.append("<td>" + trainsArray[k].TrainName + "</td>");
        newRow.append("<td>" + trainsArray[k].TrainDestination + "</td>");

        // Arriving/Boarding/Departing/Time Logic
        if (trainsArray[k].TrainTimeRemaining < 1) {
            newRow.append("<td>DEPARTING</td>");
        }

        else if (trainsArray[k].TrainTimeRemaining < 3) {
            newRow.append("<td>BOARDING</td>");
        }

        else if (trainsArray[k].TrainTimeRemaining < 5) {
            newRow.append("<td>ARRIVING</td>");
        }

        else {
            newRow.append("<td>" + trainsArray[k].TrainTimeRemaining + "</td>");
        }

        // console.log(newRow);
        $("tbody").append(newRow);

    }
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
    setInterval(runClock(), 60000);

});
