let botBtn = document.getElementById("bot-button")
let chatApp = document.getElementById("chatapp")
let chatAppContainer = document.getElementById("chatapp-container")
let botBtnImage = document.querySelector("#bot-button img")
let botsend = document.querySelector("#chatapp-form")
let querytxt = document.querySelector("#chatapp-input-text")
let chatContainer = document.getElementById("chatapp-chat-container")

setTimeout(() => loadingDone(), 500)

const URL = "https://gsfc-chatbot-backend-24ns.onrender.com/get-bot-ans"

function loadingDone() {
  botBtn.disabled = false
}

//window on load
window.onload = () => {
  firstClick()
}

botBtn.addEventListener("click", () => {
  chatApp.classList.toggle("chatapp-closed")
  chatAppContainer.classList.toggle("p-event-none")
})

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
  successfunc(body)
  firstResponse()
  document
    .getElementsByClassName("chatapp-chat-message chatapp-chat-message--sent")
    .item(0)
    .remove()
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

  chatContainer.scrollTop = chatContainer.scrollHeight
}

function firstResponse() {
  let chatDivBot = document.createElement("div")
  chatDivBot.innerText = "Hello There, How Can I Help You?"
  chatDivBot.classList.add("chatapp-chat-message")
  chatContainer.appendChild(chatDivBot)
}
