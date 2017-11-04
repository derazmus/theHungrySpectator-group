
$(document).ready(function(){
    
    /* Global Variables */
    var lat = "";
    var lon = "";
    var onLoadSeatGeekQuery = "";
    var eventEndpoint = $(".eventEndpoint").val(); /* "select option menu" -> Default value is : "default" */

    /* If your session is still running, don't ask for Geolocation */
    if(sessionStorage.getItem("lat") !== null && sessionStorage.getItem("lon") !== null){
        lat = sessionStorage.getItem("lat");
        lon = sessionStorage.getItem("lon");
        onLoadSeatGeekQuery = "https://api.seatgeek.com/2/events?lat=" + lat + "&lon=" + lon + "&range=20mi&client_id=OTM3ODIzNHwxNTA4ODAxNzUyLjY0";
        seatGeekApiCall(onLoadSeatGeekQuery);
    }
    /* Else, ask for Geolocation */
    else{
        geoFindMe();
    }

    /* Function to get/ask Geolocation of user */
    function geoFindMe(){
        /* If Geolocation is not supported in user's browser, set up default value for "latitude" and "longitude" */
        if(!navigator.geolocation){
            sessionStorage.setItem("lat", "41.881832");
            sessionStorage.setItem("lon", "-87.623177");
            lat = sessionStorage.getItem("lat");
            lon = sessionStorage.getItem("lon");
            onLoadSeatGeekQuery = "https://api.seatgeek.com/2/events?lat=" + lat + "&lon=" + lon + "&range=" + 20 +  "mi&client_id=OTM3ODIzNHwxNTA4ODAxNzUyLjY0";
            /* Function to display data on home page (with default geolocation) */
            seatGeekApiCall(onLoadSeatGeekQuery);
            return;
        }
        /* If user click on "Allow", save "latitude" and "longitude" to session storage of your browser */
        function success(position){
            sessionStorage.setItem("lat", position.coords.latitude);
            sessionStorage.setItem("lon", position.coords.longitude);
            lat = sessionStorage.getItem("lat");
            lon = sessionStorage.getItem("lon");
            onLoadSeatGeekQuery = "https://api.seatgeek.com/2/events?lat=" + lat + "&lon=" + lon + "&range=20mi&client_id=OTM3ODIzNHwxNTA4ODAxNzUyLjY0";
            /* Function to display data on home page (with user's geolocation) */
            seatGeekApiCall(onLoadSeatGeekQuery);
        }
        /* If user click on "Block", save default "latitude" and "longitude" to session storage of your browser */
        function error(){
            sessionStorage.setItem("lat", "41.881832");
            sessionStorage.setItem("lon", "-87.623177");
            lat = sessionStorage.getItem("lat");
            lon = sessionStorage.getItem("lon");
            onLoadSeatGeekQuery = "https://api.seatgeek.com/2/events?lat=" + lat + "&lon=" + lon + "&range=20mi&client_id=OTM3ODIzNHwxNTA4ODAxNzUyLjY0";
            /* Function to display data on home page (with default geolocation) */
            seatGeekApiCall(onLoadSeatGeekQuery);
        }
        navigator.geolocation.getCurrentPosition(success, error);
    }
    
    /* Function to display data on home page based on user's geolocation */
    function seatGeekApiCall(query){
        $.ajax({
            url: query,
            type: 'GET'
            })
            .done(function(data) {
            $(".page-heading").html("<h3>Popular Events Near <span class='event-heading'>" + data.meta.geolocation.display_name + "</span></h3><hr>");
            displaySeatGeekEvent(data, "events");
        });
    }
    
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
        eventEndpoint = $(".eventEndpoint").val();
        var eventName = $("#search-term").val();
        var url = "https://api.seatgeek.com/2/";
        if(eventEndpoint !== "default" && eventName !== ''){
            url = url + eventEndpoint + "?" + "q=" + eventName + "&lat=" + lat + "&lon=" + lon + "&range=20mi&client_id=OTM3ODIzNHwxNTA4ODAxNzUyLjY0";
            $.ajax({
                url: url,
                type: 'GET'
            })
            .done(function(response){
                $(".primary-content").html('');
                /* Generic function to display data on UI */
                /* First argument takes object return by ajax call. Second argument is endpoint type (i.e events, performers or venues)*/
                displaySeatGeekEvent(response, eventEndpoint);
                $("#search-term").val('');
                $(".eventEndpoint").val("default");
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
        var url = "https://api.seatgeek.com/2/events?lat=" + lat + "&lon=" + lon + "&range=20mi&q=" + sportName + "&client_id=OTM3ODIzNHwxNTA4ODAxNzUyLjY0";
        $.ajax({
            url: url,
            type: 'GET'
        })
        .done(function(response) {
            $(".primary-content").html('');
            /* Generic function to display data on UI */
            /* First argument takes object return by ajax call. Second argument is endpoint type (i.e events, performers or venues)*/
            displaySeatGeekEvent(response, "events");
        });
    });

    /* food buttons */
    $(".food-btn").on("click", function() {
        event.preventDefault();
        /* eatStreetToken that will allow us to access the API */
        var eStreetToken = "a558a49dffe756bd";
        /* grabs the data-name and stores it into the variable foodName */
        var foodName = $(this).attr("data-name");

        /* searches food within a 20 mile radius of the user's latitude and longitude */
        var searchURL = "https://api.eatstreet.com/publicapi/v1/restaurant/search?access-token="+ eStreetToken
            + "&latitude=" + lat + "&longitude=" + lon + "&method=both&pickup-radius=20&search=" + foodName;
        $.ajax({
            url: searchURL,
            type: 'GET'
        }).done(function (response) {
            /* empty the primary content */
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
                var btnMoreInfo = $("<button class='btn btn-secondary btn-more-info'>More Info</button>");

                if(eventType === "events"){

                    if(data.events[i].performers[0].image !== null)
                        img.attr("src", data.events[i].performers[0].image);
                    else
                        img.attr("src", "assets/images/logo.jpeg");
                    
                    btnMoreInfo.attr("record-id", data.events[i].id);
                    btnMoreInfo.attr("event-type", eventType);
                    cardHeader.html(data.events[i].title);
                    contentColumn.html(data.events[i].venue.name + " - " + moment(data.events[i].datetime_local).format("MMMM Do YYYY, h:mm:ss a") + 
                    "<br>" + data.events[i].venue.address + ", " + data.events[i].venue.extended_address + "<br>");
                }
                else if(eventType === "performers"){

                    if(data.performers[i].image !== null)
                        img.attr("src", data.performers[i].image);
                    else
                        img.attr("src", "assets/images/logo.jpeg");
                    
                    btnMoreInfo.attr("record-id", data.performers[i].id);
                    btnMoreInfo.attr("event-type", eventType);
                    cardHeader.html(data.performers[i].name);
                    contentColumn.html(data.performers[i].type + "<br>");
                }
                else if(eventType === "venues"){
                    img.attr("src", "assets/images/logo.jpeg");                    
                    btnMoreInfo.attr("record-id", data.venues[i].id);
                    btnMoreInfo.attr("event-type", eventType);
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
                var button = $("<br><br><button class='food-info btn btn-secondary' data-restaurant-key='"+ restaurantAPIKey +"'>More Info</button>");

                cardHeader.html(data.restaurants[i].name);
                if(data.restaurants[i].logoUrl !== null || data.restaurants[i].logoUrl !== '')
                    img.attr('src', data.restaurants[i].logoUrl);
                else
                    img.attr('src', "assets/images/logo.jpeg");
                imageColumn.append(img);
                
                contentColumn.html(data.restaurants[i]);
                // name for that current restaurant
                var restaurantName = data.restaurants[i].name;
                var restaurantAddress = data.restaurants[i].streetAddress;
                var restaurantCity = data.restaurants[i].city;
                var restaurantState = data.restaurants[i].state;
                var restaurantZip = data.restaurants[i].zip;
                var restaurantPhone = data.restaurants[i].phone;

                cardHeader.html(restaurantName);
                imageColumn.append(img);
                
                contentColumn.html(restaurantAddress + "<br>" + restaurantCity + ", " + restaurantState + " " + restaurantZip + "<br>" + restaurantPhone);
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
        var cardHeader = $("<div class='card-header'style='background-color:#8bd6ba; color: white;'></div>");
        var cardBody = $("<div class='card-body'style='background-color:#d3d3d3'></div>");
        var row = $("<div class='row'></div>");

        var innerRow = $("<div class='row'></div>");

        var imageColumn = $("<div class='col-md-2'></div>");
        var img = $("<img width='100px' height='100px' src='assets/images/sorry.jpg'>");
        var contentColumn = $("<div class='col-md-10'></div>");

        cardHeader.html("Sorry, we couldn't find any data !");
        imageColumn.append(img);
        
        innerRow.append(imageColumn);

        cardBody.append(innerRow);

        card.append(cardHeader);
        card.append(cardBody);

        $(".primary-content").append(card);
    }

    /* for all buttons that have the class food-info on the page ... */
    $(document.body).on("click", ".food-info", function() {
        /* empty the primary content on the page */
        $(".primary-content").html('');
        /* grab the restaurant key of that button and store it into the variable */
        var restaurantKey = $(this).attr("data-restaurant-key");
        var restaurantURL = "https://api.eatstreet.com/publicapi/v1/restaurant/" + restaurantKey +
            "?access-token=a558a49dffe756bd";
        $.ajax({
            url: restaurantURL,
            method: "GET"
        }).done(function(response) {
            /* create the card that we want on the page and 
                append everything together */
            var foodCard = $("<div class='card'></div>");
            var foodCardHeader = $("<div class='card-header'style='background-color:#8bd6ba; color: white;'></div>");
            var foodCardBody = $("<div class='card-body'style='background-color:#d3d3d3'></div>");
            
            foodCardHeader.html(response.restaurant.name);
            /* first row of the card */
            var foodCardRow = $("<div class='row'></div>");
            var foodCardImageColumn = $("<div class='col-md-2'></div>");
                var img = $("<img class='img-thumbnail rounded' width='100px' height='100px' src='" + response.restaurant.logoUrl + "'>");
            var foodCardContentColumn = $("<div class='col-md-10 foodContent'></div>");
                var streetAddress = $("<p>" + response.restaurant.streetAddress + "</p>");
                var restaurantCity = $("<p>" + response.restaurant.city + ", " + response.restaurant.state + " - " + response.restaurant.zip + "</p>");
                var foodTypes = $("<p>" + response.restaurant.foodTypes +"</p>");
                var hoursTitle = $("<h4></h4>");
                hoursTitle.html("Hours");
                var sunday = response.restaurant.hours.Sunday;
                if(sunday === undefined)
                    sunday = "N/A";
                var hours = $("<p>Monday : " + response.restaurant.hours.Monday + "<br>" +
                              "Tuesday : " + response.restaurant.hours.Tuesday + "<br>" +
                              "Wednesday : " + response.restaurant.hours.Wednesday + "<br>" +
                              "Thursday : " + response.restaurant.hours.Thursday + "<br>" +
                              "Friday : " + response.restaurant.hours.Friday + "<br>" +
                              "Saturday : " + response.restaurant.hours.Saturday + "<br>" +
                              "Sunday : " + sunday + "<br></p>");
                var offersDelivery = $("<h5></h5>");
                var offersPickup = $("<h5></h5>");
                if(response.restaurant.offersDelivery)
                    offersDelivery.html("Offers Delivery ? YES" );
                else
                    offersDelivery.html("Offers Delivery ? NO" );
                if(response.restaurant.offersPickup)
                    offersPickup.html("Offers Pickup ? YES" );
                else
                    offersPickup.html("Offers Pickup ? NO" );
                var foodCardInnerRow = $("<div class='row'></div>");
                var button = $("<a href='" + response.restaurant.url + "' class='btn btn-secondary' target='_blank'>Go To Website</a>");

            foodCardImageColumn.append(img);
            foodCardContentColumn.append(streetAddress);
            foodCardContentColumn.append(restaurantCity);
            foodCardContentColumn.append(foodTypes);
            foodCardContentColumn.append(hoursTitle);
            foodCardContentColumn.append(hours);
            foodCardContentColumn.append(offersDelivery);
            foodCardContentColumn.append(offersPickup);
            foodCardContentColumn.append(button);

            foodCardRow.append(foodCardImageColumn);
            foodCardRow.append(foodCardContentColumn);

            foodCardBody.append(foodCardRow);

            foodCard.append(foodCardHeader);
            foodCard.append(foodCardBody);

            /* append the whole card onto the primary content */
            $(".primary-content").append(foodCard);
            displayMap(response.restaurant.latitude, response.restaurant.longitude);
            displayWeather(moment().unix(), response.restaurant.latitude, response.restaurant.longitude);
        });
    });

    $(document.body).on("click", ".btn-more-info", function(){
        /* empty the primary content on the page */
        $(".primary-content").html('');
        /* grab the event id and store it to the value */
        var eventID = $(this).attr("record-id");
        var eventType = $(this).attr("event-type");
        /* url for the specific seat geek event */
        var sgEventURL = "https://api.seatgeek.com/2/" + eventType + "/" + eventID + "?client_id=OTM3ODIzNHwxNTA4ODAxNzUyLjY0";
        $.ajax({
            url: sgEventURL,
            method: "GET"
        }).done(function(response){
            /* storing the data into variables */
            var eventName = response.title;
            var eventCard = $("<div class='card'></div>");
            var eventCardHeader = $("<div class='card-header' style='background-color:#8bd6ba; color: white;'></div>");
            var eventCardBody = $("<div class='card-body'style='background-color:#d3d3d3'></div>");

            /* first row of the card */
            var eventCardRow = $("<div class='row'></div>");

            var eventCardImageColumn = $("<div class='col-md-2'></div>");
            var eventImg = $("<img class='rounded' width='100px' height='100px'>");
            
            var eventCardContentColumn = $("<div class='col-md-10'></div>");
            var eventStreetLocation = $("<h5></h5>");
            var eventStreetAddress = $("<h5></h5>");
            var hr = $("<hr>");
            var heading = $("<h4>Price Information</h4>");
            var price = $("<p></p>");
            var eventButton = $("<a class='btn btn-secondary' target='_blank'>Grab Tickets!</a>");
            
            if(eventType === "events"){
                if(response.performers[0].image !== null)
                    eventImg.attr("src", response.performers[0].image);
                else
                    eventImg.attr("src", "assets/images/logo.jpeg");
                
                eventButton.attr("href", response.url);
                eventCardHeader.html(response.title);
                eventStreetLocation.html(response.venue.name + " - " + moment(response.datetime_local).format("MMMM Do YYYY, h:mm:ss a"));
                eventStreetAddress.html(response.venue.address + ", " + response.venue.extended_address);
                
                var averagePrice = checkNull(response.stats.average_price);
                var highestPrice = checkNull(response.stats.highest_price);
                var listingCount = checkNull(response.stats.listing_count);
                var lowestPrice = checkNull(response.stats.lowest_price);
                var goodDeals = checkNull(response.stats.lowest_price_good_deals);

                price.html("<strong>Average Price : " + averagePrice + "<br>" +
                           "Highest Price : " + highestPrice + "<br>" + 
                           "Listing Count : " + listingCount + "<br>" + 
                           "Lowest Price : " + lowestPrice + "<br>" + 
                           "Lowest Price Good Deals : " + goodDeals + "</strong><br>");
            }
            else if(eventType === "performers"){
                if(response.image !== null)
                    eventImg.attr("src", response.image);
                else
                    eventImg.attr("src", "assets/images/logo.jpeg");
                
                eventCardHeader.html(response.name);
                eventStreetLocation.html(response.venue.name + " - " + response.datetime_local);
                eventStreetAddress.html(response.venue.address + ", " + response.venue.extended_address);
                
                var averagePrice = checkNull(response.stats.average_price);
                var highestPrice = checkNull(response.stats.highest_price);
                var listingCount = checkNull(response.stats.listing_count);
                var lowestPrice = checkNull(response.stats.lowest_price);
                var goodDeals = checkNull(response.stats.lowest_price_good_deals);
                
                price.html("<strong>Average Price : " + averagePrice + "<br>" +
                           "Highest Price : " + highestPrice + "<br>" + 
                           "Listing Count : " + listingCount + "<br>" + 
                           "Lowest Price : " + lowestPrice + "<br>" + 
                           "Lowest Price Good Deals : " + goodDeals + "</strong><br>");
            }
            else if(eventType === "venues"){
            }

            /* appending everything into the card */
            eventCardImageColumn.append(eventImg);
            eventCardContentColumn.append(eventStreetLocation);
            eventCardContentColumn.append(eventStreetAddress);
            eventCardContentColumn.append(hr);
            eventCardContentColumn.append(heading);
            eventCardContentColumn.append(price);
            eventCardContentColumn.append(eventButton);

            eventCardRow.append(eventCardImageColumn);
            eventCardRow.append(eventCardContentColumn);

            eventCardBody.append(eventCardRow);
            eventCard.append(eventCardHeader);
            eventCard.append(eventCardBody);

            /* add the event card into the primary content container */
            $(".primary-content").html(eventCard);
            displayMap(response.venue.location.lat, response.venue.location.lon);
            displayWeather(response.datetime_local, response.venue.location.lat, response.venue.location.lon);
        });
    });
    function checkNull(param){
        if(param === null)
            return "N/A";
        else
            return "$ " + param;
    }
    
    function displayMap(lat, lon){
        var row = $("<div class='row weather-map'></div>");
        var mapColumn = $("<div class='col-md-8'></div>");
        var mapCard = $("<div class='card map-card'></div>");
        var mapCardHeader = $("<div class='card-header text-white' style='background-color:#8bd6ba;'>Map</div>");
        var mapCardBody = $("<div class='card-body map-holder' id='map-area'></div>");

        mapCard.append(mapCardHeader);
        mapCard.append(mapCardBody);
        mapColumn.append(mapCard);

        row.append(mapColumn);
        $(".primary-content").append(row);
        initMap(lat, lon);
    }

    function initMap(lat, lon) {
        var geoLocation = {lat: lat, lng: lon};
        var map = new google.maps.Map(document.getElementById('map-area'), {
            zoom: 15,
            center: geoLocation
        });
        var marker = new google.maps.Marker({
            position: geoLocation,
            map: map
        });
    }
    function displayWeather(date, lat, lon){
        var weatherQuery = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/e319b7a02841ce79f4c9eba2f95edae6/" + lat +"," + lon + "," + date + "?exclude=hourly,daily,minutely,flags";
        var weatherColumn = $("<div class='col-md-4'></div>");
        var weatherCard = $("<div class='card map-card'></div>");
        var weatherCardHeader = $("<div class='card-header text-white' style='background-color:#8bd6ba;'>Weather</div>");
        var weatherCardBody = $("<div class='card-body text-center' id='weather-area' style='background-color:#d3d3d3'></div>");

        var weatherIcon = $("<img class='img-fluid weather-icon'></h3>");
        var weatherSummary = $("<h4></h4>");
        var weatherTemprature = $("<p></p>");
        var weatherHumidity = $("<p></p>");

        $.ajax({
            url: weatherQuery,
            method: 'GET'
        }).done(function(response){
            weatherIcon.attr("src", "assets/images/" + response.currently.icon + ".png");
            weatherSummary.html(response.currently.summary);
            var celcius = (parseFloat(response.currently.temperature) - 32 ) * 5/9 ;
            weatherTemprature.html("<strong>" + response.currently.temperature + " &#176;F / " + celcius.toFixed(2) +" &#176;C" + "</strong>");
            weatherHumidity.html("Humidity : " + response.currently.humidity);

            weatherCardBody.append(weatherIcon);
            weatherCardBody.append(weatherSummary);
            weatherCardBody.append(weatherTemprature);
            weatherCardBody.append(weatherHumidity);

            weatherCard.append(weatherCardHeader);
            weatherCard.append(weatherCardBody);

            weatherColumn.append(weatherCard);
            $(".weather-map").append(weatherColumn);
        });
    }
});