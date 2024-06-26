const apiKey = 'AIzaSyAvcuZHQcZwKZOr3h0zwJ808R-5LOYCPKY'; // 取得したAPIキーをここに入力
const spreadsheetId = '1eXSLaACf0XBKScv5fcLJZdMb_5yUsw-k9fdO5jGxZAA'; // 取得したスプレッドシートIDをここに入力
const range = 'シナリオ本番!A2:G'; // データがある範囲を指定

const characters = {};
let activeCharacter = '';
let currentMessageIndex = {};

function fetchData() {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            console.log("Fetched data:", data); // デバッグ用のログ
            if (!data.values) {
                console.error("No data found");
                return;
            }
            const rows = data.values;
            rows.forEach(row => {
                const character = row[0];
                const message = row[1];
                const sender = row[2];
                const correctWord = row[3] !== 'なし' ? row[3] : null;
                const wrongWord1 = row[4] !== 'なし' ? row[4] : null;
                const wrongWord2 = row[5] !== 'なし' ? row[5] : null;
                const wrongResponse = row[6] !== 'なし' ? row[6] : null;

                if (!characters[character]) {
                    characters[character] = {
                        name: character,
                        messages: [],
                        unread: 0
                    };
                }

                characters[character].messages.push({
                    text: message,
                    from: sender,
                    correctWord: correctWord,
                    wrongWords: [wrongWord1, wrongWord2].filter(word => word !== null),
                    wrongResponse: wrongResponse
                });

                // 未読メッセージのカウントロジック
                if (!correctWord && !wrongWord1 && !wrongWord2 && !wrongResponse) {
                    characters[character].unread++;
                }
            });
            console.log("Parsed characters:", characters); // デバッグ用のログ
            updateCharacterList();
        })
        .catch(error => console.error('Error fetching data:', error));
}

document.addEventListener('DOMContentLoaded', fetchData);

function initChat() {
    document.getElementById('chat-messages').innerHTML = '';
    document.getElementById('chat-header').innerText = "トークするキャラを選択してください";
    document.getElementById('user-input').disabled = true;
    document.getElementById('send-button').disabled = true;
}

function updateCharacterList() {
    console.log("Updating character list"); // デバッグ用のログ
    const chatList = document.getElementById('chat-list');
    chatList.innerHTML = '';
    Object.keys(characters).forEach(character => {
        const characterItem = document.createElement('div');
        characterItem.classList.add('chat-item');
        characterItem.onclick = () => openChat(character);
        characterItem.innerHTML = `
            ${characters[character].name}
            ${characters[character].unread > 0 ? `<span id="${character}-unread" class="unread-count">未読${characters[character].unread}</span>` : ''}
        `;
        chatList.appendChild(characterItem);
        console.log("Added character to list:", character); // デバッグ用のログ
    });
}

function openChat(character) {
    console.log("Opening chat for character:", character); // デバッグ用のログ
    activeCharacter = character;
    currentMessageIndex[character] = 0;
    const chatMessages = document.getElementById("chat-messages");
    const chatHeader = document.getElementById("chat-header");
    chatHeader.innerText = characters[character].name;
    chatMessages.innerHTML = '';

    const unreadElement = document.getElementById(`${character}-unread`);
    if (unreadElement) {
        unreadElement.style.display = 'none';
    }

    characters[character].unread = 0;

    displayNextMessage();
    document.getElementById('user-input').disabled = false;
    document.getElementById('send-button').disabled = true;
}

function displayNextMessage() {
    const chatMessages = document.getElementById("chat-messages");
    const currentMessage = characters[activeCharacter].messages[currentMessageIndex[activeCharacter]];

    if (!currentMessage) return;

    const messageElement = document.createElement("div");
    messageElement.classList.add("message", "character");
    messageElement.innerText = currentMessage.text;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // 自動スクロール

    if (!currentMessage.correctWord && !currentMessage.wrongWords.length) {
        // 正解ワードも間違いワードもない場合は次のメッセージを自動で表示
        currentMessageIndex[activeCharacter]++;
        displayNextMessage();
    } else {
        // 正解ワードや間違いワードがある場合はユーザーの入力を待つ
        updateMessageOptions();
    }
}

function updateMessageOptions() {
    const userInput = document.getElementById('user-input');
    userInput.innerHTML = '<option value="">メッセージを選択</option>';
    const currentMessage = characters[activeCharacter].messages[currentMessageIndex[activeCharacter]];
    if (currentMessage) {
        console.log("Current Message:", currentMessage); // デバッグ用のログ
        currentMessage.wrongWords.forEach((word, index) => {
            console.log("Adding wrong word option:", word); // デバッグ用のログ
            const option = document.createElement('option');
            option.value = word;
            option.innerText = word;
            userInput.appendChild(option);
        });
        if (currentMessage.correctWord) {
            console.log("Adding correct word option:", currentMessage.correctWord); // デバッグ用のログ
            const option = document.createElement('option');
            option.value = currentMessage.correctWord;
            option.innerText = currentMessage.correctWord;
            userInput.appendChild(option);
        }
    }
    console.log("User Input Options:", userInput.innerHTML); // デバッグ用のログ
}

function sendMessage() {
    const userInput = document.getElementById("user-input");
    if (userInput.value.trim() === '') {
        return;
    }
    const chatMessages = document.getElementById("chat-messages");
    const messageText = userInput.value;

    const messageElement = document.createElement("div");
    messageElement.classList.add("message", "user");
    messageElement.innerText = messageText;
    chatMessages.appendChild(messageElement);

    const currentMessage = characters[activeCharacter].messages[currentMessageIndex[activeCharacter]];

    setTimeout(() => {
        const responseElement = document.createElement("div");
        responseElement.classList.add("message", "character");

        if (messageText === currentMessage.correctWord) {
            currentMessageIndex[activeCharacter]++;
            displayNextMessage();
        } else if (currentMessage.wrongWords.includes(messageText)) {
            responseElement.innerText = currentMessage.wrongResponse;
        } else {
            responseElement.innerText = currentMessage.wrongResponse || "違うと思うが";
        }

        chatMessages.appendChild(responseElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);

    userInput.value = '';
    toggleSendButton();
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function toggleSendButton() {
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    sendButton.disabled = userInput.value.trim() === '';
}