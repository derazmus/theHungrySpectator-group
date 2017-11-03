
# The Hungry Spectator

Synopsis of assignment: A website done in a group project which utalizes at least 2 APIs, an AJAX call for data, polished front end, quality coding standards, repeating elemenmts, bootstrap, must be deployed to github pages, user input validation and use firebase. 

https://derazmus.github.io/theHungrySpectator-group/

## Team Members:

+ Denise Erazmus - Frontend/Firebase/Animate.css
+ Kalpesh Patel - Backend- SeatGeek API, Search buttons, quick link buttons for events.
+ Kelvin Tiongson - Backend - EatStreet API, quick link buttons for resturants.
+ Jeff Ostrom - Backend - SeatGeek API, more info buttons for events. 

## Problem: 

+ You are going to an event, concert, sporting event etc and you are hungry.

## Solution:

+ Uses SeatGeek API to locate various events, sporting events, concerts etc. Upon inital load shows events based on Geo-ID. Dynamically creates containers when quick link button for event type are selected. Upon click of more info button, gives you more details of event along with a link to tickets. 

+ Uses SeatGeek API to locate events, sporting events, concerts etc when using search box. Search box will not allow user to submit unless an event type and a search parameter is entered. 

+ Uses EatStreet API to locate resturants. Can select type of food ( i.e. Breakfast, Lunch and Dinner) using quick link buttons. Dynamically creates containers when button is select with reesturant info. Upon click of more info button, gives you more details about resturant including location and times open. 

+ Images are generated off of both APIs and if image is not avaliable a placeholder image is used. 

+ Uses google API to provice map of where is event etc is located

+ Uses DarkSky API to give the predicted weather for the day of the event. 

## Description: 

+ Provide one location in which you can locate an event, concert, sporting event etc and food. 

## APIs Used:

+ SeatGeek http://platform.seatgeek.com/
+ EatStreet https://developers.eatstreet.com/
+ Google Maps https://developers.google.com/maps/
+ DarkSky https://darksky.net/dev/docs


## Technology used:

+ CSS/HTML
+ Bootstrap 4
+ Animate.css
+ jQuery
+ AJAX call
+ Firebase
+ Cookies

## Future Developement:

+ Show on page tickets avaliable rather  than going to link.
+ Have ability to make reservations from page rather than going through link. 
+ Add search parameters for resturants (i.e price, type of food etc.).


