$(document).ready(function(){
    
    /* Function to get user IP address */
    /* Help to find current location */
    $.get("http://ipinfo.io", function(response) {
        //alert(response.ip);
    }, "jsonp");


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


console.log(name)
//pushes to database
  database.ref().push({

	    name: name,
	    address: address,
	    phone: phone,
	    email: email

	});
});


    $(".container").on("click",".btn-sports", function(){
        var sportName = $(this).attr("data-name");
        var url = "https://api.seatgeek.com/2/events?q=" + sportName + "&client_id=OTM3ODIzNHwxNTA4ODAxNzUyLjY0";
        $.ajax({
            url: url,
            type: 'GET',
        })
        .done(function(response) {
            console.log(response);
            // console.log(response);
            $(".primary-content").html('');
            for(var i=0; i<response.events.length; i++ ){
                var card = $("<div class='card'></div>");
                var cardHeader = $("<div class='card-header' style='background-color:#8bd6ba; color: white;'></div>");
                var cardBody = $("<div class='card-body' style='background-color:#d3d3d3'></div>");
                var row = $("<div class='row'></div>");


                var innerRow = $("<div class='row'></div>");

                var imageColumn = $("<div class='col-md-3'></div>");
                var img = $("<img width='100px' height='100px' src='" + response.events[i].performers[0].image + "'>");
                var contentColumn = $("<div class='col-md-9'></div>");

                cardHeader.html(response.events[i].title);
                imageColumn.append(img);
                contentColumn.html(response.events[i].venue.address);
                contentColumn.html(response.events[i].venue.display_location);

                innerRow.append(imageColumn);
                innerRow.append(contentColumn);

                cardBody.append(innerRow);

                card.append(cardHeader);
                card.append(cardBody);

                $(".primary-content").append(card);
            }
        });
    });
});