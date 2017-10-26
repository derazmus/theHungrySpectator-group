

$(document).ready(function(){
	$(".container").on("click",".btn-sports", function(){
		var sportName = $(this).attr("data-name");
		var url = "https://api.seatgeek.com/2/events?q=" + sportName + "&client_id=OTM3ODIzNHwxNTA4ODAxNzUyLjY0";
		$.ajax({
			url: url,
			type: 'GET',
		})
		.done(function(response) {
			console.log(response);
		});
	});
}); 