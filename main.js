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
    if (!message) return;

    inputField.value = "";
    
    chatBoxBody.innerHTML += `<div class="message"><p>${message}</p></div>`;

    // Show loading state
    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("response", "loading");
    loadingDiv.textContent = "...";
    chatBoxBody.appendChild(loadingDiv);

    scrollToBottom();

    fetch("https://agrotech-7.onrender.com/api/message", {  // ✅ Fixed API endpoint
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })  // ✅ Corrected request format
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(`Server error: ${response.status} - ${err.error || "Unknown error"}`);
          });
        }
        return response.json();
      })
      .then(data => {
        loadingDiv.remove();
        console.log("✅ Chatbot Response:", data);

        const botReply = data.message || "Sorry, I couldn't generate a response.";
        chatBoxBody.innerHTML += `<div class="response"><p>${botReply}</p></div>`;

        setTimeout(scrollToBottom, 100); // ✅ Ensures scrolling occurs after rendering
      })
      .catch(error => {
        console.error("❌ Error:", error);
        loadingDiv.remove();
        chatBoxBody.innerHTML += `<div class="response error"><p>Error: ${error.message}</p></div>`;
      });
  }
  function scrollToBottom() {
    setTimeout(() => {
      chatBoxBody.scrollTop = chatBoxBody.scrollHeight;
    }, 100);
  }
  
}
