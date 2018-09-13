const socket = io();
socket.on('connect', function() {
  console.log('Connected to server');
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
  console.log('New Message Received');
  console.log(message.text);
  let li = document.createElement('li');
  li.innerText = `${message.from}: ${message.text}`;

  document.getElementById('messages').appendChild(li);
});

socket.on('newLocationMessage', function(message) {
  let li = document.createElement('li');
  li.innerHTML = `<a href=${message.url} target="_blank">Location of ${
    message.from
  }</a>`;
  document.getElementById('messages').appendChild(li);
});

document.getElementById('message-form').addEventListener('submit', e => {
  e.preventDefault();

  socket.emit(
    'createMessage',
    {
      from: 'User',
      text: document.getElementById('text-box').value
    },
    data => console.log(data)
  );
});

const locationButton = document.getElementById('send-location');

locationButton.addEventListener('click', e => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  navigator.geolocation.getCurrentPosition(
    function(position) {
      socket.emit('createLocationMessage', {
        lattitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    function() {
      alert('Unable to fetch location');
    }
  );
});
