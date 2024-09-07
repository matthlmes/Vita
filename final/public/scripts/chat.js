//SOCKET.IO BILLY

// variables
var socket = io();

// chat form function
$('#form').submit(function () {
    var message = $('#input').val();
    var username = $('#username').val();
    if (message) {
        socket.emit('chat message', username, message);
    }
    $("#input").val("");
    return false;
});

//function for when a message is sent
socket.on('chat message', function(username, msg) {
    $('#messages').append("<li><h3>"+ username +":</h3>" + msg + "</li>");
    window.scrollTo(0, document.body.scrollHeight);
});        

