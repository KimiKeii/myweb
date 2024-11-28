// chat.js

function loadContent(profileName) {
  // Change the profile name in the chat window
  const chatName = document.getElementById("chatName");
  chatName.textContent = profileName.charAt(0).toUpperCase() + profileName.slice(1); // Capitalize name

  // Simulate initial message when profile is loaded
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML = `
    <div class="message friend">Hello ${profileName}, how are you?</div>
  `;
}

// Send message function
function sendMessage() {
  const input = document.getElementById("messageInput");
  const message = input.value.trim();

  if (message !== "") {
    const chatBox = document.getElementById("chatBox");

    // Create user message (aligned right)
    const newMessage = document.createElement("div");
    newMessage.classList.add("message", "user");
    newMessage.textContent = message;

    chatBox.appendChild(newMessage);

    // Scroll to the bottom of the chat box
    chatBox.scrollTop = chatBox.scrollHeight;

    // Simulate friend response (aligned left)
    setTimeout(() => {
      const friendMessage = document.createElement("div");
      friendMessage.classList.add("message", "friend");
      friendMessage.textContent = `Got your message, ${message}`;

      chatBox.appendChild(friendMessage);
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 1500); // Simulated delay for friend reply

    // Clear the input field
    input.value = "";  // This line clears the input field after sending the message
  }
}

// Allow pressing "Enter" to send message
document.getElementById("messageInput").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});
