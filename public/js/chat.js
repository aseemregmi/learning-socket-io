const socket = io();

function scrollToBottom() {
  // Selectors
  const messages = document.querySelector('#messages');
  // Heights
  const clientHeight = messages.clientHeight;
  const scrollTop = messages.scrollTop;
  const scrollHeight = messages.scrollHeight;

  if (clientHeight + scrollTop + 100 >= scrollHeight) {
    messages.scrollTo(0, scrollHeight);
  }
}

socket.on('connect', function() {
  console.log('Connected to server');
  const params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function(err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No errors');
    }
  });
});

socket.on('updateUserList', function(users) {
  console.log('Update User List');
  document.getElementById('users').innerHTML = '';
  const ul = document.createElement('ol');
  let usersLi = '';
  users.forEach(user => {
    usersLi += `<li>${user}</li>`;
  });
  ul.innerHTML = usersLi;
  document.getElementById('users').innerHTML = ul.innerHTML;
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  const mustacheHtml = Mustache.render(
    document.getElementById('message-template').innerHTML,
    {
      from: message.from,
      text: message.text,
      createdAt: formattedTime
    }
  );

  const html = document.createElement('div');
  html.innerHTML = mustacheHtml;

  document.getElementById('messages').appendChild(html);

  scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  const mustacheHtml = Mustache.render(
    document.getElementById('location-message-template').innerHTML,
    {
      from: message.from,
      url: message.url,
      createdAt: formattedTime
    }
  );
  const html = document.createElement('div');
  html.innerHTML = mustacheHtml;

  document.getElementById('messages').appendChild(html);
  scrollToBottom();
});

document.getElementById('message-form').addEventListener('submit', e => {
  e.preventDefault();

  if (document.getElementById('text-box').value.trim() === '') {
    return;
  }

  socket.emit(
    'createMessage',
    {
      text: document.getElementById('text-box').value
    },
    () => {
      document.getElementById('text-box').value = '';
    }
  );
});

const locationButton = document.getElementById('send-location');

locationButton.addEventListener('click', e => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }
  locationButton.textContent = 'Sending Location';
  locationButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition(
    function(position) {
      socket.emit('createLocationMessage', {
        lattitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      locationButton.removeAttribute('disabled');
      locationButton.textContent = 'Send Location';
    },
    function() {
      alert('Unable to fetch location');
      locationButton.removeAttribute('disabled');
      locationButton.textContent = 'Send Location';
    }
  );
});
