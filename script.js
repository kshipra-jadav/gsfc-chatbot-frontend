let botBtn = document.getElementById("bot-button")
let chatApp = document.getElementById("chatapp")
let chatAppContainer = document.getElementById("chatapp-container")
let botBtnImage = document.querySelector("#bot-button img")
let botsend = document.querySelector("#chatapp-form")
let querytxt = document.querySelector("#chatapp-input-text")
let chatContainer = document.getElementById("chatapp-chat-container")

setTimeout(() => loadingDone(), 500)

const URL = "https://gsfc-chatbot-backend-24ns.onrender.com/get-bot-ans"

let skipSave = false; // Flag to prevent unwanted history save

function loadingDone() {
  botBtn.disabled = false
}

//window on load
// window.onload = () => {
//   firstClick()
// }

window.onload = () => {
  restoreChatHistory(); // ✅ Restore saved chat history

  // Check if chat is already opened from localStorage
  const chatOpened = localStorage.getItem('chatOpened');
  if (chatOpened === 'true') {
    chatApp.classList.remove("chatapp-closed");
    chatAppContainer.classList.remove("p-event-none");
  } else {
    // First time open the chat (run firstClick)
    const hasOpened = localStorage.getItem('chatOpened');
    if (!hasOpened) {
      firstClick();
      localStorage.setItem('chatOpened', 'true');
    }
  }
};
// Open/close chat window when the bot button is clicked
botBtn.addEventListener("click", () => {
  chatApp.classList.toggle("chatapp-closed");
  chatAppContainer.classList.toggle("p-event-none");

  // Keep track of chat status (opened or closed)
  if (chatApp.classList.contains("chatapp-closed")) {
    localStorage.setItem('chatOpened', 'false');
  } else {
    localStorage.setItem('chatOpened', 'true');
  }
});

$("#chatapp-input-send-btn").click(processQuery)
$("#chatapp-input-text").on("keypress", (e) => {
  if (e.which == 13) {
    processQuery()
  }
})

async function processQuery() {
  const query = $("#chatapp-input-text").val()

  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: query }),
  })

  const body = await response.json()
  successfunc(body)
}

async function firstClick() {
  firstClick = noop
  const query = "gsfc video"

  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: query }),
  })

  const body = await response.json()
  skipSave = true; // Prevent saving temporarily
  successfunc(body);

  // Remove the "video" message before saving
  const sentMsg = document.querySelector(".chatapp-chat-message--sent");
  if (sentMsg) {
    chatContainer.removeChild(sentMsg);
  }

  firstResponse();
  skipSave = false;

  saveChatHistory(); // Save cleaned-up chat
}
function noop() { } //!! No Operation Function --> Required to only call the firstClick function once.

function successfunc(result) {
  let chatDiv = document.createElement("div")
  chatDiv.innerText = result.data.query
  chatDiv.classList.add("chatapp-chat-message", "chatapp-chat-message--sent")
  chatContainer.appendChild(chatDiv)
  querytxt.value = ""

  let chatDivBot = document.createElement("div")
  chatDivBot.innerHTML = result.data.answer
  chatDivBot.classList.add("chatapp-chat-message")
  chatContainer.appendChild(chatDivBot)

  querytxt.value = "";
  chatContainer.scrollTop = chatContainer.scrollHeight;

  if (!skipSave) saveChatHistory(); // Save only when allowed
}

function firstResponse() {
  let chatDivBot = document.createElement("div")
  chatDivBot.innerText = "Hello There, How Can I Help You?"
  chatDivBot.classList.add("chatapp-chat-message")
  chatContainer.appendChild(chatDivBot)

  saveChatHistory();

}

// Save chat to localStorage
function saveChatHistory() {
  const messages = [];
  document.querySelectorAll('.chatapp-chat-message').forEach(msg => {
    messages.push({
      content: msg.innerHTML,
      className: msg.className
    });
  });
  localStorage.setItem('chatHistory', JSON.stringify(messages));
}
// Restore chat from localStorage
function restoreChatHistory() {
  const saved = localStorage.getItem('chatHistory');
  if (!saved) return;
  const messages = JSON.parse(saved);
  messages.forEach(msg => {
    const div = document.createElement('div');
    div.innerHTML = msg.content;
    div.className = msg.className;
    chatContainer.appendChild(div);
  });
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Button click handlers (to handle different query buttons)
$('.chatapp-option-btn').click(async function () {
  const query = $(this).data('query');

  if (query === "Admission Inquiry") {
    // Optional: Show user message (if you want to display their selection)
    let userDiv = document.createElement("div");
    userDiv.innerText = query;
    userDiv.classList.add("chatapp-chat-message", "chatapp-chat-message--sent");
    chatContainer.appendChild(userDiv);

    // Custom response
    let chatDivBot = document.createElement("div");
    chatDivBot.innerHTML = `
      For admission inquiries, please visit our 
      <a href="https://dcs.gsfcuniversity.ac.in/academic/admission/Form_Student_Enquiry_Page.aspx" target="_blank">admissions page</a> 
      or contact the admission office at <b>+91 12345 67890</b>. 
      You can also email us at 
      <a href="https://mail.google.com/mail/?view=cm&fs=1&to=admissions@gsfcuni.edu.in" target="_blank">
        <b>admissions@gsfcuni.edu.in</b>
      </a>.

    `;
    chatDivBot.classList.add("chatapp-chat-message");
    chatContainer.appendChild(chatDivBot);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    saveChatHistory(); // Save this to localStorage
    return; // Prevent backend call
  }

  querytxt.value = query;

  // Default query processing
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: query }),
  });

  const body = await response.json();
  successfunc(body);
});

// Clear chat history
function clearChat() {
  localStorage.removeItem('chatHistory');
  localStorage.removeItem('chatOpened'); // Allow firstClick again if needed
  chatContainer.innerHTML = '';
}
document.getElementById("clear-chat-btn").addEventListener("click", clearChat);
