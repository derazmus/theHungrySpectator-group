$(document).ready(function(){
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
        name = $("#name").val().trim();
        address = $("#address").val().trim();
        phone = $("#phone").val().trim();
        email = $("#email").val().trim();

        if(name !== '' && email !== ''){
           //pushes to database
            database.ref().push({
                name: name,
                address: address,
                phone: phone,
                email: email
            });
        }
        else{
            if(name === '')
                $("#name").css("border", "1px solid red");
            if(email === '')
                $("#email").css("border", "1px solid red");
        }
        // Clears all of the text-boxes
        $("#name").val("");
        $("#address").val("");
        $("#phone").val("");
        $("#email").val("");
    });
    $("#name").on("focus", function(){
        $("#name").css("border", "none");
    });
    $("#email").on("focus", function(){
        $("#email").css("border", "none");
    });
});