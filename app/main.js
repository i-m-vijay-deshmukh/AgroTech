const chatBox = document.querySelector(".chat-box");
const inputField = chatBox?.querySelector("input[type='text']");
const button = chatBox?.querySelector("button");
const chatBoxBody = chatBox?.querySelector(".chat-box-body");

if (button && inputField && chatBoxBody) {
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

    // Create a loading div dynamically
    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("response", "loading");
    loadingDiv.textContent = "...";
    chatBoxBody.appendChild(loadingDiv);

    scrollToBottom();

    fetch("https://agrotech-7.onrender.com/api/message", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(`Server error: ${response.status} - ${err.error}`);
          }).catch(() => {
            throw new Error(`Server error: ${response.status}`);
          });
        }
        return response.json();
      })
      .then(data => {
        loadingDiv.remove();

        const botReply = data.message || "Sorry, something went wrong.";
        
        chatBoxBody.innerHTML += `<div class="response"><p>${botReply}</p></div>`;
        scrollToBottom();
      })
      .catch(error => {
        console.error("Error:", error);
        loadingDiv.remove();
        chatBoxBody.innerHTML += `<div class="response error"><p>Error: ${error.message}</p></div>`;
      });
  }

  function scrollToBottom() {
    chatBoxBody.scrollTop = chatBoxBody.scrollHeight;
  }
}
