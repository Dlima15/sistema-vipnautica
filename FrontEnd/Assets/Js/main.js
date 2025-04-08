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

// Aplicar restrições visuais se não for admin
function aplicarRestricoesParaNaoAdmin() {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
        // Colunas Proprietário e Local borradas
        document.querySelectorAll("td:nth-child(10), td:nth-child(11)").forEach(td => {
            td.style.filter = "blur(4px)";
            td.classList.add("no-select");
        });
        // Coluna Ações sumir
        document.querySelectorAll("td:nth-child(13)").forEach(td => td.style.display = "none");
        const thAdmin = document.querySelector("th:nth-child(13)");
        if (thAdmin) thAdmin.style.display = "none";
        // Botão cadastrar sumir
        const btnCadastro = document.querySelector(".cadastro-container");
        if (btnCadastro) btnCadastro.style.display = "none";
    }
}

// Função para buscar os dados JSON e montar a tabela
async function carregarEmbarcacoes() {
    const tabela = document.getElementById("corpoTabela");
    if (!tabela) return;

    try {
        const response = await fetch('./js/barcos.json');
        const embarcacoes = await response.json();

        tabela.innerHTML = "";

        embarcacoes.forEach(barco => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><img src="${barco.foto}" width="100"></td>
                <td>${barco.sku}</td>
                <td>${barco.estaleiro}</td>
                <td>${barco.modelo}</td>
                <td>${barco.valor}</td>
                <td>${barco.ano}</td>
                <td>${barco.motor}</td>
                <td>${barco.combustivel}</td>
                <td>${barco.horas}</td>
                <td>${barco.proprietario}</td>
                <td>${barco.local}</td>
                <td><a href="${barco.anuncio}" target="_blank">Ver Anúncio</a></td>
            `;
            tabela.appendChild(tr);
        });

    } catch (error) {
        console.error("Erro ao carregar embarcações:", error);
    }
}

// Chamar ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    carregarEmbarcacoes();
});