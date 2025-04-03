// Lista de usuários
const usuarios = [
    { nome: "danilo", senha: "150105", admin: true },
    { nome: "marcos", senha: "toninha1002", admin: true },
    { nome: "raquel", senha: "toninha1002", admin: false }
];

// Função para validar login
function validarLogin(event) {
    event.preventDefault(); // Evita o recarregamento da página

    const usuarioInput = document.getElementById("usuario").value.trim().toLowerCase();
    const senhaInput = document.getElementById("senha").value.trim();

    // Verifica se o usuário existe
    const usuarioEncontrado = usuarios.find(user => user.nome === usuarioInput && user.senha === senhaInput);

    if (usuarioEncontrado) {
        // Salva o nome do usuário no localStorage para exibir na tela geral
        localStorage.setItem("usuarioLogado", usuarioEncontrado.nome);
        localStorage.setItem("isAdmin", usuarioEncontrado.admin);

        // Redireciona para a tela geral
        window.location.href = "index.html";
    } else {
        alert("Usuário ou senha incorretos!");
    }
}

// Exibir mensagem de boas-vindas na tela geral
function exibirMensagemBoasVindas() {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    if (usuarioLogado) {
        alert(`Bem-vindo, ${usuarioLogado}!`);
    }
}

// Certifique-se de chamar `exibirMensagemBoasVindas` na página geral
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("pagina-geral.html")) {
        exibirMensagemBoasVindas();
    }
});
