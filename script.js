const characters = {
    andrew: {
        name: "アンドリュー",
        messages: [
            { text: "どうも。噂の“探偵さん”だな", from: "character" },
            { text: "俺は初めましてだが、警察組織でもあんたの話は有名なんだ。聞くところによれば、幾つかの難事件解決にもあんたが噛んでるそうじゃないか", from: "character" },
            { text: "もっとも“あんた”が、個人なのか複数人のグループなのか、それは俺は知らんが、便宜上そう呼ばせて貰う", from: "character" },
            { text: "今回は、公式の依頼という訳にはいかないが、とにかく協力に感謝するよ。まぁ本職としては情けない話だがな", from: "character" },
            { text: "早速だが、事件資料をまとめておいた １と書かれた封筒を開けてくれ それを見て怪しい資料をメッセージで教えて欲しい", from: "character" }
        ]
    },
    // 他のキャラクターをここに追加
};

const correctWords = {
    andrew: ["正解ワード1", "正解ワード2"], // 正解ワードを追加
    // 他のキャラクターの正解ワードをここに追加
};

let activeCharacter = 'andrew';

function initChat() {
    openChat(activeCharacter);
}

function openChat(character) {
    activeCharacter = character;
    const chatMessages = document.getElementById("chat-messages");
    const chatHeader = document.getElementById("chat-header");
    chatHeader.innerText = characters[character].name;
    chatMessages.innerHTML = '';
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

    const correctResponse = correctWords[activeCharacter].includes(userInput.value);
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

const apiKey = 'AIzaSyAvcuZHQcZwKZOr3h0zwJ808R-5LOYCPKY'; // 取得したAPIキーをここに入力
const spreadsheetId = '1eXSLaACf0XBKScv5fcLJZdMb_5yUsw-k9fdO5jGxZAA'; // 取得したスプレッドシートIDをここに入力
const range = 'シナリオ本番!A1:D10000'; // データがある範囲を指定

function fetchData() {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            rows.forEach(row => {
                const character = row[0];
                const message = row[1];
                const from = row[2];
                const correctWords = row[3].split(',');

                if (!characters[character]) {
                    characters[character] = { name: character, messages: [] };
                }

                characters[character].messages.push({ text: message, from: from });

                if (!correctWords[character]) {
                    correctWords[character] = [];
                }

                correctWords[character] = correctWords;
            });
        })
        .then(initChat)
        .catch(error => console.error('Error fetching data:', error));
}

document.addEventListener('DOMContentLoaded', fetchData);
