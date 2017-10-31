 // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBaSQnTDSw5lBSEttOIWKzI3I4g1wjlHz0",
        authDomain: "thehungryspectator.firebaseapp.com",
        databaseURL: "https://thehungryspectator.firebaseio.com",
        projectId: "thehungryspectator",
        storageBucket: "thehungryspectator.appspot.com",
        messagingSenderId: "95566664488"
    };
    firebase.initializeApp(config);
    //a variable to referance the database
    var database = firebase.database();
    //variables from form
    var name = "";
    var address = "";
    var phone = "";
    var email = "";

     //  Button for adding data
    $("#submit").on("click", function(event) {
        event.preventDefault();
        name = $("#name").val();
        address = $("#address").val();
        phone = $("#phone").val();
        email = $("#email").val();

        // Clears all of the text-boxes
        $("#name").val("");
        $("#address").val("");
        $("#phone").val("");
        $("#email").val("");
        //pushes to database
        database.ref().push({
            name: name,
            address: address,
            phone: phone,
            email: email
       });
    });