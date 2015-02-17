// YOUR CODE HERE:
var url  = "https://api.parse.com/1/classes/chatterbox";
var roomName = '';
var friends = [];

var getMessages = function(){
  // if no filter provided, use this generic object
  filter = {
    order:"-updatedAt",
    limit:25,
  };

  // if there's a roomname, change the header and use for filter
  if (roomName) {
    $('h3').text( 'Where you at : ' + roomName );
    filter.where  = JSON.stringify({roomname:roomName});
  }

  $.ajax({
    url: url,
    data: filter,
    type: 'GET',
    success: function(data){
      console.log(data);
                displayMessages(data);
             }
  });
};

var updateMessages = function() {
  var latestMessageTime = getLatestMessageTime();
  var filter = {
    order:"-updatedAt",
    where: JSON.stringify({
      roomname: roomName,
      createdAt: {$gt:
                    {__type: "Date",
                      iso:latestMessageTime}
                  }
      }),
    limit: 100
  };

  $.ajax({
    url: url,
    data: filter,
    type: 'GET',
    success: function(data){
      console.log(data);
                displayMessages(data);
             }
  });

};

var getLatestMessageTime = function() {
  // jquery select the top message, return time string
  return $($('#messageBox').children('.messageBox')[0]).attr('data-updatedAt');
};

var displayMessages = function(msgObj){
  var messages = msgObj.results;

  for(var i = messages.length - 1; i >= 0; i--){ // change loop
    var messageBox = $("<div></div>").addClass('messageBox');
    messageBox.attr('data-updatedAt', messages[i].updatedAt);

    messageBox.append('<div class="username"></div>');
    $(messageBox.children('.username')).text(messages[i].username).html();

    messageBox.append('<div class="message"></div>');
    $(messageBox.children('.message')).text('Message: ' + messages[i].text).html();

    // Append to DOM
    $('#messageBox').prepend(messageBox); // change to prepend
  }

  $('.username').click(function(){
      addFriend.call(this);
      showFriends.call(this);
  });
  showFriends();
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
      updateMessages();
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
  $('#messageBox').children('.messageBox').remove();
  // display messages for that room
  getMessages();
  showFriends();
};

var addFriend = function(){
  if(!_.contains(friends, $(this).text())) {
    friends.push($(this).text());
  }
  else if(_.contains(friends, $(this).text())) {
    removeFriend($(this).text());
  }
}

var showFriends = function(){
  for(var i = 0; i < friends.length; i++){
    $('.messageBox:contains(' + friends[i] + ')' ).css('font-weight', 'bold');
  }
}

var removeFriend = function(friend){
    var idx = friends.indexOf(friend);
    friends.splice(idx, 1);

  $('.messageBox:contains(' + friend + ')' ).css('font-weight', 'normal');
}

// initialization
$(document).ready(function(){
  getMessages();

  $('#refreshMessagesButton').click(function(){
    updateMessages();
  });

  $('#sendMessageButton').click(function(){
    sendMessage();
  });

  $('#roomChoiceButton').click(function(){
    changeRoom();
  });
});



