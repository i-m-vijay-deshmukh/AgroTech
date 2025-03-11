const chatBox = document.querySelector(".chat-box");
const inputField = chatBox.querySelector("input[type='text']");
const button = chatBox.querySelector("button");
const chatBoxBody = chatBox.querySelector(".chat-box-body");

button.addEventListener("click", sendMessage);
inputField.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

function sendMessage() {
  const message = inputField.value.trim();
  if (!message) return; // Prevent sending empty messages

  inputField.value = "";

  chatBoxBody.innerHTML += `<div class="message"><p>${message}</p></div>`;
  chatBoxBody.innerHTML += `<div id="loading" class="response loading">...</div>`;

  scrollToBottom();

  fetch("http://localhost:5500/message", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message }) // Ensure proper JSON structure
  })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(`Server error: ${response.status} - ${err.error}`);
            });
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("loading").remove();
        
        const botReply = data.message || "Sorry, something went wrong.";
        
        chatBoxBody.innerHTML += `<div class="response"><p>${botReply}</p></div>`;
        scrollToBottom();
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("loading").remove();
        chatBoxBody.innerHTML += `<div class="response error"><p>Error: ${error.message}</p></div>`;
    });
}

function scrollToBottom() {
  chatBoxBody.scrollTop = chatBoxBody.scrollHeight;
}
