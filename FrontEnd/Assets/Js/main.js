// Lista de usuários
const usuarios = [
    { nome: "danilo", senha: "150105", admin: true },
    { nome: "marcos", senha: "toninha1002", admin: true },
    { nome: "raquel", senha: "toninha1002", admin: false }
];

// Validar login
function validarLogin(event) {
    event.preventDefault();
    const usuario = document.getElementById("usuario").value.trim().toLowerCase();
    const senha = document.getElementById("senha").value.trim();
    const user = usuarios.find(u => u.nome === usuario && u.senha === senha);
    if (user) {
        localStorage.setItem("usuarioLogado", user.nome);
        localStorage.setItem("isAdmin", user.admin);
        window.location.href = "index.html";
    } else {
        alert("Usuário ou senha incorretos!");
    }
}

// Logout
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

// Mostrar barra superior com dados do usuário
function mostrarUsuario() {
    const nome = localStorage.getItem("usuarioLogado");
    const admin = localStorage.getItem("isAdmin") === "true";
    if (nome) {
        const header = document.querySelector("header");
        const barra = document.createElement("div");
        barra.className = "barra-usuario";
        barra.innerHTML = `Bem-vindo, <strong>${nome}</strong> (${admin ? 'Admin' : 'Usuário'}) <button onclick="logout()">Sair</button>`;
        header.appendChild(barra);
    }
}

// Restrições visuais para não admin
function aplicarRestricoesParaNaoAdmin() {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
        document.querySelectorAll("td:nth-child(10), td:nth-child(11)").forEach(td => {
            td.style.filter = "blur(5px)";
            td.classList.add("no-select");
        });
        document.querySelectorAll("td:nth-child(13)").forEach(td => td.style.display = "none");
        const thAdmin = document.querySelector("th:nth-child(13)");
        if (thAdmin) thAdmin.style.display = "none";
        const btnCadastro = document.querySelector(".cadastro-container");
        if (btnCadastro) btnCadastro.style.display = "none";
    }
}

// Carregar embarcações na tabela
function carregarEmbarcacoes(filtros = {}) {
    const tabela = document.querySelector("tbody");
    if (!tabela) return;
    tabela.innerHTML = "";
    let embarcacoes = JSON.parse(localStorage.getItem("embarcacoes")) || [];

    // Aplicar filtros
    embarcacoes = embarcacoes.filter(emb => {
        return Object.entries(filtros).every(([chave, valor]) =>
            valor === "" || (emb[chave] || "").toLowerCase().includes(valor.toLowerCase())
        );
    });

    embarcacoes.forEach((emb, i) => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td><img src="${emb.foto || 'default.png'}" width="50"></td>
            <td>${emb.sku}</td>
            <td>${emb.estaleiro}</td>
            <td>${emb.modelo}</td>
            <td>R$ ${emb.valor}</td>
            <td>${emb.ano}</td>
            <td>${emb.motor}</td>
            <td>${emb.combustivel}</td>
            <td>${emb.horas}</td>
            <td>${emb.proprietario}</td>
            <td>${emb.local}</td>
            <td>${emb.anuncio || ''}</td>
            <td><button class="editar" data-index="${i}">✏️</button> <button class="excluir" data-index="${i}">🗑️</button></td>
        `;
        tabela.appendChild(linha);
    });
    adicionarEventosBotoes();
}

function adicionarEventosBotoes() {
    document.querySelectorAll(".excluir").forEach(btn => {
        btn.onclick = () => excluirEmbarcacao(btn.dataset.index);
    });
    document.querySelectorAll(".editar").forEach(btn => {
        btn.onclick = () => editarEmbarcacao(btn.dataset.index);
    });
}

function excluirEmbarcacao(index) {
    let embarcacoes = JSON.parse(localStorage.getItem("embarcacoes")) || [];
    embarcacoes.splice(index, 1);
    localStorage.setItem("embarcacoes", JSON.stringify(embarcacoes));
    carregarEmbarcacoes();
}

function editarEmbarcacao(index) {
    localStorage.setItem("embarcacaoEditIndex", index);
    window.location.href = "editboats.html";
}

// Filtro
function configurarFiltros() {
    const campos = document.querySelectorAll(".filtro input");
    const btn = document.querySelector(".botao-busca");
    if (!btn) return;
    btn.onclick = () => {
        const filtros = {};
        campos.forEach(campo => {
            const placeholder = campo.placeholder.toLowerCase().replace("r$", "valor");
            const chave = placeholder.includes("de") || placeholder.includes("até") ? "valor" : placeholder;
            filtros[chave] = campo.value;
        });
        carregarEmbarcacoes(filtros);
    };
}

// Gerar SKU único
function gerarSKU() {
    const prefixo = "SKU";
    const timestamp = Date.now().toString(36);
    const aleatorio = Math.floor(Math.random() * 10000).toString(36);
    return `${prefixo}-${timestamp}-${aleatorio}`.toUpperCase();
}

// Cadastrar embarcação
function cadastrarEmbarcacao(event) {
    event.preventDefault();

    const nova = {
        sku: gerarSKU(),
        estaleiro: document.querySelector("input[name='estaleiro']").value,
        modelo: document.querySelector("input[name='modelo']").value,
        motor: document.querySelector("input[name='motor']").value,
        ano: document.querySelector("input[name='ano']").value,
        local: document.querySelector("input[name='local']").value,
        valor: document.querySelector("input[name='valor']").value,
        combustivel: document.querySelector("input[name='combustivel']").value,
        captador: document.querySelector("input[name='captador']").value,
        horas: document.querySelector("input[name='horas']").value,
        proprietario: document.querySelector("input[name='proprietario']").value,
        foto: "", // Será preenchido abaixo se houver imagem
        anuncio: ""
    };

    const fileInput = document.querySelector("input[type='file']");
    if (fileInput && fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function (e) {
            nova.foto = e.target.result;
            salvarEmbarcacao(nova);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        salvarEmbarcacao(nova);
    }
}

function salvarEmbarcacao(embarcacao) {
    const embarcacoes = JSON.parse(localStorage.getItem("embarcacoes")) || [];
    embarcacoes.push(embarcacao);
    localStorage.setItem("embarcacoes", JSON.stringify(embarcacoes));
    window.location.href = "index.html";
}

// Iniciar página
document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    if (!localStorage.getItem("usuarioLogado") && !path.includes("login.html")) {
        alert("Você precisa estar logado!");
        return window.location.href = "login.html";
    }

    if (path.includes("index.html")) {
        mostrarUsuario();
        aplicarRestricoesParaNaoAdmin();
        configurarFiltros();
        carregarEmbarcacoes();

        const btnCadastro = document.querySelector(".botao-cadastro");
        if (btnCadastro) btnCadastro.onclick = () => window.location.href = "cadastroboat.html";
    }

    if (path.includes("cadastroboat.html")) {
        const form = document.querySelector("form");
        if (form) form.addEventListener("submit", cadastrarEmbarcacao);
    }
});
