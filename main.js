document.addEventListener("DOMContentLoaded", function () {
    const messageInput = document.getElementById("messageInput");
    const sendButton = document.getElementById("sendButton");
    const chatBoxBody = document.getElementById("chatBoxBody");

    // Function to add message to chat
    function addMessageToChat(sender, message) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add(sender === "user" ? "user-message" : "bot-message");
        messageDiv.textContent = message;
        chatBoxBody.appendChild(messageDiv);

        // Auto-scroll to bottom
        chatBoxBody.scrollTop = chatBoxBody.scrollHeight;
    }

    // Function to handle sending message
    function sendMessage() {
        const messageText = messageInput.value.trim();
        if (messageText === "") return;

        addMessageToChat("user", messageText);
        messageInput.value = "";

        // Simulating bot response
        setTimeout(() => {
            addMessageToChat("bot", "I am here to help! How can I assist you?");
        }, 1000);
    }

    // Event listeners
    sendButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});

