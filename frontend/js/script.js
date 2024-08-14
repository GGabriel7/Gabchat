// Elementos do LOGIN
const login = document.querySelector('.login')
const loginForm = login.querySelector('.loginForm')
const loginInput = login.querySelector('.loginInput')

// Elementos do Chat
const chat = document.querySelector('.chat')
const chatForm = chat.querySelector('.chatForm')
const chatInput = chat.querySelector('.chatInput')

const chatMessages = document.querySelector('.chatMessages')

const cores = [
    "aqua",
    "blue",
    "blueviolet",
    "brown",
    "burlywood",
    "chartreuse",
    "chocolate",
    "cadetblue",
    "darkorange",
    "deeppink",
    "floralwhite",
    "olivedrab",
    "yellow",
    "pink",
    "darkgreen",
    "orangered",
    "lightcoral"
]

// dicionario para o usuario
const user = {id: "", nome: "", cor: ""}

let websocket

const criarMinhaMensagem = (content) => {
    const div = document.createElement("div")

    div.classList.add("minhaMensagem")
    div.innerHTML = content
    
    return div
}

const criarOutraMensagem = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("outraMensagem")
    span.classList.add("quemEnviou")
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender

    div.innerHTML += content
    
    return div
}

const corAleatoria = () => {
    const indexAleatorio = Math.floor(Math.random() * cores.length)
    return cores[indexAleatorio]
}

const telaScroll = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const procesandoMensagem = ({ data }) => {
    const { userId, userNome, userCor, content } = JSON.parse(data)

    const message = 
        userId == user.id 
            ? criarMinhaMensagem(content) 
            : criarOutraMensagem(content, userNome, userCor)

    chatMessages.appendChild(message)
    telaScroll()
}

// Função para iniciar o Site
const enterChat = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.nome = loginInput.value
    user.cor = corAleatoria()

    login.style.display = 'none'
    chat.style.display = 'flex'

    websocket = new WebSocket("wss://gabchat-backend.onrender.com")
    websocket.onmessage = procesandoMensagem
}

const enviarMensagem = (event) => {
    event.preventDefault()

    const message = {
        userId: user.id,
        userNome: user.nome,
        userCor: user.cor,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message))

    chatInput.value = ""
}


loginForm.addEventListener("submit", enterChat)
chatForm.addEventListener("submit", enviarMensagem)