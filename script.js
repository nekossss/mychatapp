const messages = {
    character1: [
        { text: "こんにちは！", from: "character" },
        { text: "調子はどう？", from: "character" }
    ],
    character2: [
        { text: "やあ！", from: "character" },
        { text: "何か話そうよ", from: "character" }
    ]
};

function openChat(character) {
    const chatMessages = document.getElementById("chat-messages");
    chatMessages.innerHTML = '';
    messages[character].forEach(message => {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", message.from);
        messageElement.innerText = message.text;
        chatMessages.appendChild(messageElement);
    });
}

function sendMessage() {
    const userInput = document.getElementById("user-input");
    const chatMessages = document.getElementById("chat-messages");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", "user");
    messageElement.innerText = userInput.value;
    chatMessages.appendChild(messageElement);
    userInput.value = '';
}
