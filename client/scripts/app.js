// YOUR CODE HERE:
var url  = "https://api.parse.com/1/classes/chatterbox";
var roomName = '';

var getMessages = function(){
  if (roomName) {
    $('h3').text( 'Where you at : ' + roomName );
  }

  $.ajax({
    url: url,
    data: {order:"-updatedAt",
           where: JSON.stringify({roomname: roomName}),
           limit: 25
          },
    type: 'GET',
    success: function(data){
      console.log(data);
                displayMessages(data);
             }
  });
};

var getLatestMessage() {
  // jquery select the top message
  // return date string associated with it

  return x;
}

var displayMessages = function(msgObj){
  var messages = msgObj.results;
  // check

  for(var i = 0; i < messages.length; i++){ // change loop
    var messageBox = $("<div></div>").addClass('messageBox');
    messageBox.attr('data-updatedAt', messages[i].updatedAt);

    messageBox.append('<div class="username"></div>');
    $(messageBox.children('.username')).text('Username: ' + messages[i].username).html();

    messageBox.append('<div class="message"></div>');
    $(messageBox.children('.message')).text('Message: ' + messages[i].text).html();

    // Append to DOM
    $('#main').append(messageBox); // change to prepend
  }
};

var sendMessage = function(){
  //get the shit from dom
  var user = $('#sendMessageBoxUser').val();
  var room = roomName;
  var text = $('#sendMessageBoxText').val();

  var message = {
    username: user,
    roomname: room,
    text: text
  };

  $.ajax({
    url: url,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      getMessages();
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

var changeRoom = function() {
  roomName = $('#roomChoiceText').val();
  // clear messages
  $('#main').children('.messageBox').remove();
  // display messages for that room
  getMessages();

};

$(document).ready(function(){
  $('#refreshMessagesButton').click(function(){
    getMessages();
  });
  $('#sendMessageButton').click(function(){
    sendMessage();
  });
  $('#roomChoiceButton').click(function(){
    changeRoom();
  })
});


