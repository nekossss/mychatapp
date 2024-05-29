const apiKey = 'AIzaSyAvcuZHQcZwKZOr3h0zwJ808R-5LOYCPKY'; // 取得したAPIキーをここに入力
const spreadsheetId = '1eXSLaACf0XBKScv5fcLJZdMb_5yUsw-k9fdO5jGxZAA'; // 取得したスプレッドシートIDをここに入力
const range = 'シナリオ本番!A2:G'; // データがある範囲を指定

const characters = {};
let activeCharacter = '';
let messageQueue = [];

function fetchData() {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
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
            });
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
    });
}

function openChat(character) {
    activeCharacter = character;
    const chatMessages = document.getElementById("chat-messages");
    const chatHeader = document.getElementById("chat-header");
    chatHeader.innerText = characters[character].name;
    chatMessages.innerHTML = '';

    const unreadElement = document.getElementById(`${character}-unread`);
    if (unreadElement) {
        unreadElement.style.display = 'none';
    }

    characters[character].unread = 0;
    characters[character].messages.forEach(message => {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", message.from === character ? 'character' : 'user');
        messageElement.innerText = message.text;
        chatMessages.appendChild(messageElement);
    });

    document.getElementById('user-input').disabled = false;
    document.getElementById('send-button').disabled = true;
    updateMessageOptions();
}

function updateMessageOptions() {
    const userInput = document.getElementById('user-input');
    userInput.innerHTML = '<option value="">メッセージを選択</option>';
    characters[activeCharacter].messages.forEach((message, index) => {
        if (message.from !== activeCharacter && !message.correctWord) {
            const option = document.createElement('option');
            option.value = index;
            option.innerText = message.text;
            userInput.appendChild(option);
        }
    });
}

function sendMessage() {
    const userInput = document.getElementById("user-input");
    if (userInput.value.trim() === '') {
        return;
    }
    const chatMessages = document.getElementById("chat-messages");
    const messageIndex = userInput.value;
    const message = characters[activeCharacter].messages[messageIndex];

    const messageElement = document.createElement("div");
    messageElement.classList.add("message", "user");
    messageElement.innerText = message.text;
    chatMessages.appendChild(messageElement);

    setTimeout(() => {
        const responseElement = document.createElement("div");
        responseElement.classList.add("message", "character");

        if (message.correctWord) {
            responseElement.innerText = message.correctWord;
            characters[activeCharacter].messages[messageIndex].correctWord = null;
            const nextMessage = characters[activeCharacter].messages[messageIndex + 1];
            if (nextMessage) {
                characters[nextMessage.from].unread++;
                updateCharacterList();
                openChat(nextMessage.from);
            }
        } else if (message.wrongWords.includes(userInput.value)) {
            responseElement.innerText = message.wrongResponse;
        } else {
            responseElement.innerText = "違うと思うが";
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
