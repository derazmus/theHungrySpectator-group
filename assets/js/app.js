
$(document).ready(function(){
    
    var lat = "";
    var lon = "";

    if(localStorage.getItem("lat") !== null && localStorage.getItem("lon") !== null){
        lat = localStorage.getItem("lat");
        lon = localStorage.getItem("lon");
    }
    else{
        geoFindMe();
    }

    function geoFindMe(){
        if(!navigator.geolocation){
            console.log('Geo location is not supported in your browser');
            return;
        }
        function success(position){
            localStorage.setItem("lat", position.coords.latitude);
            localStorage.setItem("lon", position.coords.longitude);
        }
        function error(){
            console.log("Error");
        }
        navigator.geolocation.getCurrentPosition(success, error);
    }
    /* Navigation search bar*/
    $("#search-button").on('click',function(){
        alert('test');
    });

    /* Function to get user IP address */
    /* Help to find current location */
    $.get("https://ipinfo.io", function(response) {
        userIP = response.ip;
        onLoadQuery = "https://api.seatgeek.com/2/events?geoip=" + userIP + "&client_id=OTM3ODIzNHwxNTA4ODAxNzUyLjY0";
        $.ajax({
            url: onLoadQuery,
            type: 'GET'
            })
            .done(function(data) {
            $(".page-heading").html("<h3>Popular Events Near <span class='event-heading'>" + data.meta.geolocation.display_name + "</span></h3><hr>");
            displaySeatGeekEvent(data, "events");
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

    var eventEndpoint = $(".eventEndpoint").val(); /* "select option menu" -> Default value is : "default" */
    
    /* "select option menu" on change event. When triggered, updating "eventEndpoint" variable to selected option */
    $(".container").on("change", ".eventEndpoint", function(){
        eventEndpoint = $(".eventEndpoint").val();
        $(".eventEndpoint").css("border", "none");
    });

    /* Remove border if any (to remove red border) */
    $("#search-term").on("focus", function(){
        $("#search-term").css("border", "none");
    });
    
    /* Custome search event
        1. Get the "eventEndpoint" variable (current selected option)
        2. Get the search-box value
        3. Perform validation (Both above values shouldn't be empty or null)
        4. Generate and Send query.
        5. Display data on UI */
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
                /* Generic function to display data on UI */
                /* First argument takes object return by ajax call. Second argument is endpoint type (i.e events, performers or venues)*/
                displaySeatGeekEvent(response, eventEndpoint);
            });
        }
        else{
            /* If user doesn't select any option, this code updates border to red */
            if(eventEndpoint === "default"){
                $(".eventEndpoint").css("border", "2px solid red");
            }
            /* If user submit form without writing anything to search-box, this code updates border to red */
            if(eventName === ""){
                $("#search-term").css("border", "2px solid red");
            }
        }
    });

    /* Pre-built sports button event
        1. Get the button's data value
        2. Generate and Send query string
        3. Display data on UI */
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
            /* Generic function to display data on UI */
            /* First argument takes object return by ajax call. Second argument is endpoint type (i.e events, performers or venues)*/
            displaySeatGeekEvent(response, "events");
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
            + "&latitude=" + lat + "&longitude=" + lon + "&method=both&pickup-radius=20&search=" + foodName;
        $.ajax({
            url: searchURL,
            type: 'GET'
        }).done(function (response) {
            console.log(response);
            $(".primary-content").html('');
            var responseLength = response.restaurants.length;
            /* Generic function to display eatStreet API's data to UI */
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
                    
                var card = $("<div class='card'></div>");
                var cardHeader = $("<div class='card-header'style='background-color:#8bd6ba; color: white;'></div>");
                var cardBody = $("<div class='card-body'style='background-color:#d3d3d3'></div>");
                var row = $("<div class='row'></div>");
                var imageColumn = $("<div class='col-md-2'></div>");
                var img = $("<img class='img-fluid rounded'>");
                var contentColumn = $("<div class='col-md-10'></div>");
                var btnMoreInfo = $("<button class='btn btn-secondary btn-sm btn-block btn-more-info'>More Info</button>");

                if(eventType === "events"){

                    if(data.events[i].performers[0].image !== null)
                        img.attr("src", data.events[i].performers[0].image);
                    else
                        img.attr("src", "assets/images/logo.jpeg");
                    
                    btnMoreInfo.attr("record-id", data.events[i].id);
                    cardHeader.html(data.events[i].short_title);
                    contentColumn.html(data.events[i].venue.name + "<br>" + data.events[i].venue.address + "<br>");
                }
                else if(eventType === "performers"){

                    if(data.performers[i].image !== null)
                        img.attr("src", data.performers[i].image);
                    else
                        img.attr("src", "assets/images/logo.jpeg");
                    
                    btnMoreInfo.attr("record-id", data.performers[i].id);
                    cardHeader.html(data.performers[i].name);
                    contentColumn.html(data.performers[i].type + "<br>");
                }
                else if(eventType === "venues"){
                    img.attr("src", "assets/images/logo.jpeg");                    
                    btnMoreInfo.attr("record-id", data.venues[i].id);
                    cardHeader.html(data.venues[i].name);
                    contentColumn.html(data.venues[i].city + "<br>");
                }
                
                contentColumn.append(btnMoreInfo);
                imageColumn.append(img);
                row.append(imageColumn);
                row.append(contentColumn);

                cardBody.append(row);
                card.append(cardHeader);
                card.append(cardBody);
                $(".primary-content").append(card);
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
                var cardHeader = $("<div class='card-header'style='background-color:#8bd6ba; color: white;'></div>");
                var cardBody = $("<div class='card-body'style='background-color:#d3d3d3'></div>");
                var row = $("<div class='row'></div>");

                var innerRow = $("<div class='row'></div>");

                var imageColumn = $("<div class='col-md-2'></div>");
                var img = $("<img width='100px' height='100px'>");
                var contentColumn = $("<div class='col-md-10'></div>");

                var restaurantAPIKey = data.restaurants[i].apiKey;

                var button = $("<br><button class='food-info btn btn-secondary btn-sm btn-block' data-restaurant-key='"+ restaurantAPIKey +"'>More Info</button>");

                cardHeader.html(data.restaurants[i].name);
                if(data.restaurants[i].logoUrl !== null || data.restaurants[i].logoUrl !== '')
                    img.attr('src', data.restaurants[i].logoUrl);
                else
                    img.attr('src', "assets/images/logo.jpeg");
                imageColumn.append(img);
                
                contentColumn.html(data.restaurants[i]);
                // name for that current restaurant
                var restaurantName = data.restaurants[i].name;
                var restaurantCity = data.restaurants[i].city;
                var restaurantState = data.restaurants[i].state;
                var restaurantZip = data.restaurants[i].zip;

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
            /* When API do not return any data, or 0 records, we should display appropriate message on UI */
            noDataFound();
        }
    }

    /* To display proper message when API doesn't have any record */
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
            var foodCardHeader = $("<div class='card-header'style='background-color:#8bd6ba; color: white;'></div>");
            var foodCardBody = $("<div class='card-body'style='background-color:#d3d3d3'></div>");
            
            var foodCardRow = $("<div class='row'></div>");
            var foodCardImageColumn = $("<div class='col-md-2'></div>");
            var img = $("<img class='img-thumbnail rounded' width='100px' height='100px' src='" + response.restaurant.logoUrl + "'>");
            var foodCardContentColumn = $("<div class='col-md-10'></div>");
            var streetAddress = $("<h4>" + response.restaurant.streetAddress + "</h4>");
            var restaurantCity = $("<h5>" + response.restaurant.city + ", " + response.restaurant.state + " - " + response.restaurant.zip + "</h5>");
            var foodTypes = $("<h5>" + response.restaurant.foodTypes + "</h5>");
            var foodCardInnerRow = $("<div class='row'></div>");
            var button = $("<a href='" + response.restaurant.url + "' class='btn btn-primary' target='_blank'>Go To Website</a>");

            foodCardImageColumn.append(img);
            foodCardContentColumn.append(streetAddress);
            foodCardContentColumn.append(restaurantCity);
            foodCardContentColumn.append(foodTypes);
            foodCardContentColumn.append(button);

            var foodCardAnotherRow = $("<div class='row'></div>");
            var col = $("<div class='col'></div>");
            var heading = "<h4>Hours of Operation for the week</h4>";
            var para = "<p><strong>Monday:</strong> " + response.restaurant.hours.Monday[0] +
                        "<br><strong>Tuesday:</strong> " + response.restaurant.hours.Tuesday[0] +
                        "<br><strong>Wednesday:</strong> " + response.restaurant.hours.Wednesday[0] +
                        "<br><strong>Thursday:</strong> " + response.restaurant.hours.Thursday[0] +
                        "<br><strong>Friday:</strong> " + response.restaurant.hours.Friday[0] +
                        "<br><strong>Saturday:</strong> " + response.restaurant.hours.Saturday[0] + "</p>";

            col.append(heading);
            col.append(para);
            foodCardAnotherRow.append(col);
            foodCardHeader.html("<h3>" + response.restaurant.name + "</h3>");
    
            foodCardRow.append(foodCardImageColumn);
            foodCardRow.append(foodCardContentColumn);

            foodCardBody.append(foodCardRow);
            foodCardBody.append(foodCardAnotherRow);

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