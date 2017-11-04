$(document).ready(function(){
/* Contact validation on change event. Red border appears of option not selected*/
    $("#submit").on("click", function(){
        var name = $("#name").val();
        var email = $("#email").val();
        event.preventDefault();
        if(name === ''){
            $("#name").css("border", "1px solid red");
        }
        if(email === ''){
            $("#email").css("border", "1px solid red");
        }
    });
    /* Remove border if any*/
    $("#name").on("focus", function(){
        $("#name").css("border", "none");
    });
    /* Remove border if any*/
    $("#email").on("focus", function(){
        $("#email").css("border", "none");
    });
});