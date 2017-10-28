$(".food-btn").on("click", function() {
    event.preventDefault();
    var zkey = "312c4d4c34ef87c50671cf222cece7f5";
    var foodName = $(this).attr("data-name");

    // contains the latitude and longitude of Evanston, IL
    var searchURL = "https://developers.zomato.com/api/v2.1/search?apikey=" + 
        zkey +"&count=10&lat=42.0451&lon=-87.6877&q=" + foodName;

    // Gets location latitude, longitude. 
    var longitude ="";

    var latitude ="";

       function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
    }
    function showPosition(position) {
        latitude = position.coords.latitude; 
        longitude = position.coords.longitude; 
    }
    getLocation();
    console.log(latitude, longitude);

   

    $.ajax({
        url: searchURL,
        type: 'GET'
    }).done(function (response) {
        console.log(response);
        
        $(".primary-content").html('');

        for(var i = 0; i < response.restaurants.length; i++) {
                var card = $("<div class='card'></div>");
                var cardHeader = $("<div class='card-header'></div>");
                var cardBody = $("<div class='card-body'></div>");
                var row = $("<div class='row'></div>");

                var innerRow = $("<div class='row'></div>");

                var imageColumn = $("<div class='col-md-3'></div>");
                var img = $("<img width='100px' height='100px' src='" + response.restaurants[i].restaurant.featured_image + "'>");
                var contentColumn = $("<div class='col-md-9'></div>");

                cardHeader.html(response.restaurants[i].restaurant.name);
                imageColumn.append(img);
                
                // contentColumn.html(response.restaurants[i].restaurant.cuisines);
                contentColumn.html(response.restaurants[i].restaurant.location.address);
                // contentColumn.html(response.restaurants[i].restaurant.average_cost_for_two);

                innerRow.append(imageColumn);
                innerRow.append(contentColumn);

                cardBody.append(innerRow);

                card.append(cardHeader);
                card.append(cardBody);

                $(".primary-content").append(card);           
        }
    })
});

$(document).ready(function(){
    
    /* Function to get user IP address */
    /* Help to find current location */
    $.get("http://ipinfo.io", function(response) {
        alert(response.ip);
    }, "jsonp");

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
                var cardHeader = $("<div class='card-header'></div>");
                var cardBody = $("<div class='card-body'></div>");
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