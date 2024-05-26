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

const correctWords = {
    character1: "正解ワード",
    character2: "別の正解ワード"
};

let activeCharacter = 'character1';

function openChat(character) {
    activeCharacter = character;
    const chatMessages = document.getElementById("chat-messages");
    const chatHeader = document.getElementById("chat-header");
    chatHeader.innerText = character;
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

    if (userInput.value.includes(correctWords[activeCharacter])) {
        const nextMessage = { text: "次のトークが始まります！", from: "character" };
        messages[activeCharacter].push(nextMessage);
        const responseElement = document.createElement("div");
        responseElement.classList.add("message", "character");
        responseElement.innerText = nextMessage.text;
        chatMessages.appendChild(responseElement);
    } else {
        const responseElement = document.createElement("div");
        responseElement.classList.add("message", "character");
        responseElement.innerText = "違うと思うが";
        chatMessages.appendChild(responseElement);
    }

    userInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight; // 自動スクロール
}
