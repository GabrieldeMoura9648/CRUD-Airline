//===================================
// Dados fixos: Funcionários (Login)
//===================================
function local() {
  const funcionarios = [
    { id: 1, nome: "will",  senha: "123"  },  //Admin
    { id: 2, nome: "bob",   senha: "2222" },
    { id: 3, nome: "ringo", senha: "3333" }
                      ]

  localStorage.setItem("funcionarios", JSON.stringify(funcionarios))
  return funcionarios
}

//================================
// Login apenas para funcionários
//================================
function logon() {
  const funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || []
  let login = document.querySelector("#login").value
  let senha = document.querySelector("#senha").value

  for (let i = 0; i < funcionarios.length; i++) {
    let user = funcionarios[i]
    if (login === user.nome && senha === user.senha) {
      sessionStorage.setItem("user", JSON.stringify(user))
      if (user.id === 1) { //Determina quem é o adm
        window.location.href = "administrador.html"
      } else {
        window.location.href = "airline.html"
      }
      return
    }
  }
  alert("Login ou senha inválidos")
}

//=============================
// Verifica funcionário logado
//=============================
function logado() {
  let dados = JSON.parse(sessionStorage.getItem("user"))
  if (dados) {
    document.getElementById("nome").innerHTML = "Bem-vindo: " + dados.nome
    return dados.nome
  }
}

function logaout() {
  sessionStorage.removeItem("user")
  window.location.href = "login.html"
}

//=======================================
// CRUD de Usuários (dados com e-mail)
//=======================================
function tabelaUsuarios() {
  const tabela = document.querySelector("#userTable tbody")
  tabela.innerHTML = ""

  const linhaVazia = document.createElement("tr")   //Cria a linha da mensagem "Usuário não cadastrado" (invisível inicialmente)
  linhaVazia.id = "mensagemVazia"
  linhaVazia.style.display = "none"
  linhaVazia.innerHTML = `
    <td colspan="4" style="text-align: center; color: red;">Usuário não cadastrado</td>
  `
  tabela.appendChild(linhaVazia)

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || []

  usuarios.forEach((user, index) => {
    const row = tabela.insertRow()
    row.innerHTML = `
      <td>${user.nome}</td>
      <td>${user.email}</td>
      <td>${user.senha}</td>
      <td>
        <button class="btn btn-editar" onclick="editarUsuario(${index})">Editar</button>
        <button class="btn btn-excluir" onclick="apagarUsuario(${index})">Excluir</button>
      </td>
    `
  })

  if (usuarios.length === 0) {  //Se não houver usuários, mostra a mensagem
    linhaVazia.style.display = ""
  } else {
    linhaVazia.style.display = "none"
  }
}

//=============================
//Adiciona ou atualiza usuário
//=============================
function adicionarUsuario() {
  const id = document.querySelector("#id").value
  const nome = document.querySelector("#usuario").value
  const email = document.querySelector("#loginUser").value
  const senha = document.querySelector("#senhaUser").value

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || []

  if (id) {
    const index = usuarios.findIndex(u => u.id == id)
    if (index !== -1) {
      usuarios[index] = { id: Number(id), nome, email, senha }
      alert("Usuário atualizado.")
    }
  } else {
    const novoUsuario = { id: Date.now(), nome, email, senha }
    usuarios.push(novoUsuario)
    alert("Usuário adicionado.")
  }

  localStorage.setItem("usuarios", JSON.stringify(usuarios))
  tabelaUsuarios()
  limpar()
}

//================================
//Busca de Usuários via nome/email
//================================
function filtrarUsuarios() {
  const input = document.getElementById('searchInput').value.toLowerCase()
  const tabela = document.getElementById('userTable').getElementsByTagName('tbody')[0]
  const linhas = tabela.getElementsByTagName('tr')

  let encontrou = false

  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i]
    
    if (linha.id === 'mensagemVazia') continue //Ignora a linha da mensagem

    const nome = linha.getElementsByTagName('td')[0]?.textContent.toLowerCase() || ''
    const email = linha.getElementsByTagName('td')[1]?.textContent.toLowerCase() || ''

    if (nome.includes(input) || email.includes(input)) {
      linha.style.display = ''
      encontrou = true
    } else {
      linha.style.display = 'none'
    }
  }

  const mensagem = document.getElementById('mensagemVazia') //Exibe ou oculta a mensagem de "nenhum usuário encontrado"
  mensagem.style.display = encontrou ? 'none' : ''
}

//==================================
// Preenche o formulário para edição
//==================================
function editarUsuario(index) {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || []
  const user = usuarios[index]

  document.querySelector("#id").value = user.id
  document.querySelector("#usuario").value = user.nome
  document.querySelector("#loginUser").value = user.email
  document.querySelector("#senhaUser").value = user.senha
}

//==============================
// Exclui um usuário do sistema
//==============================
function apagarUsuario(index) {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || []

  if (confirm("Deseja realmente excluir este usuário?")) {
    usuarios.splice(index, 1)
    localStorage.setItem("usuarios", JSON.stringify(usuarios))
    tabelaUsuarios()
  }
}

//==============================
// Limpa os campos do formulário
//==============================
function limpar() {
  document.querySelector("#id").value = ""
  document.querySelector("#usuario").value = ""
  document.querySelector("#loginUser").value = ""
  document.querySelector("#senhaUser").value = ""
}