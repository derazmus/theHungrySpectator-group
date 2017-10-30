
$(document).ready(function(){
    
    var lat = "";
    var lon = "";

    gioFindMe();
    function gioFindMe(){
        if(!navigator.geolocation){
            console.log('Geo location is not supported in your browser');
            return;
        }
        function success(position){
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            console.log(lat + ' ' + lon);
        }
        function error(){
            console.log('Not Supported');
        }
        navigator.geolocation.getCurrentPosition(success, error);
    }
    
    /* Function to get user IP address */
    /* Help to find current location */
    $.get("http://ipinfo.io", function(response) {
        userIP = response.ip;
        onLoadQuery = "https://api.seatgeek.com/2/events?geoip=" + userIP + "&client_id=OTM3ODIzNHwxNTA4ODAxNzUyLjY0";
        $.ajax({
            url: onLoadQuery,
            type: 'GET'
            })
            .done(function(data) {
            console.log("Query " + onLoadQuery);
            console.log("Length " + data.events.length);
            $(".page-heading").html("<h3>Popular Events Near <span class='event-heading'>" + data.meta.geolocation.display_name + "</span></h3><hr>");
            displaySeatGeekEvent(data);
        });
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

    var eventEndpoint = $(".eventEndpoint").val();
    console.log($(".eventEndpoint").val());
    
    $(".container").on("change", ".eventEndpoint", function(){
        eventEndpoint = $(".eventEndpoint").val();
        $(".eventEndpoint").css("border", "none");
    });

    $("#search-term").on("focus", function(){
        $("#search-term").css("border", "none");
    });
    

    $(".container").on("click",".btn-search-event", function(){
        event.preventDefault();
        var eventName = $("#search-term").val();
        var url = "https://api.seatgeek.com/2/";
        if(eventEndpoint !== "default" && eventName !== ''){
            url = url + eventEndpoint + "?" + "q=" + eventName + "&client_id=OTM3ODIzNHwxNTA4ODAxNzUyLjY0";
            console.log("Btn Search : " + url);
            $.ajax({
                url: url,
                type: 'GET'
            })
            .done(function(response) {
                console.log(response);
                $(".primary-content").html('');
                displaySeatGeekEvent(response, eventEndpoint);
            });
        }
        else{
            if(eventEndpoint === "default"){
                $(".eventEndpoint").css("border", "2px solid red");
            }
            if(eventName === ""){
                $("#search-term").css("border", "2px solid red");
            }
        }
    });

    $(".container").on("click",".btn-sports", function(){
        var sportName = $(this).attr("data-name");
        var url = "https://api.seatgeek.com/2/events?geoip=" + userIP + "&q=" + sportName + "&client_id=OTM3ODIzNHwxNTA4ODAxNzUyLjY0";
        console.log("Btn Search : " + url);
        $.ajax({
            url: url,
            type: 'GET'
        })
        .done(function(response) {
            console.log(response);
            $(".primary-content").html('');
            displaySeatGeekEvent(response);
            // for(var i=0; i<response.events.length; i++ ){
            //     var card = $("<div class='card'></div>");
            //     var cardHeader = $("<div class='card-header' style='background-color:#8bd6ba; color: white;'></div>");
            //     var cardBody = $("<div class='card-body' style='background-color:#d3d3d3'></div>");
            //     var row = $("<div class='row'></div>");

            //     var innerRow = $("<div class='row'></div>");

            //     var imageColumn = $("<div class='col-md-3'></div>");
            //     var img = $("<img width='100px' height='100px' src='" + response.events[i].performers[0].image + "'>");
            //     var contentColumn = $("<div class='col-md-9'></div>");

            //     cardHeader.html(response.events[i].title);
            //     imageColumn.append(img);
            //     contentColumn.html(response.events[i].venue.address);
            //     contentColumn.html(response.events[i].venue.display_location);

            //     innerRow.append(imageColumn);
            //     innerRow.append(contentColumn);

            //     cardBody.append(innerRow);

            //     card.append(cardHeader);
            //     card.append(cardBody);
            //     $(".primary-content").append(card);
            // }
        });
    });

    //food buttons

    $(".food-btn").on("click", function() {
        event.preventDefault();
        var eStreetToken = "a558a49dffe756bd";
        var zkey = "312c4d4c34ef87c50671cf222cece7f5";
        var foodName = $(this).attr("data-name");

        // contains the latitude and longitude of Evanston, IL
        // searches food within a 10 mile radius
        var searchURL = "https://api.eatstreet.com/publicapi/v1/restaurant/search?access-token="+ eStreetToken
            + "&latitude=" + lat + "&longitude=" + lon + "&method=both&pickup-radius=5&search=" + foodName;
        $.ajax({
            url: searchURL,
            type: 'GET'
        }).done(function (response) {
            console.log(response);
            $(".primary-content").html('');
            var responseLength = response.restaurants.length;
            displayeatStreetEvent(response);
        });
    });

    function displaySeatGeekEvent(data, eventType){
        var recordLength = 0;
        var obj;
        if(eventType === "events"){
            recordLength = data.events.length;
        }
        else if(eventType === "performers"){
            recordLength = data.performers.length;
        }
        else if(eventType === "venues"){
            recordLength = data.venues.length;
        }
        else{
            recordLength = data.events.length;
            eventType = "events";
        }
        if(recordLength > 0){
            for(var i=0; i<recordLength; i++){
                    
                // var card = $("<div class='card'></div>");
                // var cardHeader = $("<div class='card-header'></div>");
                // var cardBody = $("<div class='card-body'></div>");
                // var row = $("<div class='row'></div>");
                // var imageColumn = $("<div class='col-md-2'></div>");
                // var img = $("<img class='img-fluid rounded'>");
                // var contentColumn = $("<div class='col-md-10'></div>");
                // var btnMoreInfo = $("<button class='btn btn-default btn-sm btn-more-info'>More Info</button>");
                // btnMoreInfo.attr("record-id", data.events[i].id);

                // cardHeader.html(data.events[i].short_title);

                // img.attr("src", data.events[i].performers[0].image);
                // contentColumn.html(data.events[i].venue.name + "<br>" + data.events[i].venue.address + "<br>");
                // contentColumn.append(btnMoreInfo);

                // imageColumn.append(img);
                // row.append(imageColumn);
                // row.append(contentColumn);

                // cardBody.append(row);
                // card.append(cardHeader);
                // card.append(cardBody);
                // $(".primary-content").append(card);

                var div = $("<div class='row'></div>");
                var imageColumn = $("<div class='col-md-2'></div>");
                var contentColumn = $("<div class='col-md-10'></div>");

                var img = $("<img class='img-fluid rounded'>");
                var eventTitle = $("<h4></h4>");
                var eventPlace = $("<p></p>");
                var eventAddress = $("<p></p>");

                var hr = $("<hr></hr>");

                if(eventType === "events"){

                    if(data.events[i].performers[0].image !== null)
                        img.attr("src", data.events[i].performers[0].image);
                    else
                        img.attr("src", "assets/images/spectator.png");
                    
                    eventTitle.html(data.events[i].title);
                    eventPlace.html(data.events[i].type);
                    eventAddress.html(data.events[i].venue.address);

                }
                else if(eventType === "performers"){

                    if(data.performers[i].image !== null)
                        img.attr("src", data.performers[i].image);
                    else
                        img.attr("src", "assets/images/spectator.png");
                    
                    eventTitle.html(data.performers[i].name);
                    eventPlace.html(data.performers[i].type);
                    // eventAddress.html(data.events[i].venue.address);

                }
                else if(eventType === "venues"){

                    img.attr("src", "assets/images/spectator.png");                    
                    eventTitle.html(data.venues[i].name);
                    eventPlace.html(data.venues[i].city);
                    // eventAddress.html(data.events[i].venue.address);
                }
                else{

                }

                imageColumn.append(img);
                contentColumn.append(eventTitle);
                contentColumn.append(eventPlace);
                contentColumn.append(eventAddress);

                div.append(imageColumn);
                div.append(contentColumn);

                $(".primary-content").append(div);
                $(".primary-content").append(hr);
            }
        }
        else{
            noDataFound();
        }
    }
    function displayeatStreetEvent(data){
        if(data.restaurants.length > 0){
            for(var i = 0; i < data.restaurants.length; i++) {
                var card = $("<div class='card'></div>");
                var cardHeader = $("<div class='card-header'></div>");
                var cardBody = $("<div class='card-body'></div>");
                var row = $("<div class='row'></div>");

                var innerRow = $("<div class='row'></div>");

                var imageColumn = $("<div class='col-md-2'></div>");
                var img = $("<img width='100px' height='100px'>");
                var contentColumn = $("<div class='col-md-10'></div>");

                var restaurantAPIKey = response.restaurants[i].apiKey;

                var button = $("<br><br><button class='food-info' data-restaurant-key='"+ restaurantAPIKey +"'>More Info</button>");

                cardHeader.html(data.restaurants[i].name);
                if(data.restaurants[i].logoUrl !== null || data.restaurants[i].logoUrl !== '')
                    img.attr('src', data.restaurants[i].logoUrl);
                else
                    img.attr('src', "assets/images/spectator.png");
                imageColumn.append(img);
                
                contentColumn.html(data.restaurants[i]);
                // name for that current restaurant
                var restaurantName = response.restaurants[i].name;
                var restaurantCity = response.restaurants[i].city;
                var restaurantState = response.restaurants[i].state;
                var restaurantZip = response.restaurants[i].zip;

                cardHeader.html(restaurantName);
                imageColumn.append(img);
                
                contentColumn.html(restaurantCity + ", " + restaurantState + " " + restaurantZip);
                contentColumn.append(button);

                innerRow.append(imageColumn);
                innerRow.append(contentColumn);

                cardBody.append(innerRow);

                card.append(cardHeader);
                card.append(cardBody);

                $(".primary-content").append(card);
            }
        }
        else{
            noDataFound();
        }
    }

    function noDataFound(){
        var card = $("<div class='card'></div>");
        var cardHeader = $("<div class='card-header'></div>");
        var cardBody = $("<div class='card-body'></div>");
        var row = $("<div class='row'></div>");

        var innerRow = $("<div class='row'></div>");

        var imageColumn = $("<div class='col-md-2'></div>");
        var img = $("<img width='100px' height='100px' src='assets/images/sorry.png'>");
        var contentColumn = $("<div class='col-md-10'></div>");

        cardHeader.html("Sorry ! We couldn't find any data !");
        imageColumn.append(img);
        
        innerRow.append(imageColumn);

        cardBody.append(innerRow);

        card.append(cardHeader);
        card.append(cardBody);

        $(".primary-content").append(card);
    }
    $(document.body).on("click", ".food-info", function() {
        
        $(".primary-content").html('');

        var restaurantKey = $(this).attr("data-restaurant-key");
        var restaurantURL = "https://api.eatstreet.com/publicapi/v1/restaurant/" + restaurantKey +
            "?access-token=a558a49dffe756bd";

        $.ajax({
            url: restaurantURL,
            method: "GET"
        }).done(function(response) {
            console.log(response);
            // $("#food-info-container").html('');
            var foodCard = $("<div class='card'></div>");
            var foodCardHeader = $("<div class='card-header'></div>");
            var foodCardBody = $("<div class='card-body'></div>");
            var foodCardRow = $("<div class='row'></div>");
            var foodCardInnerRow = $("<div class='row'></div>");

            var foodContentColumn = $("<div class='col'></div>");

            var img = $("<img width='100px' height='100px' src='" + response.restaurant.logoUrl + "'>")

            // address of restaurant
            var streetAddress = response.restaurant.streetAddress;
            var restaurantCity = response.restaurant.city;
            var restaurantState = response.restaurant.state;
            var restaurantZip = response.restaurant.zip;
            var foodTypes = response.restaurant.foodTypes;

            var hours = "<br><br>Hours of Operation for the week: <br>" +
                        "Monday: " + response.restaurant.hours.Monday[0] +
                        "<br>Tuesday: " + response.restaurant.hours.Tuesday[0] +
                        "<br>Wednesday: " + response.restaurant.hours.Wednesday[0] +
                        "<br>Thursday: " + response.restaurant.hours.Thursday[0] +
                        "<br>Friday: " + response.restaurant.hours.Friday[0] +
                        "<br>Saturday: " + response.restaurant.hours.Saturday[0];

            foodCardHeader.html(response.restaurant.name);
            foodContentColumn.append(img);

            foodContentColumn.append("<br>" + streetAddress + "<br>" + restaurantCity + ", " + restaurantState 
                + " " + restaurantZip);

            foodContentColumn.append("<br><br>Food Types: " + foodTypes);
            foodContentColumn.append(hours);
            
            foodCardInnerRow.append(foodContentColumn);
            foodCardBody.append(foodContentColumn);

            foodCard.append(foodCardHeader);
            foodCard.append(foodCardBody);

            $(".primary-content").append(foodCard);
        });
    });

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
});