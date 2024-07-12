const socket = io('http://localhost:3000');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const roomInput = document.getElementById('room-input');
const roomButton = document.getElementById('room-button');
const sendButton = document.getElementById('send-button');

let currentRoom = '';

const name = prompt('What is your name?');
appendMessage('You joined');
socket.emit('new-user', name);

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`);
});

socket.on('user-connected', name => {
  appendMessage(`${name} connected`);
});

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`);
});

// Handle form submission
messageForm.addEventListener('submit', e => {
  e.preventDefault();
  sendMessage();
});

// Handle send button click
sendButton.addEventListener('click', e => {
  e.preventDefault();
  sendMessage();
});

// Handle room button click
roomButton.addEventListener('click', () => {
  const room = roomInput.value;
  if (room === '') return;
  socket.emit('join-room', room, currentRoom);
  currentRoom = room;
  appendMessage(`You joined room: ${room}`);
  roomInput.value = '';
});

function sendMessage() {
  const message = messageInput.value;
  if (message.trim() === '') return;
  appendMessage(`You: ${message}`);
  socket.emit('send-chat-message', { message, room: currentRoom });
  messageInput.value = '';
}

function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight; // Auto-scroll to the bottom
}
