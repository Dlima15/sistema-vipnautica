// Lista de usuários
const usuarios = [
    { nome: "danilo", senha: "150105", admin: true },
    { nome: "marcos", senha: "toninha1002", admin: true },
    { nome: "raquel", senha: "toninha1002", admin: false }
];

// Variável global para guardar os dados do JSON
let dadosJson = [];

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

// ======================= INICIO FUNÇÃO FILTRAR TABELA =======================
function filtrarBarcos() {
    const estaleiro = document.getElementById("filtroEstaleiro").value.toLowerCase();
    const modelo = document.getElementById("filtroModelo").value.toLowerCase();
    const ano = document.getElementById("filtroAno").value.toLowerCase();
    const motor = document.getElementById("filtroMotor").value.toLowerCase();
    const combustivel = document.getElementById("filtroCombustivel").value.toLowerCase();
    const horas = document.getElementById("filtroHoras").value.toLowerCase();
    const local = document.getElementById("filtroLocal").value.toLowerCase();
    const valorMin = parseFloat(document.getElementById("filtroPrecoMin").value) || 0;
    const valorMax = parseFloat(document.getElementById("filtroPrecoMax").value) || Infinity;

    const dadosFiltrados = dadosJson.filter(item => {
        const valorItem = parseFloat(item.valor.replace("R$ ", "").replace(/\./g, "").replace(",", "."));

        return item.estaleiro.toLowerCase().includes(estaleiro) &&
               item.modelo.toLowerCase().includes(modelo) &&
               item.ano.toLowerCase().includes(ano) &&
               item.motor.toLowerCase().includes(motor) &&
               item.combustivel.toLowerCase().includes(combustivel) &&
               item.horas.toLowerCase().includes(horas) &&
               item.local.toLowerCase().includes(local) &&
               valorItem >= valorMin &&
               valorItem <= valorMax;
    });

    exibirBarcos(dadosFiltrados);
}
// ======================= FIM FUNÇÃO FILTRAR TABELA =======================

function exibirBarcos(lista) {
    const tabela = document.getElementById("corpoTabela");
    if (!tabela) return;
    tabela.innerHTML = "";

    lista.forEach(barco => {
        const descritivoSeguro = (barco.Descritivo || 'Sem descritivo').replace(/`/g, '\\`');
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
            <td>
                <button onclick="copiarDescritivo(\`${descritivoSeguro}\`)">📋 Copiar Descritivo</button>
            </td>
        `;
        tabela.appendChild(tr);
    });

    aplicarRestricoesParaNaoAdmin();
}


// Copiar descritivo
function copiarDescritivo(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        alert("Descritivo copiado com sucesso!");
    }).catch(err => {
        console.error("Erro ao copiar:", err);
    });
}

// Função para buscar os dados JSON e montar a tabela
async function carregarEmbarcacoes() {
    const tabela = document.getElementById("corpoTabela");
    if (!tabela) return;

    try {
        const response = await fetch('./js/barcos.json');
        const embarcacoes = await response.json();
        dadosJson = embarcacoes; // armazena na variável global para filtro
        exibirBarcos(dadosJson);
    } catch (error) {
        console.error("Erro ao carregar embarcações:", error);
    }
}

// Chamar ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    carregarEmbarcacoes();
    mostrarUsuario();
});
