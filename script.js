const characters = {
    andrew: {
        name: "アンドリュー",
        messages: [
            { text: "どうも。噂の“探偵さん”だな", from: "character" },
            { text: "俺は初めましてだが、警察組織でもあんたの話は有名なんだ。聞くところによれば、幾つかの難事件解決にもあんたが噛んでるそうじゃないか", from: "character" },
            { text: "もっとも“あんた”が、個人なのか複数人のグループなのか、それは俺は知らんが、便宜上そう呼ばせて貰う", from: "character" },
            { text: "今回は、公式の依頼という訳にはいかないが、とにかく協力に感謝するよ。まぁ本職としては情けない話だがな", from: "character" }
        ],
        unread: 4 // 未読メッセージ数を追加
    },
    // 他のキャラクターをここに追加
};

const correctWords = {
    andrew: ["正解ワード1", "正解ワード2"], // 正解ワードを追加
    // 他のキャラクターの正解ワードをここに追加
};

let activeCharacter = '';

function initChat() {
    // 最初はメッセージを表示しない
    document.getElementById('chat-messages').innerHTML = '';
}

function openChat(character) {
    activeCharacter = character;
    const chatMessages = document.getElementById("chat-messages");
    const chatHeader = document.getElementById("chat-header");
    chatHeader.innerText = characters[character].name;
    chatMessages.innerHTML = '';
    
    // 未読メッセージアイコンを非表示にする
    document.getElementById(`${character}-unread`).style.display = 'none';

    characters[character].messages.forEach(message => {
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

    const correctResponse = correctWords[activeCharacter] && correctWords[activeCharacter].includes(userInput.value);
    setTimeout(() => {
        const responseElement = document.createElement("div");
        responseElement.classList.add("message", "character");
        if (correctResponse) {
            responseElement.innerText = "なるほど、その考えはなかった";
        } else {
            responseElement.innerText = "違うと思うが";
        }
        chatMessages.appendChild(responseElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // 自動スクロール
    }, 1000); // 1秒後に応答

    userInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight; // 自動スクロール
}
